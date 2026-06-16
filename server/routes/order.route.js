import express from "express";
import {
  assessAdminRma,
  cancelOrder,
  createAdminRma,
  createOrder,
  editAdminOrder,
  getAdminOrderById,
  getAdminDashboard,
  getAdminOrders,
  getAllOrders,
  getOrderById,
  getOrderByOrderCode,
  getOrders,
  matchAdminRmaQuantity,
  receiveAdminRma,
  refundAdminRma,
  reOrder,
  setOrderStatus,
  updateAdminOrderStatus,
} from "../controller/order.controller.js";
import checkAdmin from "../middleware/admin.middleware.js";
import checkAuth from "../middleware/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.get("/admin", checkAuth, checkAdmin, getAdminOrders);
orderRouter.get(
  "/admin/dashboard/summary",
  checkAuth,
  checkAdmin,
  getAdminDashboard,
);
orderRouter.get("/admin/:id", checkAuth, checkAdmin, getAdminOrderById);
orderRouter.put("/admin/:id/status", checkAuth, checkAdmin, updateAdminOrderStatus);
orderRouter.put("/admin/:id/edit", checkAuth, checkAdmin, editAdminOrder);
orderRouter.post("/admin/:id/rma", checkAuth, checkAdmin, createAdminRma);
orderRouter.put("/admin/:id/rma/:rmaId/receive", checkAuth, checkAdmin, receiveAdminRma);
orderRouter.put("/admin/:id/rma/:rmaId/assess", checkAuth, checkAdmin, assessAdminRma);
orderRouter.put("/admin/:id/rma/:rmaId/match-quantity", checkAuth, checkAdmin, matchAdminRmaQuantity);
orderRouter.put("/admin/:id/rma/:rmaId/refund", checkAuth, checkAdmin, refundAdminRma);
orderRouter.get("/all", checkAuth, checkAdmin, getAllOrders);
orderRouter.post("/create", checkAuth, createOrder);
orderRouter.get("/by-order-code/:orderCode", checkAuth, getOrderByOrderCode);
orderRouter.get("/id/:orderId", checkAuth, getOrderById);
orderRouter.put("/set-status/:orderIdObj", checkAuth, setOrderStatus);
orderRouter.put("/cancel/:orderIdObj", checkAuth, cancelOrder);
orderRouter.put("/reorder/:orderIdObj", checkAuth, reOrder);
orderRouter.get("/:status", checkAuth, getOrders);


export default orderRouter;
