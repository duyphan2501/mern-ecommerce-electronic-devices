import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    link: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "active"],
      default: "draft",
      index: true,
    },
    order: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true },
);

serviceSchema.index({ status: 1, order: 1, createdAt: 1 });

const ServiceModel = mongoose.model("services", serviceSchema);

export default ServiceModel;
