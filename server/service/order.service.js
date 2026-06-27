import mongoose from "mongoose";
import { getReserveExpireAt } from "../config/constants.js";
import redisClient from "../config/init.redis.js";
import { publishSendOrderEmail } from "../helper/message.helper.js";
import CartModel from "../model/cart.model.js";
import orderModel from "../model/order.model.js";
import ProductModel from "../model/product.model.js";
import ModelsModel from "../model/productModel.model.js";
import ReturnModel from "../model/return.model.js";
import { createOrderExportMovements } from "./inventory.service.js";
import { StockService } from "./stock.service.js";

const ADMIN_ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packing",
  "shipping",
  "delivered",
  "cancelled",
];

const STATUS_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["packing", "cancelled"],
  packing: ["shipping"],
  shipping: ["delivered"],
  delivered: [],
  cancelled: [],
};

const createServiceError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const appendOrderEvent = (order, event) => {
  order.statusHistory.push({
    ...event,
    createdAt: new Date(),
  });
};

const buildOrderResponse = async (order) => {
  if (!order) return null;
  const orderObject = order.toObject ? order.toObject() : order;
  const returns = await ReturnModel.find({ orderId: orderObject._id }).sort({
    createdAt: -1,
  });
  return { ...orderObject, returns };
};

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
  // 1. Chuẩn bị tham số cho Batch Checkout Script
  const checkoutArgs = [order.userId.toString()];
  for (const item of order.items) {
    checkoutArgs.push(item.modelId.toString(), item.quantity.toString());
  }

  const session = await mongoose.startSession();
  let isRedisCommitted = false; // Cờ kiểm soát trạng thái giao dịch trên Redis

  try {
    // GIAI ĐOẠN 1: XỬ LÝ NGUYÊN TỬ TRÊN REDIS (LUA SCRIPT)
    const [status, resultData] =
      await StockService.confirmCheckout(checkoutArgs);

    // Nếu kho không đủ, Lua Script trả về status = 0 kèm ModelId bị lỗi
    if (status === 0) {
      const failedItem = order.items.find(
        (item) => item.modelId.toString() === resultData,
      );
      const itemName = failedItem ? failedItem.name : resultData;
      throw new Error(
        `Sản phẩm "${itemName}" đã hết hàng hoặc không đủ số lượng khả dụng!`,
      );
    }

    // Đánh dấu: Đã trừ kho và xóa giữ chỗ tạm thời trên Redis thành công
    isRedisCommitted = true;

    // GIAI ĐOẠN 2: THỰC THI & COMMIT VÀO MONGODB TRANSACTION
    await session.withTransaction(async () => {
      // 1. Khấu trừ số lượng kho vật lý trong MongoDB của tất cả sản phẩm
      const bulkOps = order.items.map((item) => ({
        updateOne: {
          filter: { _id: item.modelId },
          update: { $inc: { stockQuantity: -item.quantity } },
        },
      }));
      await Promise.all([
        ModelsModel.bulkWrite(bulkOps, { session }),
        createOrderExportMovements(order, session),
        orderModel.findByIdAndUpdate(
          order._id,
          {
            status: "pending",
            $push: {
              statusHistory: {
                type: "status",
                message: "Order moved to pending confirmation",
                from: order.status,
                to: "pending",
                createdBy: order.userId,
              },
            },
          },
          { session },
        ),
      ]);
    });

    return { success: true, message: "Đặt hàng thành công!" };
  } catch (error) {
    console.error(
      "Phát hiện lỗi hệ thống, kiểm tra kích hoạt luồng tự vá (Rollback)...",
    );

    // Nếu lỗi văng ra từ bước KIỂM TRA KHO (isRedisCommitted = false) -> Không rollback Redis
    if (error.message.includes("hết hàng") || !isRedisCommitted) {
      throw error;
    }

    // GIAI ĐOẠN 3: TỰ VÁ DỮ LIỆU (SELF-HEALING) QUA LUA ROLLBACK
    // Chỉ chạy khi: Kho Redis đã bị trừ, nhưng MongoDB Transaction bị sập / timeout / mất kết nối chớp nhoáng.
    console.warn(
      "MongoDB lỗi bất ngờ! Tiến hành ROLLBACK kho và khôi phục Giữ chỗ trên Redis...",
    );

    // Chuẩn bị tham số cho Script Rollback: [ownerId, modelId1, qty1, expireAt1, ...]
    const rollbackArgs = [order.userId];
    for (const item of order.items) {
      rollbackArgs.push(
        item.modelId.toString(),
        item.quantity.toString(),
        getReserveExpireAt(),
      );
    }

    try {
      const [rollbackStatus, rollbackMsg] =
        await StockService.rollbackCheckout(rollbackArgs);

      if (rollbackStatus === 1) {
        console.log(
          `Tự vá dữ liệu thành công [Redis Rollback]: ${rollbackMsg}`,
        );
      }
    } catch (redisRollbackError) {
      // Tình huống cực đoan: Bản thân Single Node Redis bị chết đúng giây phút này
      console.error(
        "CỰC KỲ NGUY HIỂM: Giao thức Rollback Redis thất bại hoàn toàn!",
        redisRollbackError,
      );
    }

    throw new Error(
      `Hệ thống bận (Database Timeout), vui lòng thử lại sau giây lát!`,
    );
  } finally {
    // Đóng session bảo đảm giải phóng tài nguyên hệ thống
    await session.endSession();
  }
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
      image: item.images?.[0] || "",
    };
  });

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
    statusHistory: [
      {
        type: "created",
        message: "Order created",
        to: orderStatus,
        createdBy: userId,
      },
    ],
  });

  return { newOrder, orderItems: items };
};

