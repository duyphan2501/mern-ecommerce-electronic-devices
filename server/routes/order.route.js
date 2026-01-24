import express from "express";
import { cancelOrder, createOrder, getAllOrders, getNextOrderCode, getOrderById, getOrderByOrderCode, getOrders, reOrder, setOrderStatus } from "../controller/order.controller.js";
import checkAuth from "../middleware/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.get("/get-next", checkAuth, getNextOrderCode);
orderRouter.get("/all", checkAuth, getAllOrders);
orderRouter.post("/create", checkAuth, createOrder);
orderRouter.get("/by-order-code/:orderCode", checkAuth, getOrderByOrderCode);
orderRouter.get("/id/:orderId", checkAuth, getOrderById);
orderRouter.put("/set-status/:orderIdObj", checkAuth, setOrderStatus);
orderRouter.put("/cancel/:orderIdObj", checkAuth, cancelOrder);
orderRouter.put("/reorder/:orderIdObj", checkAuth, reOrder);
orderRouter.get("/:status", checkAuth, getOrders);


export default orderRouter;
