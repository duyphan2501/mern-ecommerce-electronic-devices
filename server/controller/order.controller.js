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

export { getNextOrderCode };
