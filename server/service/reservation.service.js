import ModelsModel from "../model/productModel.model.js";
import ReservationModel from "../model/reservation.model.js";

const reserveStock = async (userId, modelId, newQuantity) => {
  if (!userId) return
  const expireAt = new Date(Date.now() + 1000 * 60); // giữ chỗ 1 phút
  // const expireAt = new Date(Date.now() + 1000 * 60 * 60 * 2); // hoặc 2 giờ

  let reservation = await ReservationModel.findOne({ userId, modelId });

  if (reservation) {
    // đã có giữ chỗ, tính chênh lệch
    const diff = newQuantity - reservation.quantity;

    if (diff !== 0) {
      const res = await ModelsModel.updateOne(
        { _id: modelId, stockQuantity: { $gte: diff > 0 ? diff : 0 } },
        { $inc: { stockQuantity: -diff } } // diff > 0 → giảm kho, diff < 0 → hoàn kho
      );

      if (!res.modifiedCount) {
        throw new Error("Not enough stock to update reservation");
      }
    }

    reservation.quantity = newQuantity;
    reservation.expireAt = expireAt;
    await reservation.save();
  } else {
    // chưa có giữ chỗ, tạo mới
    const res = await ModelsModel.updateOne(
      { _id: modelId, stockQuantity: { $gte: newQuantity } },
      { $inc: { stockQuantity: -newQuantity } }
    );

    if (!res.modifiedCount) {
      throw new Error("Out of stock");
    }

    reservation = await ReservationModel.create({
      modelId,
      userId,
      quantity: newQuantity,
      expireAt,
    });
  }

  return reservation;
};


const cancelStockReservation = async (userId, modelId, checkout = false) => {
  if (!userId || !modelId) return;
  if (checkout) {
    await ReservationModel.updateOne({ userId, modelId }, { isCheckout: true });
  } else {
    await ReservationModel.updateOne({ userId, modelId }, { expireAt: new Date() });
  }
  await ReservationModel.deleteOne({ userId, modelId });
};

export { reserveStock, cancelStockReservation };
