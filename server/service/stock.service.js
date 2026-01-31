import { getCartExpireAt, getReserveExpireAt } from "../config/constants.js";
import redisClient from "../config/init.redis.js";
import ModelsModel from "../model/productModel.model.js";
import {
  RESERVE_LUA,
  RECLAIM_LUA,
  CONFIRM_ORDER_LUA,
} from "../scripts/stock.lua.js";

const StockService = {
  reserve: (ownerId, modelId, targetQty, isUser = true) =>
    redisClient.eval(RESERVE_LUA, {
      keys: [
        `stock:${modelId}`,
        `reservation:${ownerId}:${modelId}`,
        `cart:${ownerId}`,
        "reservation:zset",
      ],
      arguments: [
        modelId.toString(),
        targetQty.toString(),
        getCartExpireAt(isUser ? "USER" : "GUEST"),
        getReserveExpireAt(),
      ],
    }),
  reclaim: () =>
    redisClient.eval(RECLAIM_LUA, {
      keys: ["reservation:zset"],
      arguments: [Math.floor(Date.now() / 1000).toString()],
    }),
  confirm: ({ item, userId }) =>
    redisClient.eval(CONFIRM_ORDER_LUA, {
      keys: [
        `stock:${item.modelId}`,
        `reservation:${userId}:${item.modelId}`,
        `cart:${userId}`,
        "reservation:zset",
      ],
      arguments: [item.modelId.toString()],
    }),
  getStockinfo: async (modelId) => {
    const stockData = await redisClient.hGetAll(`stock:${modelId}`);
    return {
      available: parseInt(stockData.available) || 0,
      reserved: parseInt(stockData.reserved) || 0,
    };
  },
};

async function rebuildStockRedis() {
  const models = await ModelsModel.find({}).lean();

  // ===== 1. RESET STOCK =====
  for (const model of models) {
    const modelId = model._id.toString();

    await redisClient.hSet(`stock:${modelId}`, {
      available: String(model.stockQuantity),
      reserved: "0",
    });
  }

  // ===== 2. REBUILD FROM RESERVATION =====
  const pattern = "reservation:*:*";

  for await (let key of redisClient.scanIterator({
    MATCH: pattern,
    COUNT: 100,
  })) {
    key = key.toString();

    const parts = key.split(":");

    if (parts.length !== 3) continue;

    const [, ownerId, modelId] = parts;

    const qty = Number(await redisClient.hGet(key, "qty"));

    if (!Number.isInteger(qty) || qty <= 0) continue;

    await redisClient.hIncrBy(`stock:${modelId}`, "reserved", qty);
    await redisClient.hIncrBy(`stock:${modelId}`, "available", -qty);
  }

  console.log("[StockService] Rebuild completed");
}

export { rebuildStockRedis, StockService };
