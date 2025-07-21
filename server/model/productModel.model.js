import mongoose from "mongoose";

const modelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  discount: { type: Number, required: true },
  inStock: { type: Number, required: true },
  technicalInfo: { type: String, required: true },
  technicalDocument: [{ type: String}],
  rating: { type: Number, default: 0 },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "products",
    required: true,
  },
});

const ModelsModel = mongoose.model("models", modelSchema);

export default ModelsModel;
