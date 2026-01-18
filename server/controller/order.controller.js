import orderModel from "../model/order.model.js";
import { createNewOrder, generateOrderCode, handleOrderCreation } from "../service/order.service.js";

const getNextOrderCode = async () => {
  try {
    const orderCode = await generateOrderCode();
    return res.status(200).json({
      orderCode,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const { cartItems, address, provider, orderStatus } = req.body;
    const userId = req.user.userId;
    const email = req.user.email; 

    if (!address)
      return res.status(400).json({
        message: "Address is missing!",
        success: false,
      });
    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({
        message: "Order is empty!",
        success: false,
      });
    const { itemsPayos, newOrder } = await createNewOrder(
      cartItems,
      userId,
      email,
      address,
      provider,
      orderStatus
    );
    await handleOrderCreation(newOrder);
    return res.status(201).json({
      newOrder,
      itemsPayos,
      success: true,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ status: { $nin: ["processing", "draft"] } })
      .sort({ createdAt: -1 });
    return res.status(200).json({
      orders,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const getOrderByOrderCode = async (req, res) => {
  try {
    const { orderCode } = req.params;
    if (!orderCode) {
      return res
        .status(400)
        .json({ message: "Missing orderCode parameter", success: false });
    }
    const order = await orderModel.findOne({ orderCode: orderCode });

    return res.status(200).json({ order, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, success: false });
  }
};

export { getNextOrderCode, getAllOrders, createOrder, getOrderByOrderCode };