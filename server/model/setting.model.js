import mongoose from "mongoose";

const commonInformationSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: "",
      trim: true,
    },
    tagline: {
      type: String,
      default: "",
      trim: true,
    },
    logo: {
      type: String,
      default: "",
      trim: true,
    },
    favicon: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    hotline: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
      trim: true,
    },
    openingHours: {
      type: String,
      default: "",
      trim: true,
    },
    facebook: {
      type: String,
      default: "",
      trim: true,
    },
    instagram: {
      type: String,
      default: "",
      trim: true,
    },
    youtube: {
      type: String,
      default: "",
      trim: true,
    },
    tiktok: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: false },
);

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    commonInformation: {
      type: commonInformationSchema,
      default: () => ({}),
    },
  },
  { timestamps: true },
);

const SettingModel = mongoose.model("settings", settingSchema);

export default SettingModel;
