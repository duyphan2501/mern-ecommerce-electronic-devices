const RESERVE_LUA = `
-- KEYS: 1.stockKey, 2.reserveKey, 3.cartKey, 4.zsetKey
-- ARGV: 1.modelId, 2.targetQty, 3.cartExpireAt, 4.reserveExpireAt

local stockKey, reserveKey, cartKey, zsetKey = KEYS[1], KEYS[2], KEYS[3], KEYS[4]
local modelId = ARGV[1]
local requestedQty = tonumber(ARGV[2])
local cartExpireAt = tonumber(ARGV[3])
local reserveExpireAt = tonumber(ARGV[4])

local oldQty = tonumber(redis.call("HGET", reserveKey, "qty")) or 0
local qtyInCart = tonumber(redis.call("HGET", cartKey, "product:" .. modelId)) or 0
local available = tonumber(redis.call("HGET", stockKey, "available")) or 0

-- THỰC SỰ MUỐN XÓA HẲN SẢN PHẨM KHI ĐÃ HẾT HẠN (requestedQty <= 0)
if oldQty == 0 and qtyInCart > 0 and requestedQty <= 0 then
    redis.call("HDEL", cartKey, "product:" .. modelId)
    redis.call("DEL", reserveKey)
    redis.call("ZREM", zsetKey, reserveKey)
    return { 0, 0 } -- Trả về số lượng 0, status 0 (Thành công), không chạm kho tổng
end

-- LUỒNG XỬ LÝ KHI GIỮ CHỖ ĐÃ CHẾT NHƯNG USER VẪN MUỐN GIỮ LẠI MỘT LƯỢNG HÀNG (> 0)
-- Bất kể là user bấm Tăng, Giữ nguyên (Renew) hay Giảm (vẫn giữ > 0)
-- Lượng hàng cần cấp mới thực tế từ kho tổng chính là requestedQty (vì oldQty đã về 0)
local diff = requestedQty - oldQty
local status = 0 

-- Trường hợp 1: Kho tổng đã hết sạch hàng, không thể cấp reservation mới
if diff > 0 and available <= 0 then 
    -- Trả về số lượng cũ (0) vì không thể giữ chỗ được món nào, kèm status lỗi kho (1)
    -- Tầng Backend nhận được sẽ hiểu là: Không thể gia hạn/giảm giữ chỗ vì kho đã hết sạch hàng.
    return { qtyInCart, 1 } 
end

-- Trường hợp 2: Kho tổng không đủ cấp toàn bộ lượng requestedQty (Điều chỉnh giảm xuống tối đa có thể)
local finalTargetQty = requestedQty
if diff > 0 and available < diff then
    diff = available
    finalTargetQty = oldQty + diff
    status = 2 -- Thành công một phần (cấp giữ chỗ được ít hơn số lượng mong muốn)
end

-- Cập nhật Kho tổng (Master Inventory)
if diff ~= 0 then
    redis.call("HINCRBY", stockKey, "available", -diff)
    redis.call("HINCRBY", stockKey, "reserved", diff)
end

-- Cập nhật dữ liệu giỏ hàng & tạo lại giữ chỗ mới thành công
if finalTargetQty <= 0 then
    redis.call("DEL", reserveKey)
    redis.call("HDEL", cartKey, "product:" .. modelId)
    redis.call("ZREM", zsetKey, reserveKey)
else 
    redis.call("HSET", reserveKey, "qty", finalTargetQty, "expireAt", reserveExpireAt)
    
    -- Đẩy lại vào ZSET cho worker quét hết hạn lần sau
    redis.call("ZADD", zsetKey, reserveExpireAt, reserveKey)
    
    -- Cập nhật lại số lượng thực tế được chấp nhận vào giỏ hàng
    redis.call("HSET", cartKey, "product:" .. modelId, finalTargetQty)
    
    if redis.call("TTL", cartKey) < 0 then
        redis.call("EXPIREAT", cartKey, cartExpireAt)
    end
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
const CHECKOUT_BATCH_LUA = `
-- KEYS: Không cần truyền (Sử dụng cấu trúc mảng động truyền qua ARGV để xử lý Batch)
-- ARGV: [ownerId, modelId1, requestedQty1, modelId2, requestedQty2, ...]

