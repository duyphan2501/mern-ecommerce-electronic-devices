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

  let reservation = await ReservationModel.findOne({
    modelId,
    $or: [{ userId }, { guestId }],
  });

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
        // cần thêm hàng => check stock
        const model =
          await ModelsModel.findById(modelId).select("stockQuantity");

        if (!model || model.stockQuantity <= 0) {
          // không còn hàng => giữ nguyên reservation cũ
          return {
            reservedQty: reservation.quantity,
            changed: 0,
          };
        }

        // chỉ lấy được tối đa số stock hiện tại
        const addable = Math.min(diff, model.stockQuantity);

        await ModelsModel.updateOne(
          { _id: modelId, stockQuantity: { $gte: addable } },
          { $inc: { stockQuantity: -addable } }
        );

        newQuantity = reservation.quantity + addable;
      } else {
        // giảm số lượng => hoàn kho
        await ModelsModel.updateOne(
          { _id: modelId },
          { $inc: { stockQuantity: -diff } } // diff < 0 => -diff > 0 => hoàn lại
        );
      }
    }

    reservation.quantity = newQuantity;
    reservation.expireAt = expireAt;
    await reservation.save();
  } else {
    // === CREATE NEW ===
    const model = await ModelsModel.findById(modelId).select("stockQuantity");
    if (!model || model.stockQuantity <= 0) {
      throw new Error("Out of stock");
    }

    const reservable = Math.min(quantity, model.stockQuantity);

    await ModelsModel.updateOne(
      { _id: modelId, stockQuantity: { $gte: reservable } },
      { $inc: { stockQuantity: -reservable } }
    );

    reservation = await ReservationModel.create({
      modelId,
      userId,
      guestId,
      quantity: reservable,
      expireAt,
    });

    newQuantity = reservable;
  }

  return {
    reservedQty: reservation.quantity, // tổng số lượng đang giữ
    changed: newQuantity - oldQuantity, // số lượng thay đổi (+ thêm, - bớt)
  };
};

const cancelStockReservation = async (
  userId = null,
  guestId = null,
  modelId,
  checkout = false
) => {
  if (!modelId || (!userId && !guestId)) return;

  if (checkout) {
    await ReservationModel.updateOne(
      { $or: [{ userId }, { guestId }], modelId },
      { isCheckout: true }
    );
  } else {
    await ReservationModel.updateOne(
      { $or: [{ userId }, { guestId }], modelId },
      { expireAt: new Date() }
    );
  }
  await ReservationModel.deleteOne({ $or: [{ userId }, { guestId }], modelId });
};

export { reserveStock, cancelStockReservation };
