const MERGE_CART_LUA = `
-- KEYS: 1.guestReserve, 2.userReserve, 3.stockKey, 4.userCartKey, 5.zsetKey
-- ARGV: 1.modelId, 2.guestQty, 3.cartExpireAt, 4.reserveExpireAt

local guestReserveKey = KEYS[1]
local userReserveKey = KEYS[2]
local stockKey = KEYS[3]
local userCartKey = KEYS[4]
local zsetKey = KEYS[5]

local modelId = ARGV[1]
local guestQty = tonumber(ARGV[2])
local cartExpireAt = tonumber(ARGV[3]) -- Mốc xóa giỏ hàng (Timestamp)
local reserveExpireAt = tonumber(ARGV[4]) -- Mốc hoàn kho (Timestamp)

-- 1. Lấy lượng hàng thực tế từ Hash (Sử dụng HGET thay vì GET)
local actualGuestQty = tonumber(redis.call("HGET", guestReserveKey, "qty")) or 0
local currentUserQty = tonumber(redis.call("HGET", userReserveKey, "qty")) or 0

-- 2. Xóa giữ chỗ của Guest (Thu hồi kho nội bộ trong scope Lua)
redis.call("DEL", guestReserveKey)
redis.call("ZREM", zsetKey, guestReserveKey)

-- 3. Tính tổng số lượng mới cho User
local targetQty = currentUserQty + actualGuestQty

-- 4. Cập nhật dữ liệu cho User
if targetQty > 0 then
    -- Cập nhật Giữ chỗ (Hash + ZSET)
    redis.call("HSET", userReserveKey, 
        "qty", targetQty, 
        "expireAt", reserveExpireAt
    )
    redis.call("ZADD", zsetKey, reserveExpireAt, userReserveKey)

    -- Cập nhật Giỏ hàng (Hash + gia hạn EXPIREAT)
    redis.call("HSET", userCartKey, "product:" .. modelId, targetQty)
    redis.call("EXPIREAT", userCartKey, cartExpireAt)
end

return targetQty
`;
const REMOVE_ITEM_LUA = `
-- KEYS: 1.stockKey, 2.reserveKey, 3.cartKey, 4.zsetKey
-- ARGV: 1.modelId

local stockKey, reserveKey, cartKey, zsetKey = KEYS[1], KEYS[2], KEYS[3], KEYS[4]
local modelId = ARGV[1]

-- 1. Lấy lượng hàng đang giữ để hoàn kho
local qty = tonumber(redis.call("HGET", reserveKey, "qty")) or 0

if qty > 0 then
    -- Cộng lại available, trừ bớt reserved
    redis.call("HINCRBY", stockKey, "available", qty)
    redis.call("HINCRBY", stockKey, "reserved", -qty)
end

-- 2. Xóa sạch mọi dấu vết
redis.call("DEL", reserveKey)
redis.call("ZREM", zsetKey, reserveKey)
redis.call("HDEL", cartKey, "product:" .. modelId)

return qty
`;

export { MERGE_CART_LUA, REMOVE_ITEM_LUA };