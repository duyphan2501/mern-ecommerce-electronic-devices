import { v4 as uuidv4 } from "uuid";
import {
  loadCart,
  removeCartItem,
  syncRedisCartToMongo,
} from "../service/cart.service.js";
import {
  cancelStockReservation,
  reserveStock,
} from "../service/reservation.service.js";
import { StockService } from "../service/stock.service.js";
import redisClient from "../config/init.redis.js";
import CartModel from "../model/cart.model.js";
import { CART_TTL_MS } from "../config/constants.js";

const addToCart = async (req, res) => {
  try {
    const { modelId, quantity, userId } = req.body;
    let { cartId } = req.cookies;

    const ownerId = userId || cartId || uuidv4();
    const isUser = Boolean(userId);

    // 1. Lấy số lượng hiện tại từ Redis
    const currentQty =
      (await redisClient.hGet(`cart:${ownerId}`, `product:${modelId}`)) || 0;
    const targetQty = parseInt(currentQty) + parseInt(quantity);

    // 2. Thực thi qua Lua (Check kho + Trừ kho + Giữ chỗ)
    const finalQty = await StockService.reserve(ownerId, modelId, targetQty, isUser);

    // 3. Set cookie nếu là khách mới
    if (!userId && !cartId) {
      res.cookie("cartId", ownerId, { httpOnly: true, maxAge: CART_TTL_MS.GUEST });
    }

    // 4. Nếu là User, đồng bộ vào MongoDB (Background task - không đợi)
    await syncRedisCartToMongo(userId, modelId, finalQty);

    const isFullSuccess = finalQty === targetQty;
    return res.status(isFullSuccess ? 200 : 400).json({
      success: isFullSuccess,
      message: isFullSuccess
        ? "Thêm thành công"
        : finalQty !== 0
          ? `Chỉ còn ${finalQty} sản phẩm`
          : "Hết hàng",
      currentCartQty: finalQty,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId, modelId, quantity } = req.body;
    const { cartId } = req.cookies;

    if (!userId && !cartId) {
      return res.status(400).json({ message: "No cart found", success: false });
    }

    if (!modelId || !quantity) {
      return res
        .status(400)
        .json({ message: "Missing information!", success: false });
    }

    const ownerId = userId || cartId || uuidv4();
    const isUser = Boolean(userId);

    const targetQty = parseInt(quantity);

    // 2. Thực thi qua Lua (Check kho + Trừ kho + Giữ chỗ)
    const finalQty = await StockService.reserve(ownerId, modelId, targetQty, isUser);

    // 3. Set cookie nếu là khách mới
    if (!userId && !cartId) {
      res.cookie("cartId", ownerId, { httpOnly: true, maxAge: CART_TTL_MS.GUEST });
    }

    // 4. Nếu là User, đồng bộ vào MongoDB (Background task - không đợi)
    await syncRedisCartToMongo(userId, modelId, finalQty);

    const isFullSuccess = finalQty === targetQty;
    return res.status(isFullSuccess ? 200 : 400).json({
      success: isFullSuccess,
      message: isFullSuccess
        ? "Cập nhật thành công"
        : finalQty !== 0
          ? `Chỉ còn ${finalQty} sản phẩm`
          : "Hết hàng",
      currentCartQty: finalQty,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

const getCart = async (req, res) => {
  try {
    let { userId } = req.params;
    if (userId === "guest") userId = null;

    let { cartId } = req.cookies;

    if (!userId && !cartId) {
      return res.status(200).json({
        cart: { items: [] },
        success: true,
      });
    }
    const cart = await loadCart(userId, cartId);

    return res
      .status(200)
      .json({ cart, message: "Cart loaded", success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, modelId } = req.body;
    if (!userId && !modelId) {
      return res
        .status(400)
        .json({ message: "Missing userId or modelId", success: false });
    }
    const { cartId } = req.cookies;

    if (!userId && !cartId) {
      return res.status(400).json({ message: "No cart found", success: false });
    }

    if (!modelId) {
      return res
        .status(400)
        .json({ message: "Missing modelId", success: false });
    }

    await removeCartItem(userId, cartId, modelId);
    await cancelStockReservation(userId, cartId, modelId);
    return res.status(200).json({
      message: "Item removed from cart successfully",
      success: true,
      cart: await loadCart(userId, cartId),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

export { addToCart, getCart, updateCart, removeFromCart };
