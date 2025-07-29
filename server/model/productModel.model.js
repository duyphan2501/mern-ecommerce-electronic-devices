import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
  name: String,
  discount: { type: Number, required: true },
  tax: { type: Number, required: true },
  inStock: { type: Number, required: true },
  expectedQuantity: { type: Number, required: true },
  minimumQuantity: { type: Number, required: true },
  salePrice: { type: Number, required: true },
  costPrice: { type: Number, required: true },
  specifications: { type: String, required: true },
  documents: [{ type: String}],
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "products",
    required: true,
  },
});

const ModelsModel = mongoose.model("models", modelSchema);

export default ModelsModel;
