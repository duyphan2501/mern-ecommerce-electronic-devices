import cloudinary from "../config/cloudinary.config.js";
import CategoryModel from "../model/category.model.js";
import extractPublicId from "../helper/extractPuclicId.js";
import uploadFiles from "../helper/upload.js";

const categoryFolder = "categories";

const uploadImage = async (req, res) => {
  try {
    const images = req.file;
    if (!images) {
      return res
        .status(400)
        .json({ message: "No file uploaded.", success: false });
    }
    // upload new images to cloudinary
    const options = {
      folder: categoryFolder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const uploadedImages = await uploadFiles(images, options);

    return res.status(200).json({
      message: "Upload images successful",
      uploadedImage: uploadedImages[0],
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, parentId, image } = req.body;

    if (!name)
      return res.status(400).json({
        message: "Category name is required",
        success: false,
      });

    const isExistingName = await CategoryModel.findOne({ name });

    if (isExistingName)
      return res.status(400).json({
        message: "Category name is existing! Try another one",
        success: false,
      });

    const newCategory = await CategoryModel.create({
      name,
      parentId: parentId || null,
      image: image || null,
    });

    if (!newCategory)
      return res.status(500).json({
        message: "Category is not created",
        success: false,
      });

    return res.status(201).json({
      message: "Category is created successfully",
      newCategory,
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
      categoryMap[cate._id] = { ...cate._doc, children: [] };
    });
    const rootCategories = [];
    categories.forEach((cate) => {
      if (cate.parentId)
        categoryMap[cate.parentId].children.push(categoryMap[cate._id]);
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
    const categoryId = req.params.id;
    const updateCategory = await CategoryModel.findById(categoryId);

    if (!updateCategory)
      return res.status(404).json({
        message: "Category does not exist",
        success: false,
      });

    const { name, parentId, image } = req.body;

    if (!name)
      return res.status(400).json({
        message: "Category name is required!",
        success: false,
      });

    // update category
    if (name !== updateCategory.name) updateCategory.name = name;
    if (parentId !== updateCategory.parentId) updateCategory.parentId = parentId;

    // delete old image in cloudinary
    if (image && image !== updateCategory.image) {
      await removeCategoryImageOnCloudinary(categoryId);
      updateCategory.image = image;
    }

    await updateCategory.save();

    return res.status(200).json({
      message: "Updated successfully",
      updateCategory,
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

const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    return res.status(200).json({
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

export {
  uploadImage,
  createCategory,
  getListOfCategories,
  deleteCategory,
  getCategoryById,
  updateCategory,
  getAllCategories,
};
