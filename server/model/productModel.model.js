import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
  {
    modelName: String,
    discount: { type: Number, required: true },
    tax: { type: Number, required: true },
    stockQuantity: { type: Number, required: true, min: 0 },
    soldQuantity: { type: Number, required: true, default: 0 },
    salePrice: { type: Number, required: true },
    expectedQuantity: { type: Number, required: true },
    minimumQuantity: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    specifications: { type: String, required: true },
    documents: [{ type: String }],
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "products",
      required: true,
    },
  },
  { timestamps: true },
);

const ModelsModel = mongoose.model("models", modelSchema);

export default ModelsModel;
