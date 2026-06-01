import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: Number, required: true, unique: true }, // Mã đơn hàng cho payos
    orderId: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    email: { type: String, required: true },
    items: [
      {
        modelId : { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1  },
        price: { type: Number, required: true},
        image: { type: String },
      },
    ],
    shippingInfo: {
      phone: String,
      receiver: String,
      ward: String,
      province: String,
      addressDetail: String
    },
    totalPrice: { type: Number, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "packing",
        "shipping",
        "delivered",
        "cancelled",
        "draft",
        "deleted",
      ],
      default: "draft",
    },
    statusHistory: [
      {
        type: {
          type: String,
          enum: [
            "created",
            "payment",
            "edit",
            "status",
            "shipment",
            "cancel",
            "rma",
            "refund",
          ],
          required: true,
        },
        message: { type: String, required: true },
        from: String,
        to: String,
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        metadata: mongoose.Schema.Types.Mixed,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    shipment: {
      carrier: String,
      trackingCode: String,
      trackingUrl: String,
      shippedAt: Date,
      deliveredAt: Date,
    },
    refund: {
      status: {
        type: String,
        enum: ["none", "needed", "processed", "rejected"],
        default: "none",
      },
      amount: { type: Number, default: 0 },
      reason: String,
      updatedAt: Date,
      processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    },
    cancelReason: String,
    cancelledAt: Date,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    payment: {
      provider: {
        type: String,
        enum: ["payos", "cod"],
        default: "cod",
      },
      status: {
        type: String,
        enum: ["pending", "cancelled", "paid", "failed"],
        default: "pending",
      },
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

const orderModel = mongoose.model("orders", orderSchema);
export default orderModel;
