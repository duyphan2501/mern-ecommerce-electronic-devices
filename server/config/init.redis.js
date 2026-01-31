import { createClient } from "redis";
import dotenv from "dotenv";
import { sendOrderConfirmEmail } from "../mail/emails.js";
import { cancelStockReservation } from "../service/reservation.service.js";
import { removeCartItem } from "../service/cart.service.js";
import CartModel from "../model/cart.model.js";
dotenv.config({ quiet: true });

const REDIS_CHANNEL = "order_events";

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Client connected successfully"));
await redisClient.connect();

// --- CLIENT 2: Dành riêng cho SUBSCRIBER (Lắng nghe) ---
const subscriberClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});
subscriberClient.on("error", (err) =>
  console.error("Subscriber Client Error", err),
);
await subscriberClient.connect();
console.log("Subscriber Client connected successfully");

async function subscribeToOrderEvents() {
  await subscriberClient.subscribe(REDIS_CHANNEL, async (message) => {
    try {
      const orderData = JSON.parse(message);
      console.log(`Received order event: ${orderData.orderId}`);
      const userId = orderData.userId;
      for (const item of orderData.items) {
        await cancelStockReservation(userId, null, item.modelId, true);
        await removeCartItem(userId, null, item.modelId);
      }
      await CartModel.deleteOne({ userId });
      await sendOrderConfirmEmail(orderData);
      console.log("Post-processing order is complete.", orderData.orderId);
    } catch (error) {
      console.error("Pub/Sub error:", error);
    }
  });
  console.log(`Redis Subscriber is listening on channel "${REDIS_CHANNEL}"`);
}

subscribeToOrderEvents();

export default redisClient;
