import client from "../config/init.redis.js";
const REDIS_CHANNEL = "order_events"

const publishSendOrderEmail = async (order) => {
  const messagePayload = JSON.stringify(order);
  const subscriberCount = await client.publish(REDIS_CHANNEL, messagePayload);
  console.log(
    `Đã publish sự kiện đơn hàng lên Redis. ${subscriberCount} người nghe nhận được.`
  );
};

export {publishSendOrderEmail};