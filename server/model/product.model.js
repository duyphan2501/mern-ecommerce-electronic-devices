import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    brandId: {
      type: mongoose.Schema.ObjectId,
      ref: "brands",
    },
    description: {
      type: String,
      required: true,
    },
    categoryIds: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "categories",
        required: true,
      },
    ],
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
    hasModels: { type: Boolean, default: false },
    modelsId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "models",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// 1. Tạo field ảo "brand" trỏ tới collection "brands" thông qua "brandId"
productSchema.virtual("brand", {
  ref: "brands", // Tên model tham chiếu
  localField: "brandId", // Field chứa ID trong Product
  foreignField: "_id", // Field ID trong Brand
  justOne: true, // Trả về 1 object thay vì mảng
});

// 2. Cấu hình để field ảo này xuất hiện khi trả về API
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

const ProductModel = mongoose.model("products", productSchema);

export default ProductModel;
