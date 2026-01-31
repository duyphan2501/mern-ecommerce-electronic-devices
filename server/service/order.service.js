import redisClient from "../config/init.redis.js";
import { publishSendOrderEmail } from "../helper/message.helper.js";
import CartModel from "../model/cart.model.js";
import orderModel from "../model/order.model.js";
import ModelsModel from "../model/productModel.model.js";
import { StockService } from "./stock.service.js";

async function generateOrderId() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2); // chỉ lấy 2 số cuối năm
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Tìm số đơn hàng hôm nay
  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
  );
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );

  const countToday = await orderModel.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const sequence = String(countToday + 1).padStart(4, "0"); // 0001, 0002...

  // Trả về số: YYMMDD + sequence
  return `DH${year}${month}${day}${sequence}`;
}

const completeOrderCheckout = async (order) => {
  for (const item of order.items) {
    const confirmedQty = await StockService.confirm({
      item,
      userId: order.userId,
    });

    if (confirmedQty === 0) {
      const availableStock = await StockService.getStockinfo(item.modelId);
      if (availableStock.available < item.quantity) {
        throw new Error(
          `Sản phẩm ${item.name} không đủ số lượng, vui lòng tải lại giỏ hàng! Hiện có ${availableStock.available} sản phẩm trong kho.`,
        );
      } else {
        await StockService.reserve(
          order.userId,
          item.modelId,
          item.quantity,
          true,
          true,
        );
      }
    }
  }

  const bulkOps = order.items.map((item) => ({
    updateOne: {
      filter: { _id: item.modelId },
      update: { $inc: { stockQuantity: -item.quantity } },
    },
  }));

  await ModelsModel.bulkWrite(bulkOps);
  await orderModel.findByIdAndUpdate(order._id, { status: "pending" });
  await CartModel.deleteOne({ userId: order.userId });

  return true;
};

const createNewOrder = async ({
  cartItems,
  userId,
  email,
  address,
  provider,
  orderStatus = "draft",
}) => {
  const items = cartItems.map((item) => {
    const discountPrice =
      Math.round((item.price * (1 - item.discount / 100)) / 1000) * 1000;
    return {
      modelId: item.modelId,
      name: item.modelName
        ? `${item.productName} - ${item.modelName}`
        : item.productName,
      quantity: item.quantity,
      price: discountPrice,
      image: item.images[0] || "",
    };
  });

  // 4. Tạo Order và Xóa giỏ hàng DB
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const orderId = await generateOrderId();
  const orderCode = Number(
    `${Date.now()}`.slice(-7) + Math.floor(Math.random() * 90 + 10),
  ); // ra 9 chữ số ngẫu nhiên từ timestamp

  const newOrder = await orderModel.create({
    orderId,
    orderCode,
    userId,
    items,
    totalPrice,
    email,
    shippingInfo: address,
    status: orderStatus,
    payment: { provider, status: "pending" },
  });

  return { newOrder, orderItems: items };
};

const handleOrderCreation = async (order) => {
  await publishSendOrderEmail(order);
};

const restockOrderItems = async (order) => {
  order.items.map(async (item) => {
    await ModelsModel.findByIdAndUpdate(item.modelId, {
      $inc: { stockQuantity: item.quantity },
    });
    await redisClient.hSet(`stock:${item.modelId}`, "available", item.quantity);
  });
};

const handleReOrder = async (order) => {
  const results = [];
  const userId = order.userId;
  for (const item of order.items) {
    try {
      const [reservedQty, _] = await StockService.reserve(
        userId,
        item.modelId,
        item.quantity,
        true,
      );
      const status =
        reservedQty === item.quantity
          ? "SUCCESS"
          : reservedQty < item.quantity
            ? "PARTIAL_STOCK"
            : "OUT_OF_STOCK";

      results.push({
        modelId: item.modelId,
        status,
        reservedQty,
      });
    } catch (error) {
      // Nếu item này hết hàng hoặc lỗi, chỉ ghi log và bỏ qua, không văng lỗi ra ngoài
      console.warn(`Không thể re-order item ${item.modelId}:`, error.message);
      results.push({
        modelId: item.modelId,
        status: "FAILED",
        reason: error.message,
      });
    }
  }
  return results;
};

export {
  generateOrderId,
  createNewOrder,
  handleOrderCreation,
  restockOrderItems,
  completeOrderCheckout,
  handleReOrder,
};