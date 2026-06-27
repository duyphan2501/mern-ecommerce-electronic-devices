const MERGE_CART_LUA = `
-- MERGE_CART_LUA
-- KEYS: 1.guestCartKey, 2.userCartKey, 3.zsetKey
-- ARGV: 1.guestOwnerId, 2.userOwnerId, 3.cartExpireAt, 4.reserveExpireAt

local guestCartKey = KEYS[1]
local userCartKey = KEYS[2]
local zsetKey = KEYS[3]

local guestOwnerId = ARGV[1]
local userOwnerId = ARGV[2]
local cartExpireAt = tonumber(ARGV[3])
local reserveExpireAt = tonumber(ARGV[4])

local guestCart = redis.call("HGETALL", guestCartKey)
local results = {}

for i = 1, #guestCart, 2 do
    local field = guestCart[i]
    local guestQty = tonumber(guestCart[i + 1]) or 0
    local modelId = string.match(field, "^product:(.+)$")

    if modelId and guestQty > 0 then
        local guestReserveKey = "reservation:" .. guestOwnerId .. ":" .. modelId
        local userReserveKey = "reservation:" .. userOwnerId .. ":" .. modelId
        local stockKey = "stock:" .. modelId

        local actualGuestQty = tonumber(redis.call("HGET", guestReserveKey, "qty")) or 0
        local currentUserQty = tonumber(redis.call("HGET", userReserveKey, "qty")) or 0
        local qtyToAdd = actualGuestQty

        -- Nếu giữ chỗ của khách đã hết hạn, cố gắng giữ chỗ lại dựa trên số lượng khả dụng trong kho tổng
        if qtyToAdd <= 0 then
            local available = tonumber(redis.call("HGET", stockKey, "available")) or 0
            if available > 0 then
                qtyToAdd = math.min(guestQty, available)
                redis.call("HINCRBY", stockKey, "available", -qtyToAdd)
                redis.call("HINCRBY", stockKey, "reserved", qtyToAdd)
            end
        end

        -- Dọn dẹp key giữ chỗ cũ của guest
        redis.call("DEL", guestReserveKey)
        redis.call("ZREM", zsetKey, guestReserveKey)

        -- Tính tổng số lượng mới sau khi gộp cho User
        local targetQty = currentUserQty + qtyToAdd
        
        if targetQty > 0 then
            redis.call("HSET", userReserveKey, "qty", targetQty, "expireAt", reserveExpireAt)
            redis.call("ZADD", zsetKey, reserveExpireAt, userReserveKey)
            redis.call("HSET", userCartKey, "product:" .. modelId, targetQty)
            
            -- CHỈ ĐƯA VÀO KẾT QUẢ NẾU THỰC SỰ CÓ HÀNG TRONG GIỎ
            table.insert(results, modelId)
            table.insert(results, tostring(targetQty))
        else
            -- Nếu không có hàng và không giữ được chỗ, xóa trường này khỏi giỏ user (nếu có cũ)
            redis.call("HDEL", userCartKey, "product:" .. modelId)
        end
    end
end

-- Xóa toàn bộ giỏ hàng của Guest sau khi đã duyệt qua
redis.call("DEL", guestCartKey)

if #results > 0 then
    redis.call("EXPIREAT", userCartKey, cartExpireAt)
end

return results
`;

const LOAD_CART_READ_ONLY_LUA = `
-- LOAD_CART_READ_ONLY_LUA (Tối ưu tuyệt đối khi có Cache Stock)
local cartKey = KEYS[1]
local ownerId = ARGV[1]

local cartData = redis.call("HGETALL", cartKey)
if #cartData == 0 then return {} end

local results = {}

for i = 1, #cartData, 2 do
    local field = cartData[i]
    local qtyInCart = tonumber(cartData[i+1]) or 0
    local modelId = string.match(field, "^product:(.+)$")
    
    if modelId then
        local reserveKey = "reservation:" .. ownerId .. ":" .. modelId
        local stockKey = "stock:" .. modelId

        local reservedQty = tonumber(redis.call("HGET", reserveKey, "qty")) or 0
        local availableQty = tonumber(redis.call("HGET", stockKey, "available")) or 0
        
        local status = "available"

        -- Phân tách trạng thái trực tiếp trong RAM của Redis:
        if reservedQty > 0 then
            status = "available"
        else
            if availableQty <= 0 then
                status = "out_of_stock" -- Hết hàng hoàn toàn (Không thể gia hạn)
            else
                status = "expired"      -- Quá hạn giữ chỗ (Nhưng kho tổng vẫn còn hàng để gia hạn)
            end
        end
        
        table.insert(results, modelId)
        table.insert(results, tostring(qtyInCart)) 
        table.insert(results, status) 
    end
end

return results
`

const REMOVE_ITEM_LUA = `
-- KEYS: 1.stockKey, 2.reserveKey, 3.cartKey, 4.zsetKey
-- ARGV: 1.modelId

local stockKey, reserveKey, cartKey, zsetKey = KEYS[1], KEYS[2], KEYS[3], KEYS[4]
local modelId = ARGV[1]

local qty = tonumber(redis.call("HGET", reserveKey, "qty")) or 0

if qty > 0 then
    redis.call("HINCRBY", stockKey, "available", qty)
    redis.call("HINCRBY", stockKey, "reserved", -qty)
end

redis.call("DEL", reserveKey)
redis.call("ZREM", zsetKey, reserveKey)
redis.call("HDEL", cartKey, "product:" .. modelId)

return qty
`;

export { MERGE_CART_LUA, REMOVE_ITEM_LUA, LOAD_CART_READ_ONLY_LUA };
