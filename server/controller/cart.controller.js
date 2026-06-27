import { v4 as uuidv4 } from "uuid";
import {
  loadCart,
  removeCartItem,
  syncRedisCartToMongo,
  updateCartQuantity,
} from "../service/cart.service.js";
import { StockService } from "../service/stock.service.js";
import redisClient from "../config/init.redis.js";
import { CART_TTL_MS } from "../config/constants.js";
import { cookieOptions } from "../helper/auth.helper.js";

const handleCartResponse = async (req, res, operationType) => {
  try {
    const { modelId, quantity, userId } = req.body;
    const { cartId } = req.cookies;

    if (!modelId || quantity === undefined) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm hoặc số lượng!", success: false });
    }

    // Gọi tầng Service xử lý nghiệp vụ
    const { finalQty, status, ownerId, isNewGuest } = await updateCartQuantity({
      modelId,
      quantity,
      userId,
      cartId,
      operationType
    });

    // Cấp phát cookie ngay tại tầng Controller nếu là khách vãng lai mới
    if (isNewGuest) {
      res.cookie("cartId", ownerId, {
        maxAge: CART_TTL_MS.GUEST,
        ...cookieOptions
      });
    }

    // Xử lý phân cấp mã lỗi HTTP dựa trên trạng thái của Kho tổng (status từ Lua)
    if (status === 1) {
      return res.status(409).json({
        success: false,
        message: "Sản phẩm đã hết hàng trong kho tổng",
        currentCartQty: finalQty,
      });
    }

    const message = status === 2
      ? `Kho tổng không đủ, tự động điều chỉnh còn ${finalQty} sản phẩm`
      : operationType === "ADD" ? "Thêm vào giỏ hàng thành công" : "Cập nhật giỏ hàng thành công";

    return res.status(200).json({
      success: true,
      message,
      status,
      currentCartQty: finalQty,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message || error, success: false });
  }
};

const addToCart = (req, res) => handleCartResponse(req, res, "ADD");
const updateCart = (req, res) => handleCartResponse(req, res, "SET");


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
    return res.status(200).json({
      message: "Đã xoá sản phẩm khỏi giỏ hàng",
      success: true,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

export { addToCart, getCart, updateCart, removeFromCart };
