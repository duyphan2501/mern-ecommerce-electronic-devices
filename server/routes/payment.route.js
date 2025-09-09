import express from 'express'
import { cancelPayment, createPayment, getPaymentInfo, verifyWebhookData } from '../controller/payment.controller.js'
import checkAuth from '../middleware/auth.middleware.js';

const paymentRouter = express.Router();

paymentRouter.post("/create", checkAuth, createPayment);
paymentRouter.get("/get/:orderCode", checkAuth, getPaymentInfo);
paymentRouter.post("/webhook/payos", verifyWebhookData)
paymentRouter.get("/cancel", checkAuth, cancelPayment)

export default paymentRouter