const handleOrderCreation = async (order) => {
  await publishSendOrderEmail(order);
};

const restockOrderItems = async (order) => {
  await Promise.all(
    order.items.map(async (item) => {
      await ModelsModel.findByIdAndUpdate(item.modelId, {
        $inc: { stockQuantity: item.quantity },
      });
      await redisClient.hIncrBy(
        `stock:${item.modelId}`,
        "available",
        item.quantity,
      );
    }),
  );
};

const getOrderItemFromModel = async (modelId, quantity) => {
  const model = await ModelsModel.findById(modelId).lean();
  if (!model) throw new Error("Product model is not found");

  const product = await ProductModel.findById(model.productId).lean();
  if (!product) throw new Error("Product is not found");

  const price =
    Math.round((model.salePrice * (1 - model.discount / 100)) / 1000) * 1000;

  return {
    modelId: model._id.toString(),
    name: model.modelName
      ? `${product.productName} - ${model.modelName}`
      : product.productName,
    quantity,
    price,
    image: model.images?.[0] || "",
  };
};

const buildEditedOrderItems = async (currentItems, nextItems) => {
  if (!Array.isArray(nextItems) || nextItems.length === 0) {
    throw new Error("Order must contain at least one item");
  }

  const editedItems = [];
  for (const item of nextItems) {
    const quantity = Number(item.quantity);
    if (!item.modelId || !Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Invalid order item payload");
    }
    editedItems.push(await getOrderItemFromModel(item.modelId, quantity));
  }

  const qtyByModel = (items) =>
    items.reduce((acc, item) => {
      acc[item.modelId] = (acc[item.modelId] || 0) + Number(item.quantity || 0);
      return acc;
    }, {});

  const currentQty = qtyByModel(currentItems);
  const nextQty = qtyByModel(editedItems);
  const modelIds = new Set([
    ...Object.keys(currentQty),
    ...Object.keys(nextQty),
  ]);

  const deltas = [...modelIds].map((modelId) => ({
    modelId,
    delta: (nextQty[modelId] || 0) - (currentQty[modelId] || 0),
  }));

  const increases = deltas.filter((item) => item.delta > 0);
  if (increases.length > 0) {
    const stockModels = await ModelsModel.find({
      _id: { $in: increases.map((item) => item.modelId) },
    }).lean();

    for (const item of increases) {
      const stockModel = stockModels.find(
        (model) => model._id.toString() === item.modelId,
      );
      if (!stockModel || stockModel.stockQuantity < item.delta) {
        throw new Error("Not enough stock for the requested order change");
      }
    }
  }

  for (const item of deltas.filter((deltaItem) => deltaItem.delta !== 0)) {
    await ModelsModel.findByIdAndUpdate(item.modelId, {
      $inc: { stockQuantity: -item.delta },
    });
    await redisClient.hIncrBy(
      `stock:${item.modelId}`,
      "available",
      -item.delta,
    );
  }

  return editedItems;
};

