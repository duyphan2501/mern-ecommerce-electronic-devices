import mongoose from "mongoose";

const stockExportItemSchema = new mongoose.Schema(
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
    unitSalePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    totalSale: {
      type: Number,
      required: true,
      min: 0,
    },
    profit: {
      type: Number,
      required: true,
    },
    note: String,
  },
  { _id: false },
);

const stockExportSchema = new mongoose.Schema(
  {
    exportCode: {
      type: String,
      required: true,
      unique: true,
    },
    items: {
      type: [stockExportItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "Export must have at least one item",
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
    totalSale: {
      type: Number,
      required: true,
      min: 0,
    },
    profit: {
      type: Number,
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

const StockExportModel = mongoose.model("stockExports", stockExportSchema);

export default StockExportModel;
