import express from "express";
import { getAllOrders, getNextOrderCode } from "../controller/order.controller.js";
import checkAuth from "../middleware/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.get("/get-next", checkAuth, getNextOrderCode);
orderRouter.get("/all", checkAuth, getAllOrders);

export default orderRouter;
