import mongoose from "mongoose";

const inventoryMovementSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["import", "order_export", "manual_export"],
      required: true,
    },
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
    unitSalePrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    totalSale: {
      type: Number,
      default: 0,
      min: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    referenceType: {
      type: String,
      enum: ["goods_receipt", "order", "stock_export"],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    note: String,
  },
  { timestamps: true },
);

inventoryMovementSchema.index({ modelId: 1, createdAt: -1 });
inventoryMovementSchema.index({ type: 1, createdAt: -1 });
inventoryMovementSchema.index({ referenceType: 1, referenceId: 1 });

const InventoryMovementModel = mongoose.model(
  "inventoryMovements",
  inventoryMovementSchema,
);

export default InventoryMovementModel;
