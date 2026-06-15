import mongoose from "mongoose";

const slideSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["hero", "feature", "side"],
      required: true,
      index: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    mobileImage: {
      type: String,
      default: "",
      trim: true,
    },
    title: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      default: "",
      trim: true,
    },
    footer: {
      type: String,
      default: "",
      trim: true,
    },
    link: {
      type: String,
      default: "",
      trim: true,
    },
    linkContent: {
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

slideSchema.index({ type: 1, order: 1, createdAt: 1 });

const SlideModel = mongoose.model("slides", slideSchema);

export default SlideModel;

