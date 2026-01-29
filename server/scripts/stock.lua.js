const RESERVE_LUA = `
-- KEYS: 1.stockKey, 2.reserveKey, 3.cartKey, 4.zsetKey
-- ARGV: 1.modelId, 2.targetQty, 3.cartExpireAt, 4.reserveExpireAt

local stockKey, reserveKey, cartKey, zsetKey = KEYS[1], KEYS[2], KEYS[3], KEYS[4]
local modelId = ARGV[1]
local targetQty = tonumber(ARGV[2])
local cartExpireAt = tonumber(ARGV[3])
local reserveExpireAt = tonumber(ARGV[4])

-- 1. Lấy lượng hàng đang giữ hiện tại (kiểu HASH)
local oldQty = tonumber(redis.call("HGET", reserveKey, "qty")) or 0
local diff = targetQty - oldQty

-- 2. Kiểm tra tồn kho khả dụng
if diff > 0 then
    local available = tonumber(redis.call("HGET", stockKey, "available")) or 0
    if available < diff then
        diff = available
        targetQty = oldQty + diff
    end
end

-- 3. Cập nhật Stock (Chống oversell)
if diff ~= 0 then
    redis.call("HINCRBY", stockKey, "available", -diff)
    redis.call("HINCRBY", stockKey, "reserved", diff)
end

-- 4. Đồng bộ dữ liệu
if targetQty <= 0 then
    redis.call("DEL", reserveKey)
    redis.call("HDEL", cartKey, "product:" .. modelId)
    redis.call("ZREM", zsetKey, reserveKey)
else 
    -- Cập nhật giữ chỗ (Hết hạn sớm)
    redis.call("HSET", reserveKey, "qty", targetQty, "expireAt", reserveExpireAt)
    redis.call("ZADD", zsetKey, reserveExpireAt, reserveKey)
    
    -- Cập nhật giỏ hàng (Hết hạn muộn)
    redis.call("HSET", cartKey, "product:" .. modelId, targetQty)
    redis.call("EXPIREAT", cartKey, cartExpireAt) -- Gia hạn toàn bộ giỏ
end

return targetQty
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

export { RESERVE_LUA, RECLAIM_LUA };