const getAdminOrdersService = async ({
  status,
  paymentStatus,
  search,
  startDate,
  endDate,
  page = 0,
  limit = 10,
}) => {
  const pageNumber = Math.max(Number(page) || 0, 0);
  const pageSize = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const query = { status: { $nin: ["draft", "deleted"] } };
  const summaryQuery = { status: { $nin: ["draft", "deleted"] } };

  if (status && status !== "all") query.status = status;
  if (paymentStatus && paymentStatus !== "all") {
    query["payment.status"] = paymentStatus;
    summaryQuery["payment.status"] = paymentStatus;
  }
  if (startDate || endDate) {
    query.createdAt = {};
    summaryQuery.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
      summaryQuery.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
      summaryQuery.createdAt.$lte = new Date(endDate);
    }
  }
  if (search) {
    const regex = new RegExp(search, "i");
    const searchCriteria = [
      { orderId: regex },
      { email: regex },
      { "shippingInfo.receiver": regex },
      { "shippingInfo.phone": regex },
    ];
    query.$or = searchCriteria;
    summaryQuery.$or = searchCriteria;
  }

  const [orders, total, statusSummary] = await Promise.all([
    orderModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(pageNumber * pageSize)
      .limit(pageSize),
    orderModel.countDocuments(query),
    orderModel.aggregate([
      { $match: summaryQuery },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
  ]);

  const statusCounts = ADMIN_ORDER_STATUSES.reduce(
    (acc, orderStatus) => ({ ...acc, [orderStatus]: 0 }),
    {},
  );
  statusSummary.forEach((item) => {
    statusCounts[item._id] = item.count;
  });

  return {
    orders,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
    statusCounts,
  };
};

const getAdminOrderByIdService = async (id) => {
  const order = await orderModel.findById(id);
  if (!order) throw createServiceError("Order not found", 404);
  return buildOrderResponse(order);
};

const updateAdminOrderStatusService = async ({
  id,
  status,
  shipment = {},
  note,
  cancelReason,
  adminId,
}) => {
  if (!ADMIN_ORDER_STATUSES.includes(status)) {
    throw createServiceError("Invalid order status", 400);
  }

  const order = await orderModel.findById(id);
  if (!order) throw createServiceError("Order not found", 404);

  const allowedNextStatuses = STATUS_TRANSITIONS[order.status] || [];
  if (!allowedNextStatuses.includes(status)) {
    throw createServiceError(
      `Cannot change order from ${order.status} to ${status}`,
      400,
    );
  }

  const previousStatus = order.status;
  order.status = status;

  if (status === "shipping") {
    order.shipment = {
      ...order.shipment?.toObject?.(),
      ...shipment,
      shippedAt: order.shipment?.shippedAt || new Date(),
    };
    appendOrderEvent(order, {
      type: "shipment",
      message: "Shipment information updated",
      createdBy: adminId,
      metadata: shipment,
    });
  }

  if (status === "delivered") {
    order.shipment = {
      ...order.shipment?.toObject?.(),
      deliveredAt: new Date(),
    };
  }

  if (status === "cancelled") {
    await restockOrderItems(order);
    order.cancelReason = cancelReason || note || "Cancelled by admin";
    order.cancelledAt = new Date();
    order.cancelledBy = adminId;
    if (order.payment?.status === "paid") {
      order.refund.status = "needed";
      order.refund.amount = order.totalPrice;
      order.refund.reason = "Order cancelled after payment";
      order.refund.updatedAt = new Date();
    } else {
      order.payment.status = "cancelled";
    }
  }

  appendOrderEvent(order, {
    type: status === "cancelled" ? "cancel" : "status",
    message: note || `Order status changed from ${previousStatus} to ${status}`,
    from: previousStatus,
    to: status,
    createdBy: adminId,
  });

  await order.save();
  return buildOrderResponse(order);
};

const editAdminOrderService = async ({ id, items, shippingInfo, adminId }) => {
  const order = await orderModel.findById(id);
  if (!order) throw createServiceError("Order not found", 404);

  if (order.status !== "pending") {
    throw createServiceError(
      "Order can only be edited while pending confirmation",
      400,
    );
  }

  if (items) {
    order.items = await buildEditedOrderItems(order.items, items);
    order.totalPrice = order.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  if (shippingInfo) {
    order.shippingInfo = {
      ...order.shippingInfo?.toObject?.(),
      ...shippingInfo,
    };
  }

  appendOrderEvent(order, {
    type: "edit",
    message: "Admin updated order details",
    createdBy: adminId,
    metadata: {
      editedItems: Boolean(items),
      editedShippingInfo: Boolean(shippingInfo),
    },
  });

  await order.save();
  return buildOrderResponse(order);
};

const createAdminRmaService = async ({ id, items, reason, adminId }) => {
  const order = await orderModel.findById(id);
  if (!order) throw createServiceError("Order not found", 404);
  if (order.status !== "delivered") {
    throw createServiceError(
      "RMA can only be created for delivered orders",
      400,
    );
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw createServiceError("RMA must contain at least one item", 400);
  }

  const normalizedItems = items.map((item) => {
    const orderItem = order.items.find((i) => i.modelId === item.modelId);
    if (!orderItem)
      throw createServiceError("Returned item is not part of this order", 400);
    const requestedQty = Number(item.requestedQty);
    if (
      !Number.isInteger(requestedQty) ||
      requestedQty < 1 ||
      requestedQty > orderItem.quantity
    ) {
      throw createServiceError("Invalid return quantity", 400);
    }
    return {
      modelId: orderItem.modelId,
      name: orderItem.name,
      requestedQty,
      refundAmount: orderItem.price * requestedQty,
    };
  });

  const rma = await ReturnModel.create({
    orderId: order._id,
    items: normalizedItems,
    reason,
    createdBy: adminId,
  });

  appendOrderEvent(order, {
    type: "rma",
    message: "RMA request created",
    createdBy: adminId,
    metadata: { rmaId: rma._id, reason },
  });
  await order.save();

  return { order: await buildOrderResponse(order), rma };
};

const receiveAdminRmaService = async ({
  id,
  rmaId,
  warehouseNote,
  adminId,
}) => {
  const rma = await ReturnModel.findOne({ _id: rmaId, orderId: id });
  const order = await orderModel.findById(id);
  if (!rma || !order) throw createServiceError("RMA not found", 404);
  if (rma.status !== "requested") {
    throw createServiceError("RMA is not waiting to be received", 400);
  }

  rma.status = "received";
  rma.warehouseNote = warehouseNote;
  rma.receivedBy = adminId;
  rma.receivedAt = new Date();
  await rma.save();

  appendOrderEvent(order, {
    type: "rma",
    message: "Returned item received at warehouse",
    createdBy: adminId,
    metadata: { rmaId },
  });
  await order.save();

  return { order: await buildOrderResponse(order), rma };
};

const assessAdminRmaService = async ({ id, rmaId, items, adminId }) => {
  const rma = await ReturnModel.findOne({ _id: rmaId, orderId: id });
  const order = await orderModel.findById(id);
  if (!rma || !order) throw createServiceError("RMA not found", 404);
  if (rma.status !== "received") {
    throw createServiceError("RMA must be received before assessment", 400);
  }
  if (!Array.isArray(items)) {
    throw createServiceError("Assessment items are required", 400);
  }

  rma.items = rma.items.map((item) => {
    const assessed = items.find((i) => i.modelId === item.modelId);
    return assessed
      ? {
          ...item.toObject(),
          condition: assessed.condition,
          receivedQty: Number(assessed.receivedQty),
        }
      : item;
  });

  if (rma.items.some((item) => !["new", "damaged"].includes(item.condition))) {
    throw createServiceError("Each returned item needs a condition", 400);
  }

  rma.status = "assessed";
  rma.assessedBy = adminId;
  rma.assessedAt = new Date();
  await rma.save();

  appendOrderEvent(order, {
    type: "rma",
    message: "RMA condition assessed",
    createdBy: adminId,
    metadata: { rmaId },
  });
  await order.save();

  return { order: await buildOrderResponse(order), rma };
};

const matchAdminRmaQuantityService = async ({ id, rmaId, adminId }) => {
  const rma = await ReturnModel.findOne({ _id: rmaId, orderId: id });
  const order = await orderModel.findById(id);
  if (!rma || !order) throw createServiceError("RMA not found", 404);
  if (rma.status !== "assessed") {
    throw createServiceError(
      "RMA must be assessed before quantity matching",
      400,
    );
  }
  if (rma.items.some((item) => item.receivedQty !== item.requestedQty)) {
    throw createServiceError(
      "Received quantity does not match requested quantity",
      400,
    );
  }

  rma.status = "quantity_matched";
  rma.refundStatus = "ready";
  rma.quantityMatchedAt = new Date();
  await rma.save();

  appendOrderEvent(order, {
    type: "rma",
    message: "RMA quantity matched",
    createdBy: adminId,
    metadata: { rmaId },
  });
  await order.save();

  return { order: await buildOrderResponse(order), rma };
};

const refundAdminRmaService = async ({ id, rmaId, adminId }) => {
  const rma = await ReturnModel.findOne({ _id: rmaId, orderId: id });
  const order = await orderModel.findById(id);
  if (!rma || !order) throw createServiceError("RMA not found", 404);
  if (rma.status !== "quantity_matched" || rma.refundStatus !== "ready") {
    throw createServiceError("RMA is not ready for refund", 400);
  }

  const refundAmount = rma.items.reduce(
    (sum, item) => sum + Number(item.refundAmount || 0),
    0,
  );
  rma.status = "refunded";
  rma.refundStatus = "processed";
  rma.refundedBy = adminId;
  rma.refundedAt = new Date();
  await rma.save();

  order.refund.status = "processed";
  order.refund.amount = refundAmount;
  order.refund.reason = "Manual RMA refund processed";
  order.refund.updatedAt = new Date();
  order.refund.processedBy = adminId;

  appendOrderEvent(order, {
    type: "refund",
    message: "RMA refund processed manually",
    createdBy: adminId,
    metadata: { rmaId, refundAmount },
  });
  await order.save();

  return { order: await buildOrderResponse(order), rma };
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
  buildEditedOrderItems,
  getAdminOrdersService,
  getAdminOrderByIdService,
  updateAdminOrderStatusService,
  editAdminOrderService,
  createAdminRmaService,
  receiveAdminRmaService,
  assessAdminRmaService,
  matchAdminRmaQuantityService,
  refundAdminRmaService,
};
