import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import userRouter from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import addressRouter from "./routes/address.route.js";
import paymentRouter from "./routes/payment.route.js";
import orderRouter from "./routes/order.route.js";
import inventoryRouter from "./routes/inventory.route.js";
import { startNgrokAndConfirmWebhook } from "./config/payos.init.js";
import { startInventoryWorker } from "./workers/inventory.worker.js";
import { rebuildStockRedis } from "./service/stock.service.js";
import errorHandler from "./middleware/error.middleware.js";
import brandRouter from "./routes/brand.route.js";
import slideRouter from "./routes/slide.route.js";
import serviceRouter from "./routes/service.route.js";
import blogRouter from "./routes/blog.route.js";

dotenv.config({ quiet: true });
const app = express();
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_URL],
    credentials: true, // Cho phép gửi cookie
  }),
);

app.use(cookieParser());
app.use(express.json());
app.get("/ping", (req, res) => {
  res.status(200).send("ok");
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/order", orderRouter);
app.use("/api/brand", brandRouter);
app.use("/api/inventory", inventoryRouter);
app.use("/api/slides", slideRouter);
app.use("/api/services", serviceRouter);
app.use("/api/blogs", blogRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, async () => {
    console.log("Server is running on Port", PORT);
    startNgrokAndConfirmWebhook();
    startInventoryWorker();     
    await rebuildStockRedis();
  });
});
