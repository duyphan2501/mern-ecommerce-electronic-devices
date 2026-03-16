import { payOS } from "../config/payos.init.js";
import dotenv from "dotenv";
import orderModel from "../model/order.model.js";
import { completeOrderCheckout, createNewOrder, handleOrderCreation } from "../service/order.service.js";

dotenv.config({ quiet: true });

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

const createPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const email = req.user.email;
    const { cartItems, address, provider, orderStatus } = req.body;

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

    const { newOrder, orderItems } = await createNewOrder({cartItems, userId, email, address, provider, orderStatus: orderStatus || "draft"});

    const itemsPayos = orderItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }));

    // Gọi PayOS
    const payload = {
      orderCode: newOrder.orderCode,
      amount: newOrder.totalPrice,
      description: newOrder.orderId,
      items: itemsPayos,
      cancelUrl: `${BACKEND_URL}/api/payment/cancel`,
      returnUrl: `${FRONTEND_URL}/order-success`,
      expiredAt: Math.floor(Date.now() / 1000) + 15 * 60,
    };

    const paymentLinkRes = await payOS.createPaymentLink(payload);
    res
      .status(200)
      .json({ url: paymentLinkRes.checkoutUrl, newOrder, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message || error, success: false });
  }
};

const getPaymentInfo = async (req, res) => {
  try {
    const { orderCode } = req.params;
    if (!orderCode) {
      return res
        .status(400)
        .json({ message: "Missing orderCode parameter", success: false });
    }

    const paymentInfo = await payOS.getPaymentLinkInformation(orderCode);

    res.status(200).json({ paymentInfo, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message || error, success: false });
  }
};

const verifyWebhookData = async (req, res) => {
  try {
    // Dữ liệu từ PayOS gửi về
    const webhookData = req.body;

    // Xác minh chữ ký
    const verifiedData = payOS.verifyPaymentWebhookData(webhookData);
    if (
      ["Ma giao dich thu nghiem", "VQRIO123"].includes(
        webhookData.data.description
      )
    ) {
      return res.status(200).json({
        success: true,
        data: webhookData,
      });
    }
    // Nếu xác minh thành công
    console.log("Webhook nhận thành công:", verifiedData);

    const order = await orderModel.findOne({
      orderCode: verifiedData.orderCode,
    });

    if (!order)
      return res.status(404).json({
        message: "Order is not found!",
        success: false,
      });

    if (verifiedData.code === "00") {
      order.payment.status = "paid";
      await completeOrderCheckout(order);
      // xoá giỏ hàng
      await handleOrderCreation(order);
    } else {
      // Thanh toán thất bại
      order.payment.status = "failed";
      order.description = verifiedData.desc;
      await order.save();
    }
    await order.save();

    // Phản hồi cho PayOS
    res.status(200).json({ data: verifiedData, success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, message: "invalid signature" });
  }
};

const cancelPayment = async (req, res) => {
  try {
    const { orderCode, status, cancel } = req.query;
    if (cancel && status === "CANCELLED") {
      const order = await orderModel.findOne({ orderCode });
      if (!order)
        return res.status(404).json({
          message: "Order does not exist!",
          success: false,
        });

      order.payment.status = "cancelled";
      await order.save();
    }
    return res.redirect(`${FRONTEND_URL}/checkout`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || error, success: false });
  }
};

export { createPayment, getPaymentInfo, verifyWebhookData, cancelPayment };
