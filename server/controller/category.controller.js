import cloudinary from "../config/cloudinary.config.js";
import CategoryModel from "../model/category.model.js";
import fs from "fs";
import extractPublicId from "../helper/extractPuclicId.js";

const categoryFolder = "categories";
let uploadedImage = "";

const uploadImage = async (req, res) => {
  try {
    const image = req.file;

    if (!image) {
      return res.status(400).json({
        message: "No image file uploaded",
        success: false,
      });
    }
    // upload new image to cloudinary
    const options = {
      folder: categoryFolder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const result = await cloudinary.uploader.upload(image.path, options, () => {
      // remove image in uploads folder
      fs.unlink(`uploads/${image.filename}`, (err) => {
        if (err) console.error("Error deleting file:", err);
      });
    });
    // update in db if upload successfully
    if (result) {
      uploadedImage = result.secure_url;
      return res.status(200).json({
        message: "Upload successful",
        success: true,
        url: result.secure_url,
        public_id: result.public_id,
      });
    } else {
      return res.status(500).json({
        message: "Upload failed",
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const newCategory = await CategoryModel.create({
      name: req.body.name,
      parentId: req.body.parentId,
      image: uploadedImage,
    });
    uploadedImage = "";
    if (!newCategory)
      return res.status(500).json({
        message: "Category is not created",
        success: false,
      });
    return res.status(200).json({
      message: newCategory,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const getListOfCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    const categoryMap = {};
    categories.forEach((cate) => {
      categoryMap[cate._id] = { ...cate._doc, chilren: [] };
    });
    const rootCategories = [];
    categories.forEach((cate) => {
      if (cate.parentId)
        categoryMap[cate.parentId].chilren.push(categoryMap[cate._id]);
      else rootCategories.push(categoryMap[cate._id]);
    });

    return res.status(200).json({
      categories: rootCategories,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

async function deleteCategoryRecursively(id) {
  const children = await CategoryModel.find({ parentId: id });
  for (const child of children) {
    await deleteCategoryRecursively(child._id);
  }
  await removeCategoryImageOnCloudinary(id);
  await CategoryModel.findByIdAndDelete(id);
}

const deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
        success: false,
      });
    }
    await deleteCategoryRecursively(id);
    return res.status(200).json({
      message: "Deleted category and all subcategories successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};


const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category)
      return res.status(404).json({
        message: "Category is not found",
        success: false,
      });
    return res.status(200).json({
      category,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    // delete old image in cloudinary
    if (uploadedImage) await removeCategoryImageOnCloudinary(req.params.id);

    // update new category
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        parentId: req.body.parentId,
        image: uploadedImage ? uploadedImage : req.body.image,
      },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(500).json({
        message: "Updated uncessfully",
        success: false,
      });
    }

    uploadedImage = "";
    return res.status(200).json({
      message: "Updated successfully",
      updatedCategory,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

async function removeCategoryImageOnCloudinary(id) {
  const oldCategory = await CategoryModel.findById(id);
  if (oldCategory?.image) {
    const oldPublicId = extractPublicId(oldCategory.image, categoryFolder);
    try {
      await cloudinary.uploader.destroy(oldPublicId);
    } catch (error) {
      console.error(error);
    }
  }
}

export {
  uploadImage,
  createCategory,
  getListOfCategories,
  deleteCategory,
  getCategoryById,
  updateCategory,
};
