import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  brandId: {
    type: mongoose.Schema.ObjectId,
    ref: "brands",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.ObjectId,
    ref: "categories",
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "active", "archived"],
    default: "draft",
  },
  shippingCost: { type: Number, required: true },
  images: { type: [String], required: true },
  pageTitle: String,
  metaKeywords: String,
  metaDescription: String,
  productUrl: String,
  modelsId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "models",
    },
  ],
});

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;
