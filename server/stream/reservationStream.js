// streams/reservationStream.js
import ModelsModel from "../model/productModel.model.js";

export function watchReservationTTLRelease(mongoose) {
  const changeStream = mongoose.connection
    .collection("reservations")
    .watch([{ $match: { operationType: "delete" } }], {
      fullDocumentBeforeChange: "required",
    });

  changeStream.on("change", async (event) => {
    if (event.operationType !== "delete") return;

    const before = event.fullDocumentBeforeChange;
    if (!before) return;

    if (before.isCheckout === false) {
      await ModelsModel.updateOne(
        { _id: before.modelId },
        { $inc: { stockQuantity: before.quantity } },
      );
      console.log(
        `[RELEASED] Model: ${before.modelId}, Qty: ${before.quantity}`,
      );
    }
  });

  changeStream.on("error", (e) => {
    console.error("ChangeStream error:", e);
  });

  return changeStream;
}
