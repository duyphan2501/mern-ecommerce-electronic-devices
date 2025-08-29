import express from "express"
import { getNextOrderCode } from "../controller/order.controller.js"
import checkAuth from "../middleware/auth.middleware.js"

const orderRouter = express.Router()

orderRouter.get('/get-next', checkAuth, getNextOrderCode)

export default orderRouter