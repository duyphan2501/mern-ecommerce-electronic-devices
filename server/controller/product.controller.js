import ProductModel from "../model/product.model.js";
import ModelsModel from "../model/productModel.model.js";
import uploadFiles from "../helper/upload.js";

let uploadedImages = [];
const productFolder = "products";
let uploadedDocuments = [];
const documentFolder = "documents";

const uploadDocument = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }

    const files = req.files;

    const options = {
      folder: documentFolder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      resource_type: "raw",
    };

    // upload new documents to cloudinary
    uploadedDocuments.length = 0; // Clear previous documents
    uploadedDocuments = await uploadFiles(files, options);

    return res.status(200).json({
      message: "Upload successful",
      uploadedDocuments,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded." });
    }
    const images = req.files;
    // upload new images to cloudinary
    const options = {
      folder: productFolder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    uploadedImages.length = 0; // Clear previous images
    uploadedImages = await uploadFiles(images, options);

    return res.status(200).json({
      message: "Upload successful",
      uploadedImages,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate("models");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, brandId, description, categoryId, models } = req.body;

    if (!name || !brandId || !description || !categoryId || !models) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const newProduct = await ProductModel.create({
      name,
      brandId,
      description,
      categoryId,
      images: uploadedImages,
    });

    if (!newProduct) {
      return res.status(500).json({ message: "Product creation failed" });
    }
    uploadedImages = []; // Clear uploaded images after creating product

    const createdModels = await ModelsModel.insertMany(
      models.map((model) => {
        return {
          ...model,
          documents: uploadedDocuments,
          productId: newProduct._id,
        };
      })
    );

    return res.status(201).json({
      message: "Product and models created successfully",
      product: newProduct,
      models: createdModels,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || error, success: false });
  }
};

export { getAllProducts, uploadImages, createProduct, uploadDocument };
