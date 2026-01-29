import { publishSendOrderEmail } from "../helper/message.helper.js";
import orderModel from "../model/order.model.js";
import ModelsModel from "../model/productModel.model.js";
import { reserveStock } from "./reservation.service.js";

async function generateOrderCode() {
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

const createNewOrder = async (
  cartItems,
  userId,
  email,
  address,
  provider,
  orderStatus = "pending",
) => {
  const items = [];
  const itemsPayos = [];

  for (const item of cartItems) {
    const name = item.modelName
      ? `${item.productName} - ${item.modelName}`
      : item.productName;

    const discountPrice =
      Math.round((item.price * (1 - item.discount / 100)) / 1000) * 1000;

    await reserveStock(userId, null, item.modelId, item.quantity, true, true);

    items.push({
      modelId: item.modelId,
      name,
      quantity: item.quantity,
      price: discountPrice,
      image: item.images[0] || "",
    });
    itemsPayos.push({ name, quantity: item.quantity, price: discountPrice });
  }

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const orderId = await generateOrderCode();
  const orderCode = Number(
    `${Date.now()}`.slice(-7) + Math.floor(Math.random() * 90 + 10),
  ); // ra 9 chữ số ngẫu nhiên từ timestamp

  // Tạo đơn trong DB
  const newOrder = await orderModel.create({
    orderCode,
    orderId,
    userId,
    items,
    totalPrice,
    email,
    shippingInfo: {
      receiver: address.receiver,
      phone: address.phone,
      ward: address.ward,
      province: address.province,
      addressDetail: address.addressDetail,
    },
    status: orderStatus,
    payment: {
      provider: provider,
      status: orderStatus,
    },
  });

  if (!newOrder) throw new Error("Failed to create new order");

  return {
    newOrder,
    itemsPayos,
  };
};

const handleOrderCreation = async (order) => {
  await publishSendOrderEmail(order);
};

const restockOrderItems = async (order) => {
  const promises = order.items.map((item) =>
    ModelsModel.findByIdAndUpdate(item.modelId, {
      $inc: { stockQuantity: item.quantity },
    }),
  );
  await Promise.all(promises);
};

export { generateOrderCode, createNewOrder, handleOrderCreation, restockOrderItems };
