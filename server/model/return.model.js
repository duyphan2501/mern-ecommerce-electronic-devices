import mongoose from "mongoose";

const returnItemSchema = new mongoose.Schema(
  {
    modelId: { type: String, required: true },
    name: { type: String, required: true },
    requestedQty: { type: Number, required: true, min: 1 },
    receivedQty: { type: Number, default: 0, min: 0 },
    condition: {
      type: String,
      enum: ["new", "damaged"],
    },
    refundAmount: { type: Number, default: 0 },
  },
  { _id: false },
);

const returnSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
      required: true,
    },
    items: [returnItemSchema],
    status: {
      type: String,
      enum: [
        "requested",
        "received",
        "assessed",
        "quantity_matched",
        "refunded",
        "rejected",
      ],
      default: "requested",
    },
    reason: String,
    warehouseNote: String,
    refundStatus: {
      type: String,
      enum: ["none", "ready", "processed"],
      default: "none",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    assessedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    refundedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    receivedAt: Date,
    assessedAt: Date,
    quantityMatchedAt: Date,
    refundedAt: Date,
  },
  { timestamps: true },
);

const ReturnModel = mongoose.model("returns", returnSchema);
export default ReturnModel;