local ownerId = ARGV[1]
local itemsCount = (#ARGV - 1) / 2
local steps = {}

-- 🔄 VÒNG LẶP 1: KIỂM TRA ĐIỀU KIỆN (VALIDATE ALL)
for i = 1, itemsCount do
    local idx = 1 + (i - 1) * 2
    local modelId      = ARGV[idx + 1]
    local requestedQty = tonumber(ARGV[idx + 2]) or 0
    
    local reserveKey = "reservation:" .. ownerId .. ":" .. modelId
    local stockKey   = "stock:" .. modelId
    
    local reservedQty = tonumber(redis.call("HGET", reserveKey, "qty")) or 0
    
    if reservedQty < requestedQty then
        local neededFromAvailable = requestedQty - reservedQty
        local available = tonumber(redis.call("HGET", stockKey, "available")) or 0
        
        if available < neededFromAvailable then
            return { 0, modelId } -- Thất bại: Trả về trạng thái 0 và ModelId bị thiếu hàng
        end
        steps[i] = { type = "mixed", resQty = reservedQty, availQty = neededFromAvailable }
    else
        steps[i] = { type = "pure_reserve", resQty = requestedQty }
    end
end

-- 🔄 VÒNG LẶP 2: THỰC THI GHI DỮ LIỆU (COMMIT REDIS)
for i = 1, itemsCount do
    local idx = 1 + (i - 1) * 2
    local modelId    = ARGV[idx + 1]
    local plan       = steps[i]
    
    local reserveKey = "reservation:" .. ownerId .. ":" .. modelId
    local stockKey   = "stock:" .. modelId
    local zsetKey    = "reservation:zset"
    
    -- Khấu trừ các trường số lượng trong kho tổng Redis
    if plan.type == "pure_reserve" then
        if plan.resQty > 0 then
            redis.call("HINCRBY", stockKey, "reserved", -plan.resQty)
        end
    else
        if plan.resQty > 0 then
            redis.call("HINCRBY", stockKey, "reserved", -plan.resQty)
        end
        if plan.availQty > 0 then
            redis.call("HINCRBY", stockKey, "available", -plan.availQty)
        end
    end
    
    -- 🧹 CHỈ DỌN SẠCH DỮ LIỆU GIỮ CHỖ (Giữ nguyên giỏ hàng DB/Redis)
    redis.call("DEL", reserveKey)
    redis.call("ZREM", zsetKey, reserveKey)
end

return { 1, "SUCCESS" }
`;

// =========================================================================
// LUA SCRIPT 2: ROLLBACK_BATCH_LUA (Hoàn tác nguyên tử nếu MongoDB sập)
// =========================================================================
const ROLLBACK_BATCH_LUA = `
-- KEYS: Không cần truyền
-- ARGV: [ownerId, modelId1, rollbackQty1, reserveExpireAt, modelId2, rollbackQty2, reserveExpireAt, ...]

local ownerId = ARGV[1]
local itemsCount = (#ARGV - 1) / 3

for i = 1, itemsCount do
    local idx = 1 + (i - 1) * 3
    local modelId         = ARGV[idx + 1]
    local rollbackQty     = tonumber(ARGV[idx + 2]) or 0
    local reserveExpireAt = tonumber(ARGV[idx + 3]) or 0
    
    local stockKey   = "stock:" .. modelId
    local reserveKey = "reservation:" .. ownerId .. ":" .. modelId
    local zsetKey    = "reservation:zset"
    
    if rollbackQty > 0 then
        -- Phục hồi kho khả dụng trên Redis (Vì MongoDB chưa thực trừ)
        redis.call("HINCRBY", stockKey, "available", rollbackQty)
        
        -- Dựng lại toàn bộ Key Reservation đã xóa ở bước Checkout hụt
        redis.call("HSET", reserveKey, "qty", rollbackQty, "expireAt", reserveExpireAt)
        
        -- Đẩy lại vào ZSET để Worker quét hết hạn xử lý bình thường
        redis.call("ZADD", zsetKey, reserveExpireAt, reserveKey)
    end
end

return { 1, "ROLLBACK_SUCCESS" }
`;

export { RESERVE_LUA, RECLAIM_LUA, CONFIRM_ORDER_LUA, CHECKOUT_BATCH_LUA, ROLLBACK_BATCH_LUA };
