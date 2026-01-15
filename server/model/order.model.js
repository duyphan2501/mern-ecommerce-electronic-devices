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
    items: [
      {
        modelId : { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1  },
        price: { type: Number, required: true},
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
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled", "processing", "draft"],
      default: "draft",
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
