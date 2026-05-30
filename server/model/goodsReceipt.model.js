import mongoose from "mongoose";

const goodsReceiptItemSchema = new mongoose.Schema(
  {
    modelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "models",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },
    unitCost: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    note: String,
  },
  { _id: false },
);

const goodsReceiptSchema = new mongoose.Schema(
  {
    receiptCode: {
      type: String,
      required: true,
      unique: true,
    },
    items: {
      type: [goodsReceiptItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Receipt must have at least one item",
      },
    },
    totalQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    note: String,
  },
  { timestamps: true },
);

const GoodsReceiptModel = mongoose.model("goodsReceipts", goodsReceiptSchema);

export default GoodsReceiptModel;
