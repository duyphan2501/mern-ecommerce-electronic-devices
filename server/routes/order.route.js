import express from "express";
import { createOrder, getAllOrders, getNextOrderCode, getOrderByOrderCode } from "../controller/order.controller.js";
import checkAuth from "../middleware/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.get("/get-next", checkAuth, getNextOrderCode);
orderRouter.get("/all", checkAuth, getAllOrders);
orderRouter.post("/create", checkAuth, createOrder);
orderRouter.get("/by-order-code/:orderCode", checkAuth, getOrderByOrderCode);

export default orderRouter;
