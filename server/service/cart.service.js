import { CART_TTL_REDIS } from "../config/constants.js";
import redisClient from "../config/init.redis.js";
import { formatCartItemInfo } from "../helper/cart.helper.js";
import CartModel from "../model/cart.model.js";
import { MERGE_CART_LUA, REMOVE_ITEM_LUA } from "../scripts/cart.lua.js";
import { StockService } from "./stock.service.js";

const USER_CART_TTL = 60 * 60 * 24 * 7; // 7 ngày
const GUEST_CART_TTL = 60 * 60 * 24 * 2; // 2 ngày

const syncRedisCartToMongo = async (userId, modelId, finalQty) => {
  if (!userId || !modelId) return;
  (async () => {
    try {
      // 1. Thử cập nhật phần tử đã tồn tại trong mảng
      const result = await CartModel.updateOne(
        { userId, "items.modelId": modelId },
        { $set: { "items.$.quantity": finalQty } },
      );

      // 2. Nếu không tìm thấy phần tử để cập nhật
      if ((result.matchedCount === 0) & (finalQty > 0)) {
        await CartModel.updateOne(
          { userId },
          { $push: { items: { modelId, quantity: finalQty } } },
          { upsert: true }, // Tạo mới giỏ hàng nếu userId chưa từng có giỏ
        );
      }

      // 3. Nếu số lượng sau khi update là 0, xóa luôn item khỏi DB
      if (finalQty <= 0) {
        await CartModel.updateOne(
          { userId },
          { $pull: { items: { modelId } } },
        );
      }
    } catch (err) {
      console.error("DB Sync Error:", err);
    }
  })();
};

const mergeCart = async (guestCartId, userId) => {
  const guestKey = `cart:${guestCartId}`;
  const userKey = `cart:${userId}`;
  const now = Math.floor(Date.now() / 1000);

  // 1. Lấy giỏ guest từ Redis (Hash)
  const guestCart = await redisClient.hGetAll(guestKey);
  if (!guestCart || Object.keys(guestCart).length === 0) {
    return await loadCart(userId, null);
  }

  const mergeResults = [];

  // 2. Chuyển hàng Atomic (Dùng for thay vì Promise.all để tránh quá tải Redis)
  for (const [field, qty] of Object.entries(guestCart)) {
    const modelId = field.replace("product:", "");

    // Chuyển hàng từ Guest sang User ngay trong Redis
    const finalQty = await redisClient.eval(MERGE_CART_LUA, {
      keys: [
        `reservation:${guestCartId}:${modelId}`,
        `reservation:${userId}:${modelId}`,
        `stock:${modelId}`,
        userKey,
        "reservation:zset",
      ],
      arguments: [
        modelId,
        qty,
        CART_TTL_REDIS.USER.toString(),
        CART_TTL_REDIS.RESERVATION.toString(),
      ],
    });

    mergeResults.push({ modelId, quantity: finalQty });
  }

  // 3. Đồng bộ MongoDB (Dùng bulkWrite để chỉ gửi 1 request duy nhất)
  const ops = mergeResults.map((item) => ({
    updateOne: {
      filter: { userId, "items.modelId": item.modelId },
      update: { $set: { "items.$.quantity": item.quantity } },
    },
  }));

  // Với các item chưa có trong DB cũ của User
  const existingCart = await CartModel.findOne({ userId }).lean();
  for (const item of mergeResults) {
    if (!existingCart?.items.find((i) => i.modelId === item.modelId)) {
      ops.push({
        updateOne: {
          filter: { userId },
          update: { $push: { items: item } },
          upsert: true,
        },
      });
    }
  }

  if (ops.length > 0) await CartModel.bulkWrite(ops);

  // 4. Dọn dẹp & Trả về giỏ hàng mới
  await redisClient.del(guestKey);
  return await loadCart(userId, null);
};

