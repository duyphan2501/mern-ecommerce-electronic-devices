import client from "../config/init.redis.js";
import ModelsModel from "../model/productModel.model.js";
import ReservationModel from "../model/reservation.model.js";

const reserveStock = async (
  userId = null,
  guestId = null,
  modelId,
  quantity,
  isUpdate = false,
  isCheckout = false,
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

  if (isCheckout && newQuantity === quantity) {
    return {
      reservedQty: reservation.quantity,
      changed: 0,
    };
  }

  if (reservation) {
    // === UPDATE EXISTING ===
    if (!isUpdate) {
      newQuantity = oldQuantity + quantity;
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
          { new: true },
        );

        if (!updatedModel.modifiedCount) {
          if (isCheckout) {
            throw new Error("Out of stock");
          }
          // không đủ diff, lấy hết còn lại
          const modelLeft = await ModelsModel.findOneAndUpdate(
            { _id: modelId, stockQuantity: { $gte: 1 } },
            { $set: { stockQuantity: 0 } },
            { new: false }, // trả về trước khi set
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
        newQuantity = reservation.quantity;
      } else {
        // giảm số lượng => hoàn kho
        await ModelsModel.updateOne(
          { _id: modelId },
          { $inc: { stockQuantity: -diff } }, // diff < 0 => -diff > 0 => hoàn lại
        );
        reservation.quantity = newQuantity;
      }
    }

    reservation.expireAt = expireAt;
    await reservation.save();
  } else {
    let targetQuantity = quantity;

    if (!isUpdate) {
      const quantityInCart = await client.hGet(
        guestId ? `cart:${guestId}` : `cart:${userId}`,
        `product:${modelId}`,
      );
      targetQuantity += parseInt(quantityInCart || "0", 10);
    }

    // === CREATE NEW ===
    const updatedModel = await ModelsModel.updateOne(
      { _id: modelId, stockQuantity: { $gte: targetQuantity } },
      { $inc: { stockQuantity: -targetQuantity } },
      { new: true },
    );

    if (!updatedModel.modifiedCount) {
      if (isCheckout) {
        throw new Error("Out of stock");
      }
      // Nếu không đủ, cố gắng lấy hết những gì còn lại
      const modelLeft = await ModelsModel.findOneAndUpdate(
        { _id: modelId, stockQuantity: { $gt: 0 } },
        { $set: { stockQuantity: 0 } },
        { new: false },
      );
      quantity = modelLeft ? modelLeft.stockQuantity : 0;
      if (quantity === 0) {
        throw new Error("Out of stock");
      }
      targetQuantity = quantity;
    }

    reservation = await ReservationModel.create({
      modelId,
      userId,
      guestId,
      quantity: targetQuantity,
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
  isCheckout = false,
) => {
  const filter = userId ? { modelId, userId } : { modelId, guestId };
  if (isCheckout) {
    await ReservationModel.updateOne(filter, { $set: { isCheckout: true } });
    await ReservationModel.deleteOne(filter);
  } else {
    await ReservationModel.deleteOne(filter);
  }
};

const updateReservationQuantity = async (
  userId = null,
  guestId = null,
  modelId,
  reservedQty,
) => {
  return await ReservationModel.findOneAndUpdate(
    {
      modelId,
      ...(userId ? { userId } : { guestId }),
      status: "active",
    },
    {
      quantity: reservedQty,
      expireAt: new Date(Date.now() + 30 * 60 * 1000),
    },
    { upsert: true },
  );
};

export { reserveStock, cancelStockReservation, updateReservationQuantity };
