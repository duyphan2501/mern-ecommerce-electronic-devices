import redisClient from "../config/init.redis.js";
import { formatCartItemInfo } from "../helper/cart.helper.js";
import CartModel from "../model/cart.model.js";
import { cancelStockReservation, reserveStock } from "./reservation.service.js";

const USER_CART_TTL = 60 * 60 * 24 * 7; // 7 ngày
const GUEST_CART_TTL = 60 * 60 * 24 * 2; // 2 ngày

const addCartItem = async (userId, cartId, modelId, quantity) => {
  if (quantity === 0) return;
  if (!modelId || !quantity) {
    throw new Error("Missing modelId or quantity");
  }

  const cartKey = userId ? `cart:${userId}` : `cart:${cartId}`;
  const productKey = `product:${modelId}`;

  if (userId) {
    const updated = await CartModel.updateOne(
      { userId, "items.modelId": modelId },
      { $inc: { "items.$.quantity": quantity } },
      { new: true }
    );

    if (!updated.modifiedCount) {
      // nếu chưa có item đó, push vào giỏ
      await CartModel.updateOne(
        { userId },
        { $push: { items: { modelId, quantity } } },
        { upsert: true, new: true }
      );
    }

    // tăng số lượng trong Redis
    await redisClient.hIncrBy(cartKey, productKey, quantity);
    await redisClient.expire(cartKey, USER_CART_TTL);
  } else {
    await redisClient.hIncrBy(cartKey, productKey, quantity);
    await redisClient.expire(cartKey, GUEST_CART_TTL);
  }
};

const mergeCart = async (guestCartId, userId) => {
  if (!guestCartId || !userId) return null;

  const guestKey = `cart:${guestCartId}`;
  const userKey = `cart:${userId}`;

  // lấy giỏ guest từ Redis
  const guestCart = await redisClient.hGetAll(guestKey);
  if (!guestCart || Object.keys(guestCart).length === 0) {
    await redisClient.del(guestKey);
    return null;
  }

  // lấy giỏ user từ DB (nếu có)
  const userCartDb = await CartModel.findOne({ userId }).lean();
  let updatedItems = userCartDb?.items ? [...userCartDb.items] : [];

  // song song xử lý các item
  const results = await Promise.all(
    Object.entries(guestCart).map(async ([productKey, qty]) => {
      const modelId = productKey.replace("product:", "");
      const addQuantity = parseInt(qty, 10);

      let cartItem = updatedItems.find((item) => item.modelId == modelId);
      const oldQuantity = cartItem ? cartItem.quantity : 0;

      if (cartItem) {
        cartItem.quantity += addQuantity;
      } else {
        cartItem = { modelId, quantity: addQuantity };
        updatedItems.push(cartItem);
      }

      // huỷ reservation guest trước
      await cancelStockReservation(null, guestCartId, modelId);

      try {
        const { reservedQty } = await reserveStock(
          userId,
          null,
          modelId,
          cartItem.quantity,
          true
        );

        if (reservedQty < cartItem.quantity) {
          console.warn(
            `Stock limited for modelId=${modelId}, set quantity from ${cartItem.quantity} -> ${reservedQty}`
          );
          cartItem.quantity = reservedQty;
        }
        return cartItem;
      } catch (err) {
        console.warn(`Reserve stock failed for modelId=${modelId}: ${err.message}`);
        if (oldQuantity > 0) {
          cartItem.quantity = oldQuantity;
          return cartItem;
        } else {
          // bỏ item mới
          return null;
        }
      }
    })
  );

  // loại bỏ item null
  updatedItems = results.filter(Boolean);

  // cập nhật Mongo (1 lần duy nhất)
  await CartModel.updateOne(
    { userId },
    { $set: { items: updatedItems } },
    { upsert: true }
  );

  // xoá guest cart Redis
  await redisClient.del(guestKey);

  // cập nhật Redis user theo DB mới
  const redisData = {};
  for (const item of updatedItems) {
    redisData[`product:${item.modelId}`] = item.quantity.toString();
  }

  await redisClient.del(userKey);
  if (Object.keys(redisData).length > 0) {
    await redisClient.hSet(userKey, redisData);
    await redisClient.expire(userKey, USER_CART_TTL);
  }

  return redisData;
};


// loadCart: userId có thể null (guest)
const loadCart = async (userId, cartId) => {
  let cart = null;

  if (userId) {
    const redisKey = `cart:${userId}`;
    const redisCart = await redisClient.hGetAll(redisKey);

    if (redisCart && Object.keys(redisCart).length > 0) {
      const items = Object.entries(redisCart).map(([key, qty]) => ({
        modelId: key.replace("product:", ""),
        quantity: parseInt(qty, 10),
      }));

      cart = {
        userId,
        items: await formatCartItemInfo(items),
      };
    } else {
      const mongoCart = await CartModel.findOne({ userId }).lean();
      if (mongoCart) {
        cart = {
          userId,
          items: await formatCartItemInfo(mongoCart.items),
        };

        for (const item of mongoCart.items) {
          await redisClient.hSet(
            redisKey,
            `product:${item.modelId}`,
            item.quantity
          );
        }
        await redisClient.expire(redisKey, USER_CART_TTL);
      } else {
        cart = { userId, items: [] };
      }
    }
  } else {
    if (!cartId) return { items: [] };

    const redisKey = `cart:${cartId}`;
    const redisCart = await redisClient.hGetAll(redisKey);

    if (redisCart && Object.keys(redisCart).length > 0) {
      const items = Object.entries(redisCart).map(([key, qty]) => ({
        modelId: key.replace("product:", ""),
        quantity: parseInt(qty, 10),
      }));

      cart = {
        cartId,
        items: await formatCartItemInfo(items), // enrich cho guest
      };
    } else {
      cart = { cartId, items: [] };
      await redisClient.expire(redisKey, GUEST_CART_TTL);
    }
  }

  return cart;
};

const updateCartItem = async (userId, cartId, modelId, quantity) => {
  if (!userId && !cartId) {
    throw new Error("No cart found");
  }

  const cartKey = userId ? `cart:${userId}` : `cart:${cartId}`;
  await redisClient.hSet(cartKey, `product:${modelId}`, quantity);

  if (userId) {
    await CartModel.updateOne(
      { userId, "items.modelId": modelId },
      { $set: { "items.$.quantity": quantity } }
    );
  }
};

const removeCartItem = async (userId, cartId, modelId) => {
  if (!userId && !cartId) {
    throw new Error("No cart found");
  }

  const cartKey = userId ? `cart:${userId}` : `cart:${cartId}`;
  await redisClient.hDel(cartKey, `product:${modelId}`);

  if (userId) {
    await CartModel.updateOne({ userId }, { $pull: { items: { modelId } } });
  }
};

export { addCartItem, updateCartItem, removeCartItem, mergeCart, loadCart };