// loadCart: userId có thể null (guest)
const loadCart = async (userId, cartId) => {
  const ownerId = userId || cartId;
  const redisKey = `cart:${ownerId}`;
  let redisCart = await redisClient.hGetAll(redisKey);
  const isUser = Boolean(userId);

  // 1. Nạp từ DB nếu Redis trống
  if (Object.keys(redisCart).length === 0 && userId) {
    const mongoCart = await CartModel.findOne({ userId }).lean();
    if (mongoCart?.items.length) {
      for (const item of mongoCart.items) {
        // Reserve lại từ DB, hàm reserve của bạn đã tự update Redis Cart rồi
        await StockService.reserve(
          userId,
          item.modelId.toString(),
          item.quantity,
          isUser
        );
      }
      redisCart = await redisClient.hGetAll(redisKey);
    }
  }

  // 2. Kiểm tra và "Hồi sinh" giỏ hàng
  const finalItems = [];
  const itemsToDelete = [];
  const itemsToUpdate = [];

  for (const [key, qtyStr] of Object.entries(redisCart)) {
    const modelId = key.replace("product:", "");
    const qty = parseInt(qtyStr, 10);

    // Kiểm tra Hash Reservation
    const reserved = await redisClient.hGet(
      `reservation:${ownerId}:${modelId}`,
      "qty",
    );

    if (!reserved) {
      // Thử hồi sinh
      const recoveredQty = await StockService.reserve(ownerId, modelId, qty, isUser);

      if (recoveredQty > 0) {
        finalItems.push({ modelId, quantity: recoveredQty });
        if (recoveredQty !== qty) {
          itemsToUpdate.push({ modelId, quantity: recoveredQty });
        }
      } else {
        // Hết sạch hàng -> Đưa vào danh sách xóa
        itemsToDelete.push(modelId);
      }
    } else {
      finalItems.push({ modelId, quantity: parseInt(reserved, 10) });
    }
  }

  // 3. ĐỒNG BỘ NGƯỢC (SYNC)
  // Xóa/Cập nhật Redis Cart
  if (itemsToDelete.length > 0) {
    await redisClient.hDel(
      redisKey,
      itemsToDelete.map((id) => `product:${id}`),
    );
  }

  // Đồng bộ MongoDB (chỉ dành cho User)
  if (userId && (itemsToDelete.length > 0 || itemsToUpdate.length > 0)) {
    // Xóa item hết hàng khỏi DB
    if (itemsToDelete.length > 0) {
      await CartModel.updateOne(
        { userId },
        { $pull: { items: { modelId: { $in: itemsToDelete } } } },
      );
    }
    // Cập nhật item bị giảm số lượng trong DB
    for (const item of itemsToUpdate) {
      await CartModel.updateOne(
        { userId, "items.modelId": item.modelId },
        { $set: { "items.$.quantity": item.quantity } },
      );
    }
  }

  return {
    userId,
    cartId,
    items: await formatCartItemInfo(finalItems),
  };
};

const removeCartItem = async (userId, cartId, modelId) => {
  const ownerId = userId || cartId;
  if (!ownerId) throw new Error("Không tìm thấy thông tin định danh");

  const mIdStr = modelId.toString();

  // 1. Chạy Lua Script để hoàn kho tức thì trong 1 nốt nhạc
  await redisClient.eval(REMOVE_ITEM_LUA, {
    keys: [
      `stock:${mIdStr}`,
      `reservation:${ownerId}:${mIdStr}`,
      `cart:${ownerId}`,
      "reservation:zset"
    ],
    arguments: [mIdStr]
  });

  // 2. Đồng bộ MongoDB (Chỉ cho User - chạy ngầm)
  if (userId) {
    CartModel.updateOne(
      { userId },
      { $pull: { items: { modelId: mIdStr } } }
    ).catch(err => console.error("MongoDB Sync Error:", err));
  }
};


export { syncRedisCartToMongo, removeCartItem, mergeCart, loadCart };
