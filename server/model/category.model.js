import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    uniqued: true,
    required: true,
  },
  parentId: String,
  image: String,
});

const CategoryModel = mongoose.model("categories", categorySchema);

export default CategoryModel;
