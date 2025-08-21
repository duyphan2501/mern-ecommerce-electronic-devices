import ModelsModel from "../model/productModel.model.js";
import { v4 as uuidv4 } from "uuid";
import redisClient from "../config/init.redis.js";
import {
  addCartItem,
  loadCart,
  removeCartItem,
  syncCartToMongo,
  updateCartItem,
} from "../service/cart.service.js";

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
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }
      cartKey = `cart:${cartId}`;
    }

    // kiểm tra tồn kho
    const model = await ModelsModel.findById(modelId);
    if (!model) {
      return res
        .status(404)
        .json({ message: "Model not found", success: false });
    }

    const productKey = `product:${modelId}`;
    const currentQty =
      parseInt(await redisClient.hGet(cartKey, productKey)) || 0;
    const newQty = currentQty + quantity;

    if (newQty > model.stockQuantity) {
      return res.status(400).json({ message: "Out of stock", success: false });
    }

    // cập nhật giỏ trong Redis
    await addCartItem(userId, cartId, modelId, quantity);

    return res.status(200).json({
      message: "Added to cart successfully",
      success: true,
      cart: await loadCart(userId, cartId),
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
      return res
        .status(400)
        .json({ message: "No cart found", success: false, cart: null });
    }
    const cart = await loadCart(userId, cartId);

    return res
      .status(200)
      .json({ cart, message: "Cart loaded", success: true });
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
