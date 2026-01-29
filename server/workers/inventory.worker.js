import { StockService } from "../service/stock.service.js";

// Chạy mỗi 30 giây để quét và hoàn kho các reservation hết hạn
export const startInventoryWorker = () => {
  setInterval(async () => {
    try {
      const processed = await StockService.reclaim();
      if (processed > 0) console.log(`[Worker] Reclaimed ${processed} items`);
    } catch (err) {
      console.error("[Worker Error]", err);
    }
  }, 30000);
};
