import orderModel from "../model/order.model.js";

async function generateOrderCode() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2); // chỉ lấy 2 số cuối năm
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  // Tìm số đơn hàng hôm nay
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const countToday = await orderModel.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  const sequence = String(countToday + 1).padStart(4, "0"); // 0001, 0002...

  // Trả về số: YYMMDD + sequence
  return Number(`${year}${month}${day}${sequence}`);
}

export { generateOrderCode };
