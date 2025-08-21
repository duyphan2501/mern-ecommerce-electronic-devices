import redisClient from "../config/init.redis.js";
import { formatCartItemInfo } from "../helper/cart.helper.js";
import CartModel from "../model/cart.model.js";

const USER_CART_TTL = 60 * 60 * 24 * 7; // 7 ngày
const GUEST_CART_TTL = 60 * 60 * 24 * 2; // 7 ngày

export const addCartItem = async (userId, cartId, modelId, quantity) => {
  if (!modelId || !quantity) {
    throw new Error("Missing modelId or quantity");
  }

  const cartKey = userId ? `cart:${userId}` : `cart:${cartId}`;
  const productKey = `product:${modelId}`;

  // tăng số lượng trong Redis
  await redisClient.hIncrBy(cartKey, productKey, quantity);

  if (userId) {
    const updated = await CartModel.findOneAndUpdate(
      { userId, "items.modelId": modelId },
      { $inc: { "items.$.quantity": quantity } },
      { new: true }
    );

    if (!updated) {
      // nếu chưa có item đó, push vào giỏ
      await CartModel.findOneAndUpdate(
        { userId },
        { $push: { items: { modelId, quantity } } },
        { upsert: true, new: true }
      );
    }

    await redisClient.expire(cartKey, USER_CART_TTL);
  } else {
    await redisClient.expire(cartKey, GUEST_CART_TTL);
  }
};

// userCart: object từ hgetall(cartKey)
export const syncCartToMongo = async (userId, userCart) => {
  // convert { 'product:123': '2', 'product:456': '1' }
  const items = Object.entries(userCart).map(([key, qty]) => ({
    modelId: key.replace("product:", ""),
    quantity: parseInt(qty),
  }));

  // upsert giỏ hàng cho user
  await CartModel.findOneAndUpdate(
    { userId },
    { items },
    { upsert: true, new: true }
  );
};

// merge guest cart -> user cart
export const mergeCart = async (guestCartId, userId) => {
  if (!guestCartId) return null;

  const guestKey = `cart:${guestCartId}`;
  const userKey = `cart:${userId}`;

  // lấy toàn bộ giỏ guest
  const guestCart = await redisClient.hGetAll(guestKey);
  if (!guestCart || Object.keys(guestCart).length === 0) {
    return null; // guest cart trống thì bỏ qua
  }

  const isExistingUserCart = await redisClient.exists(userKey);

  if (!isExistingUserCart) {
    // nếu user cart chưa tồn tại, tạo mới
    await redisClient.hSet(userKey, ...Object.entries(guestCart).flat());
  } else {
    // gộp từng sản phẩm vào giỏ user
    for (const [productKey, qty] of Object.entries(guestCart)) {
      await redisClient.hIncrBy(userKey, productKey, parseInt(qty));
    }
  }
  await redisClient.expire(userKey, USER_CART_TTL);

  // xóa giỏ guest
  await redisClient.del(guestKey);

  // sync mongodb
  const userCart = await redisClient.hGetAll(userKey);
  await syncCartToMongo(userId, userCart);

  return userCart;
};

// loadCart: userId có thể null (guest)
export const loadCart = async (userId, cartId) => {
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

export const updateCartItem = async (userId, cartId, modelId, quantity) => {
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

export const removeCartItem = async (userId, cartId, modelId) => {
  if (!userId && !cartId) {
    throw new Error("No cart found");
  }

  const cartKey = userId ? `cart:${userId}` : `cart:${cartId}`;
  await redisClient.hDel(cartKey, `product:${modelId}`);

  if (userId) {
    await CartModel.updateOne({ userId }, { $pull: { items: { modelId } } });
  }
};
