import { payOS } from "../config/payos.init.js";
import dotenv from "dotenv";
import orderModel from "../model/order.model.js";
import { generateOrderCode } from "../service/order.service.js";

dotenv.config({ quiet: true });

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

const createPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cartItems } = req.body;

    if (!cartItems || !orderCode)
      return res.status(400).json({
        message: "Order is empty or orderCode is missing!",
        success: false,
      });

    const items = cartItems.map((item) => {
      const name = item.modelName
        ? `${item.productName} - ${item.modelName}`
        : item.productName;

      return {
        name,
        quantity: item.quantity,
        price: item.price,
      };
    });

    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const orderCode = await generateOrderCode();

    // Tạo đơn trong DB
    const newOrder = await orderModel.create({
      orderCode,
      userId,
      items,
      totalPrice,
      payment: {
        provider: "payos",
        status: "pending",
      },
    });

    // Gọi PayOS
    const payload = {
      orderCode,
      amount: totalPrice,
      description: `Thanh toan don hang ${orderCode}`,
      items,
      cancelUrl: `${FRONTEND_URL}/checkout`,
      returnUrl: `${FRONTEND_URL}/payment/success`,
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

    // Xử lý theo trạng thái thanh toán
    if (verifiedData.code === "00") {
      const paymentInfo = await payOS.getPaymentLinkInformation(
        verifiedData.orderCode
      );

      if (paymentInfo.status === "CANCELLED") {
        // xoá đơn hàng
        order.payment.status = "cancelled";
      } else if (paymentInfo.status === "PAID") {
        // Thanh toán thành công
        order.payment.status = "paid";
      } else {
        order.payment.status = "failed";
      }
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
    res.status(400).json({ success: false, message: "invalid signature" });
  }
};

export { createPayment, getPaymentInfo, verifyWebhookData };
