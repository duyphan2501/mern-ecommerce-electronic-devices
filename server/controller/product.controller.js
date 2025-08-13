import ProductModel from "../model/product.model.js";
import ModelsModel from "../model/productModel.model.js";
import uploadFiles from "../helper/upload.js";
import mongoose from "mongoose";

const productFolder = "products";
const documentFolder = "documents";

const uploadDocument = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "No files uploaded.", success: false });
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
    const uploadedDocuments = await uploadFiles(files, options);

    return res.status(200).json({
      message: "Upload documents successful",
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
      return res
        .status(400)
        .json({ message: "No files uploaded.", success: false });
    }
    const images = req.files;
    // upload new images to cloudinary
    const options = {
      folder: productFolder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const uploadedImages = await uploadFiles(images, options);

    return res.status(200).json({
      message: "Upload images successful",
      uploadedImages,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();

    // Lấy models ứng với mỗi sản phẩm
    const models = await Promise.all(
      products.map((product) => ModelsModel.findOne({ productId: product._id }))
    );

    res.status(200).json({ products, models, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      productName,
      description,
      models,
      images,
      categoryId,
      brandId,
      shippingCost,
      pageTitle,
      metaKeywords,
      metaDescription,
      productUrl,
      status,
    } = req.body;

    // Validate required fields
    if (
      !productName ||
      !brandId ||
      !description ||
      !categoryId ||
      !models ||
      models.length < 1 ||
      shippingCost === undefined ||
      !pageTitle ||
      !metaKeywords ||
      !metaDescription ||
      !productUrl ||
      !status
    ) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    // Parse ObjectId
    const parsedCategoryId = mongoose.Types.ObjectId.isValid(categoryId)
      ? new mongoose.Types.ObjectId(categoryId)
      : null;
    const parsedBrandId = mongoose.Types.ObjectId.isValid(brandId)
      ? new mongoose.Types.ObjectId(brandId)
      : null;

    if (!parsedCategoryId || !parsedBrandId) {
      return res.status(400).json({ message: "Invalid categoryId or brandId", success: false });
    }

    // Validate status
    const validStatuses = ["draft", "active", "archived"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value", success: false });
    }

    // Create product first (empty modelsId)
    const [newProduct] = await ProductModel.create(
      [{
        productName,
        description,
        categoryId: parsedCategoryId,
        brandId: parsedBrandId,
        shippingCost,
        pageTitle,
        metaKeywords,
        metaDescription,
        productUrl,
        images,
        status,
        modelsId: [],
      }],
      { session }
    );

    // Create models linked to productId
    const createdModels = await ModelsModel.insertMany(
      models.map(model => ({
        ...model,
        productId: newProduct._id,
      })),
      { session }
    );

    // Update product.modelsId
    newProduct.modelsId = createdModels.map(m => m._id);
    await newProduct.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Product and models created successfully",
      product: newProduct,
      models: createdModels,
      success: true,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Create product error:", error);
    res.status(500).json({ message: error.message || error, success: false });
  }
};


// const deleteProduct = async (req, res) => {
//   try {
//     const productId = req.params.id

//     const deletedModels = ModelsModel.findAndDeleteById()

//   } catch (error) {
//     res.status(500).json({ message: error.message || error, success: false });
    
//   }
// }

export { getAllProducts, uploadImages, createProduct, uploadDocument };
