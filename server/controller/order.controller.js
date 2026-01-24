import orderModel from "../model/order.model.js";
import { createNewOrder, generateOrderCode, handleOrderCreation, restockOrderItems } from "../service/order.service.js";
import { reserveStock } from "../service/reservation.service.js";

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
      .find({ status: { $nin: ["processing", "draft", "deleted", "cancelled"] } })
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

const getOrders = async (req, res) => {
  // Implementation for getting orders for a specific user
  try {
     const userId = req.user.userId;
     const status = req.params.status; 
     const terms = req.query.terms;
     if (!status) {
       return res
         .status(400)
         .json({ message: "Missing status parameter", success: false });
     }
     const orders = await orderModel.find({ userId, status }).sort({ createdAt: -1 });
     return res.status(200).json({ orders, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, success: false });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res
        .status(400)
        .json({ message: "Missing orderId parameter", success: false });
    }
    const order = await orderModel.findOne({ orderId: orderId });
    return res.status(200).json({ order, success: true });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, success: false });
  }
};

const setOrderStatus = async (req, res) => {
  try {
    const { orderIdObj } = req.params;
    const { status } = req.body;

    if (!orderIdObj || !status) {
      return res.status(400).json({
        message: "Missing orderIdObj or status parameter",
        success: false,
      });
    }

    const order = await orderModel.findByIdAndUpdate(
      orderIdObj,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    return res.status(200).json({
      order,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, success: false });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const { orderIdObj } = req.params;

    if (!orderIdObj) {
      return res.status(400).json({
        message: "Missing orderId or status parameter",
        success: false,
      });
    }

    const order = await orderModel.findById(orderIdObj);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    await restockOrderItems(order);

    order.status = "cancelled";
    await order.save();
   
    return res.status(200).json({
      order,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || error, success: false });
  }
}

const reOrder = async (req, res) => {
  try {
    const { orderIdObj } = req.params;
    const userId = req.user.userId;

    if (!orderIdObj) {
      return res.status(400).json({
        message: "Missing orderIdObj parameter",
        success: false,
      });
    }

    const existingOrder = await orderModel.findById(orderIdObj);
    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    const results = [];
    
    for (const item of existingOrder.items) {
      try {
        const result = await reserveStock(userId, null, item.modelId, item.quantity, true);
        results.push({
          modelId: item.modelId,
          status: "success",
          reservedQty: result.reservedQty
        });
      } catch (error) {
        // Nếu item này hết hàng hoặc lỗi, chỉ ghi log và bỏ qua, không văng lỗi ra ngoài
        console.warn(`Không thể re-order item ${item.modelId}:`, error.message);
        results.push({
          modelId: item.modelId,
          status: "failed",
          reason: error.message
        });
      }
    }

    // Kiểm tra xem có item nào thành công không
    const successCount = results.filter(r => r.status === "success").length;

    if (successCount === 0) {
      return res.status(400).json({
        message: "Tất cả sản phẩm trong đơn hàng này hiện đã hết hàng.",
        success: false,
        details: results
      });
    }

    return res.status(201).json({
      message: `Re-order thành công ${successCount}/${existingOrder.items.length} sản phẩm.`,
      success: true,
      details: results 
    });

  } catch (error) {
    console.error("Error re-ordering:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      success: false,
    });
  }
};

export { getNextOrderCode, getAllOrders, createOrder, getOrderByOrderCode, getOrders, getOrderById, setOrderStatus, cancelOrder, reOrder };