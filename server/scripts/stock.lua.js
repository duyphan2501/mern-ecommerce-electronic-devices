const RESERVE_LUA = `
-- KEYS: 1.stockKey, 2.reserveKey, 3.cartKey, 4.zsetKey
-- ARGV: 1.modelId, 2.targetQty, 3.cartExpireAt, 4.reserveExpireAt

local stockKey, reserveKey, cartKey, zsetKey = KEYS[1], KEYS[2], KEYS[3], KEYS[4]
local modelId = ARGV[1]
local requestedQty = tonumber(ARGV[2])
local cartExpireAt = tonumber(ARGV[3])
local reserveExpireAt = tonumber(ARGV[4])

local oldQty = tonumber(redis.call("HGET", reserveKey, "qty")) or 0
local available = tonumber(redis.call("HGET", stockKey, "available")) or 0
local diff = requestedQty - oldQty
local status = 0 -- 0: OK, 1: Out of stock, 2: Adjusted

-- Trường hợp 1: Muốn tăng nhưng kho đã hết sạch
if diff > 0 and available <= 0 then 
    return { oldQty, 1 } 
end

-- Trường hợp 2: Muốn tăng nhưng kho không đủ (Điều chỉnh)
local finalTargetQty = requestedQty
if diff > 0 and available < diff then
    diff = available
    finalTargetQty = oldQty + diff
    status = 2
end

-- Cập nhật Stock
if diff ~= 0 then
    redis.call("HINCRBY", stockKey, "available", -diff)
    redis.call("HINCRBY", stockKey, "reserved", diff)
end

-- Cập nhật dữ liệu giỏ hàng & giữ chỗ
if finalTargetQty <= 0 then
    redis.call("DEL", reserveKey)
    redis.call("HDEL", cartKey, "product:" .. modelId)
    redis.call("ZREM", zsetKey, reserveKey)
else 
    redis.call("HSET", reserveKey, "qty", finalTargetQty, "expireAt", reserveExpireAt)
    redis.call("ZADD", zsetKey, reserveExpireAt, reserveKey)
    redis.call("HSET", cartKey, "product:" .. modelId, finalTargetQty)
    redis.call("EXPIREAT", cartKey, cartExpireAt)
end

return { finalTargetQty, status }
`;


// SCRIPT 2: Hoàn kho tự động khi hết hạn
const RECLAIM_LUA = `
local zsetKey = KEYS[1]
local now = tonumber(ARGV[1])

local keys = redis.call(
    "ZRANGEBYSCORE",
    zsetKey,
    0,
    now,
    "LIMIT", 0, 100
)

for _, reserveKey in ipairs(keys) do
    local data = redis.call("HGETALL", reserveKey)

    if #data > 0 then
        local map = {}
        for i = 1, #data, 2 do
            map[data[i]] = data[i + 1]
        end

        local qty = tonumber(map["qty"])
        local modelId = reserveKey:match("([^:]+)$")
        local ownerId = reserveKey:match("reservation:(.-):")

        redis.call("HINCRBY", "stock:" .. modelId, "available", qty)
        redis.call("HINCRBY", "stock:" .. modelId, "reserved", -qty)
        redis.call("HDEL", "cart:" .. ownerId, "product:" .. modelId)
        redis.call("DEL", reserveKey)
    end

    redis.call("ZREM", zsetKey, reserveKey)
end

return #keys
`;
const CONFIRM_ORDER_LUA = `
-- KEYS: 1.stockKey, 2.reserveKey, 3.cartKey, 4.zsetKey
-- ARGV: 1.modelId

local qty = tonumber(redis.call("HGET", KEYS[2], "qty")) or 0

if qty > 0 then
    -- 1. Giảm lượng 'reserved' vì hàng đã đi thật (available đã trừ từ lúc AddToCart)
    redis.call("HINCRBY", KEYS[1], "reserved", -qty)
    
    -- 2. Dọn rác
    redis.call("DEL", KEYS[2])
    redis.call("ZREM", KEYS[4], KEYS[2])
    redis.call("HDEL", KEYS[3], "product:" .. ARGV[1])
    
    return qty
end
return 0
`;
export { RESERVE_LUA, RECLAIM_LUA, CONFIRM_ORDER_LUA };
