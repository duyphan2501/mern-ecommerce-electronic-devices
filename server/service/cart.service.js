import { getCartExpireAt, getReserveExpireAt } from "../config/constants.js";
import redisClient from "../config/init.redis.js";
import { formatCartItemInfo } from "../helper/cart.helper.js";
import CartModel from "../model/cart.model.js";
import { LOAD_CART_READ_ONLY_LUA, MERGE_CART_LUA, REMOVE_ITEM_LUA } from "../scripts/cart.lua.js";
import {
  buildReplaceCartMongoOp,
  buildSetCartItemMongoUpdate,
  cartHashToItems,
} from "../helper/cart-merge.helper.js";
import { StockService } from "./stock.service.js";
import { v4 as uuidv4 } from "uuid";

const syncRedisCartToMongo = async (userId, modelId, finalQty) => {
  if (!userId || !modelId) return;

  try {
    const { filter, update, options } = buildSetCartItemMongoUpdate(
      userId,
      modelId,
      finalQty,
    );

    await CartModel.updateOne(filter, update, options);
  } catch (err) {
    console.error("DB Sync Error:", err);
  }
};

const mergeCart = async (guestCartId, userId) => {
  const guestKey = `cart:${guestCartId}`;
  const userKey = `cart:${userId}`;

  // 1. Kiểm tra giỏ hàng guest trước khi chạy
  const guestCart = await redisClient.hGetAll(guestKey);
  if (!guestCart || Object.keys(guestCart).length === 0) {
    return await loadCart(userId, null);
  }

  // 2. Thực thi LUA và nhận về mảng phẳng dạng: ['modelId1', 'qty1', 'modelId2', 'qty2']
  const luaResults = await redisClient.eval(MERGE_CART_LUA, {
    keys: [guestKey, userKey, "reservation:zset"],
    arguments: [
      guestCartId.toString(),
      userId.toString(),
      getCartExpireAt("USER").toString(),
      getReserveExpireAt().toString(),
    ],
  });

  // 3. Chuyển đổi mảng phẳng từ LUA thành cấu trúc mảng items chuẩn cho MongoDB
  const mergedItems = [];
  for (let i = 0; i < luaResults.length; i += 2) {
    mergedItems.push({
      modelId: luaResults[i],
      quantity: parseInt(luaResults[i + 1], 10),
    });
  }

  // 4. Đồng bộ thẳng xuống MongoDB
  if (mergedItems.length > 0) {
    await CartModel.bulkWrite([buildReplaceCartMongoOp(userId, mergedItems)]);
  } else {
    // Trường hợp sau gộp giỏ hàng trống trơn (do hết hạn và kho tổng cũng hết sạch)
    await CartModel.updateOne(
      { userId },
      { $set: { items: [] } },
      { upsert: true },
    );
  }

  return await loadCart(userId, null);
};

const loadCart = async (userId, cartId) => {
  const ownerId = userId || cartId;
  const redisKey = `cart:${ownerId}`;
  const isUser = Boolean(userId);

  // 1. Đọc nhanh dữ liệu từ Redis qua 1 request LUA
  // Kết quả trả về mảng phẳng: [modelId1, qty1, status1, modelId2, qty2, status2, ...]
  let luaResults = await redisClient.eval(LOAD_CART_READ_ONLY_LUA, {
    keys: [redisKey],
    arguments: [ownerId],
  });

  // 2. Fallback: Nếu Redis trống hoàn toàn và là User -> Nạp từ MongoDB dựng lại Redis
  if (luaResults.length === 0 && isUser) {
    const mongoCart = await CartModel.findOne({ userId }).lean();
    if (mongoCart?.items.length) {
      // Đẩy ngược lại Redis Cart để các request sau không phải sờ vào DB nữa
      const pipeline = redisClient.pipeline();
      for (const item of mongoCart.items) {
        pipeline.hSet(
          redisKey,
          `product:${item.modelId}`,
          item.quantity.toString(),
        );
      }
      // Gia hạn giỏ hàng của User theo TTL tiêu chuẩn
      pipeline.expireAt(redisKey, getCartExpireAt("USER"));
      await pipeline.exec();

      // Nạp lại cấu trúc dữ liệu để xử lý tiếp
      return await loadCart(userId, null);
    }
  }

  // 3. Phân loại cấu trúc và chuẩn bị format trả về cho Client
  const cartItemsForFormat = [];

  for (let i = 0; i < luaResults.length; i += 3) {
    const modelId = luaResults[i];
    const quantity = parseInt(luaResults[i + 1], 10);
    const status = luaResults[i + 2];

    cartItemsForFormat.push({
      modelId,
      quantity,
      status,
    });
  }

  // 4. Format thông tin chi tiết sản phẩm (tên, hình ảnh, giá hiện tại từ DB sản phẩm)
  const formattedItems = await formatCartItemInfo(cartItemsForFormat);

  return {
    userId,
    cartId,
    items: formattedItems,
  };
};

const removeCartItem = async (userId, cartId, modelId) => {
  const ownerId = userId || cartId;
  if (!ownerId) throw new Error("Khong tim thay thong tin dinh danh");

  const mIdStr = modelId.toString();

  await redisClient.eval(REMOVE_ITEM_LUA, {
    keys: [
      `stock:${mIdStr}`,
      `reservation:${ownerId}:${mIdStr}`,
      `cart:${ownerId}`,
      "reservation:zset",
    ],
    arguments: [mIdStr],
  });

  if (userId) {
    const { filter, update, options } = buildSetCartItemMongoUpdate(
      userId,
      mIdStr,
      0,
    );

    await CartModel.updateOne(filter, update, options).catch((err) =>
      console.error("MongoDB Sync Error:", err),
    );
  }
};

const updateCartQuantity = async ({
  modelId,
  quantity,
  userId,
  cartId,
  operationType,
}) => {
  // 1. Xác định danh tính giỏ hàng
  let isNewGuest = false;
  let ownerId = userId || cartId;

  if (!ownerId) {
    ownerId = uuidv4();
    isNewGuest = true;
  }

  const isUser = Boolean(userId);
  const inputQty = parseInt(quantity, 10);

  // 2. Tính toán targetQty dựa trên loại hành động (ADD hoặc SET)
  let targetQty = inputQty;
  if (operationType === "ADD") {
    const currentQty =
      parseInt(
        await redisClient.hGet(`cart:${ownerId}`, `product:${modelId}`),
      ) || 0;
    targetQty = currentQty + inputQty;
  }

  // 3. Thực thi qua Lua Script (Check kho + Trừ kho tổng + Tạo Reservation mới)
  const [finalQty, status] = await StockService.reserve(
    ownerId,
    modelId,
    targetQty,
    isUser,
  );

  // 4. Nếu là User và cập nhật thành công (hoặc điều chỉnh), đồng bộ vào MongoDB
  // Chống Race Condition bằng từ khóa await
  if (isUser) {
    await syncRedisCartToMongo(userId, modelId, finalQty);
  }

  return {
    finalQty,
    status,
    ownerId,
    isNewGuest,
  };
};

export {
  buildReplaceCartMongoOp,
  syncRedisCartToMongo,
  removeCartItem,
  mergeCart,
  loadCart,
  updateCartQuantity,
};
