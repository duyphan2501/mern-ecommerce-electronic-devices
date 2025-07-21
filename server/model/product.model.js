import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
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
});

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;
