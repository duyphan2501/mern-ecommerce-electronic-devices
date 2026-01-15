import orderModel from "../model/order.model.js";
import { generateOrderCode } from "../service/order.service.js";

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

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({status: {$nin: ["processing", "draft"]}}).sort({ createdAt: -1 });
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

export { getNextOrderCode, getAllOrders };