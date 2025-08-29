import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: Number, required: true, unique: true }, // Mã đơn hàng duy nhất
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    addressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addresses",
      required: true,
    },
    totalPrice: { type: Number, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "success", "cancelled", "removed", "ondelivery"],
      default: "pending",
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
