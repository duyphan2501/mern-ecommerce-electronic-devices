import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    uniqued: true,
    required: true,
  },
  image: String,
});

const BrandModel = mongoose.model("brands", brandSchema);

export default BrandModel;
