import ProductModel from "../model/product.model.js";
import ModelsModel from "../model/productModel.model.js";
import BrandModel from "../model/brand.model.js";
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
    const products = await ProductModel.find().populate("modelsId");
    res.status(200).json({ products, success: true });
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
      categoryIds,
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
      !categoryIds ||
      !models ||
      models.length < 1 ||
      shippingCost === undefined ||
      !pageTitle ||
      !metaKeywords ||
      !metaDescription ||
      !productUrl ||
      !status
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Parse ObjectId
    const parsedCategoryIds = categoryIds.map((cateId) =>
      mongoose.Types.ObjectId.isValid(cateId)
        ? new mongoose.Types.ObjectId(`${cateId}`)
        : null,
    );
    const parsedBrandId = mongoose.Types.ObjectId.isValid(brandId)
      ? new mongoose.Types.ObjectId(`${brandId}`)
      : null;

    if (!parsedCategoryIds || parsedCategoryIds.length <= 0 || !parsedBrandId) {
      return res
        .status(400)
        .json({ message: "Invalid categoryIds or brandId", success: false });
    }

    // Validate status
    const validStatuses = ["draft", "active", "archived"];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ message: "Invalid status value", success: false });
    }

    // Create product first (empty modelsId)
    const [newProduct] = await ProductModel.create(
      [
        {
          productName,
          description,
          categoryIds: parsedCategoryIds,
          brandId: parsedBrandId,
          shippingCost,
          pageTitle,
          metaKeywords,
          metaDescription,
          productUrl,
          images,
          status,
          modelsId: [],
        },
      ],
      { session },
    );

    // Create models linked to productId
    const createdModels = await ModelsModel.insertMany(
      models.map((model) => ({
        ...model,
        productId: newProduct._id,
      })),
      { session },
    );

    // Update product.modelsId
    newProduct.modelsId = createdModels.map((m) => m._id);
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

const getNewProducts = async (req, res, next) => {
  try {
    // 1. Lấy số lượng giới hạn từ query (ví dụ: ?limit=10), mặc định là 10
    const limit = parseInt(req.query.limit) || 10;

    const products = await ProductModel.find()
      .sort({ create_at: -1 }) // Sắp xếp mới nhất lên đầu
      .limit(limit)
      .populate("brandId", "name") // Lấy tên Brand
      .populate("categoryIds", "name parentId") // Lấy thông tin danh mục
      .populate({
        path: "modelsId",
        select: "salePrice costPrice discount modelName specifications", // Chỉ lấy các field cần thiết của Model
      });

    // 2. Kiểm tra nếu không có sản phẩm
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found",
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};


const getProductBySlug = async (req, res) => {
  try {
    const productUrl = req.params.slug;

    if (!productUrl)
      return res.status(400).json({
        message: "Product url is missing!",
        success: false,
      });

    const foundProduct = await ProductModel.findOne({ productUrl }).populate(
      "modelsId",
    );

    if (!foundProduct)
      return res.status(404).json({
        message: "Product does not exist!",
        success: false,
      });

    return res.status(200).json({
      product: foundProduct,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || error, success: false });
  }
};

const getProductByCategoryId = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId)
      return res.status(400).json({
        message: "Category id is missing",
        success: false,
      });

    const foundProducts = await ProductModel.find({ categoryId }).populate(
      "modelsId",
    );

    if (!foundProducts)
      return res.status(404).json({
        message: "There is no any products with this category",
        success: false,
      });

    return res.status(200).json({
      products: foundProducts,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || error, success: false });
  }
};

export {
  getAllProducts,
  uploadImages,
  createProduct,
  uploadDocument,
  getProductBySlug,
  getProductByCategoryId,
  getNewProducts,
};
