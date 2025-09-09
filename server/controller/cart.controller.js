import { v4 as uuidv4 } from "uuid";
import {
  addCartItem,
  loadCart,
  removeCartItem,
  updateCartItem,
} from "../service/cart.service.js";
import {
  cancelStockReservation,
  reserveStock,
} from "../service/reservation.service.js";

const addToCart = async (req, res) => {
  try {
    const { modelId, quantity, userId } = req.body;
    let { cartId } = req.cookies;

    if (!modelId || !quantity) {
      return res
        .status(400)
        .json({ message: "Missing information!", success: false });
    }
    let cartKey;

    if (userId) {
      cartKey = `cart:${userId}`;
    } else {
      if (!cartId) {
        cartId = uuidv4();
        res.cookie("cartId", cartId, {
          httpOnly: true,
          maxAge: 4 * 24 * 60 * 60 * 1000,
        });
      }
      cartKey = `cart:${cartId}`;
    }
    // đặt chỗ
    const {changed} = await reserveStock(userId, cartId, modelId, quantity);
    // cập nhật giỏ trong Redis
    await addCartItem(userId, cartId, modelId, changed);

    const outOfStockQty = quantity - changed;
    if (outOfStockQty !== 0)
      throw new Error(`Hết hàng!${changed!==0? `Chỉ tăng số lượng thêm ${changed}`:""}`)
    return res.status(200).json({
      message: "Thêm thành công!",
      success: true,
      cart: await loadCart(userId, cartId),
    });
  } catch (error) {
    console.log(error);
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
      return res
        .status(400)
        .json({ message: "No cart found", success: false, cart: null });
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

    // kiểm tra và update kho tạm
    await reserveStock(userId, cartId, modelId, quantity, true)

    // update cart và reset reservation
    await updateCartItem(userId, cartId, modelId, quantity);

    return res.status(200).json({
      message: "Cart updated successfully",
      success: true,
      cart: await loadCart(userId, cartId),
    });
  } catch (error) {
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
