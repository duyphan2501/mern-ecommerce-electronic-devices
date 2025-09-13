import ModelsModel from "../model/productModel.model.js";
import ReservationModel from "../model/reservation.model.js";

const reserveStock = async (
  userId = null,
  guestId = null,
  modelId,
  quantity,
  isUpdate = false
) => {
  if (!userId && !guestId) return;

  const expireAt = new Date(Date.now() + 1000 * 60 * 60 * 2); // 2 giờ
  let reservation;

  if (userId) {
    reservation = await ReservationModel.findOne({ modelId, userId });
  } else if (guestId) {
    reservation = await ReservationModel.findOne({ modelId, guestId });
  }

  let oldQuantity = reservation ? reservation.quantity : 0;
  let newQuantity = oldQuantity;

  if (reservation) {
    // === UPDATE EXISTING ===
    if (!isUpdate) {
      newQuantity = reservation.quantity + quantity; // cộng thêm
    } else {
      newQuantity = quantity; // set lại tuyệt đối
    }

    let diff = newQuantity - reservation.quantity;

    if (diff !== 0) {
      if (diff > 0) {
        // cần thêm hàng => check + trừ trong 1 bước
        let updatedModel = await ModelsModel.updateOne(
          { _id: modelId, stockQuantity: { $gte: diff } },
          { $inc: { stockQuantity: -diff } },
          { new: true }
        );

        if (!updatedModel.modifiedCount) {
          // không đủ diff, lấy hết còn lại
          const modelLeft = await ModelsModel.findOneAndUpdate(
            { _id: modelId, stockQuantity: { $gte: 1 } },
            { $set: { stockQuantity: 0 } },
            { new: false } // trả về trước khi set
          );

          if (!modelLeft) {
            return {
              reservedQty: reservation.quantity,
              changed: 0,
            };
          }

          diff = modelLeft.stockQuantity; 
        }
        reservation.quantity += diff;
        newQuantity = reservation.quantity
      } else {
        // giảm số lượng => hoàn kho
        await ModelsModel.updateOne(
          { _id: modelId },
          { $inc: { stockQuantity: -diff } } // diff < 0 => -diff > 0 => hoàn lại
        );
        reservation.quantity = newQuantity;
      }
    }

    reservation.expireAt = expireAt;
    await reservation.save();
  } else {
    // === CREATE NEW ===
    const updatedModel = await ModelsModel.updateOne(
      { _id: modelId, stockQuantity: { $gte: quantity } },
      { $inc: { stockQuantity: -quantity } },
      { new: true }
    );

    if (!updatedModel.modifiedCount) {
      throw new Error("Out of stock");
    }

    reservation = await ReservationModel.create({
      modelId,
      userId,
      guestId,
      quantity,
      expireAt,
    });

    newQuantity = quantity;
  }

  return {
    reservedQty: reservation.quantity,
    changed: newQuantity - oldQuantity,
  };
};

const cancelStockReservation = async (
  userId = null,
  guestId = null,
  modelId,
  checkout = false
) => {
  if (!modelId || (!userId && !guestId)) return;

  const filter = userId ? { modelId, userId } : { modelId, guestId };

  if (checkout) {
    await ReservationModel.updateOne(filter, { isCheckout: true });
  } else {
    await ReservationModel.updateOne(filter, { expireAt: new Date() });
  }

  await ReservationModel.deleteOne(filter);
};

export { reserveStock, cancelStockReservation };
