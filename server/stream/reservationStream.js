// streams/reservationStream.js
import ModelsModel from "../model/productModel.model.js";

export function watchReservationTTLRelease(mongoose) {
  const changeStream = mongoose.connection
    .collection("reservations")
    .watch([{ $match: { operationType: "delete" } }], {
      fullDocumentBeforeChange: "required",
    });

  changeStream.on("change", async (event) => {
    const before = event.fullDocumentBeforeChange;
    if (!before) return;
    const isExpired = before.expireAt <= new Date()
    try {
      // Chỉ hoàn kho nếu delete do TTL (hết hạn)
      if (!before.isCheckout && isExpired) {
        await ModelsModel.updateOne(
          { _id: before.modelId },
          { $inc: { stockQuantity: before.quantity } }
        );
        console.log(
          `[TTL] released reservation for ${before.modelId} x${before.quantity} by ${before.userId}`
        );
      } else {
        // Xoá thủ công (checkout/cancel) => bỏ qua, KHÔNG hoàn kho
        console.log(
          `[RESV] manual delete ignored for ${before.modelId} x${before.quantity}`
        );
      }
    } catch (err) {
      console.error("Error handling TTL release:", err);
    }
  });

  changeStream.on("error", (e) => {
    console.error("ChangeStream error:", e);
  });

  return changeStream;
}
