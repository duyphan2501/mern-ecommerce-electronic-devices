import ProductModel from "../model/product.model.js";
import ModelsModel from "../model/productModel.model.js";
import uploadFiles from "../helper/upload.js";
import mongoose from "mongoose";
import { filterProducts } from "../service/product.service.js";

const productFolder = "products";
const documentFolder = "documents";

const uploadDocument = async (req, res, next) => {
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
      resource_type: "auto",
      flags: "attachment",
    };

    // upload new documents to cloudinary
    const uploadedDocuments = await uploadFiles(files, options);

    return res.status(200).json({
      message: "Upload documents successful",
      uploadedDocuments,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const uploadImages = async (req, res, next) => {
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
    next(error);
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
      hasModels,
    } = req.body;

    // Validate required fields
    if (
      !productName ||
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

    if (!parsedCategoryIds || parsedCategoryIds.length <= 0) {
      return res
        .status(400)
        .json({ message: "Invalid categoryIds", success: false });
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
          hasModels,
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
      .sort({ create_at: -1 })
      .limit(limit)
      .populate("brand", "name slug") // Populate vào field ảo "brand"
      .populate("categoryIds", "name parentId slug")
      .populate("modelsId")
      .lean();

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

const fetchProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOption = req.query.sort || "createdAt_desc";

    // Xử lý searchTerm: Lọc bỏ các khoảng trắng hoặc chuỗi rỗng
    const term = req.query.term || "";
    const searchTerm = term.split(/[+ ]/).filter((t) => t.trim() !== "");

    // Ép kiểu Array cho IDs (Dùng .flat() hoặc concat để code gọn hơn)
    const categoryIds = [].concat(req.query.categoryIds || []);
    const brandIds = [].concat(req.query.brandIds || []);

    const filterParams = {
      categoryIds,
      brandIds,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
    };

    // Gọi hàm filter đã tối ưu ở trên
    const result = await filterProducts(
      page,
      limit,
      sortOption,
      filterParams,
      searchTerm,
    );

    return res.status(200).json({
      success: true,
      ...result, // Trả về totalPages, totalProducts, products
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

    const foundProduct = await ProductModel.findOne({
      productUrl,
      status: "active",
    })
      .populate("brandId", "name slug")
      .populate("categoryIds", "name parentId slug")
      .populate("modelsId")
      .lean();

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

const getPopularProducts = async (req, res, next) => {
  try {
    // Lấy top 8 sản phẩm phổ biến nhất
    const limit = parseInt(req.query.limit) || 8;

    const popularProducts = await ProductModel.find({ status: "active" })
      .sort({ 
        "views": -1,       // Ưu tiên lượt xem cao nhất (nếu bạn có field này)
        "rating": -1,      // Hoặc đánh giá cao nhất
        "createdAt": -1    // Sau đó là mới nhất
      })
      .limit(limit)
      .populate("brandId", "name slug")
      .populate("categoryIds", "name slug")
      .populate("modelsId")
      .lean();

    return res.status(200).json({
      success: true,
      products: popularProducts,
    });
  } catch (error) {
    next(error);
  }
};


const getProductsByCategoryIds = async (req, res, next) => {
  try {
    let categoryIds = req.query.categoryIds;

    if (!categoryIds) {
      return res.status(400).json({
        message: "Category ids are missing",
        success: false,
      });
    }

    categoryIds = categoryIds.split(",");
    const ids = categoryIds.map((id) => new mongoose.Types.ObjectId(`${id}`));

    const foundProducts = await ProductModel.find({
      categoryIds: { $in: ids },
      status: "active",
    })
      .populate("brandId", "name slug")
      .populate("categoryIds", "name parentId slug")
      .populate("modelsId")
      .lean();
    return res.status(200).json({
      success: true,
      products: foundProducts,
    });
  } catch (error) {
    next(error);
  }
};

const getProductByCategoryId = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    if (!categoryId)
      return res.status(400).json({
        message: "Category id is missing",
        success: false,
      });

    const foundProducts = await ProductModel.find({
      categoryIds: categoryId,
      status: "active",
    })
      .populate("brandId", "name slug")
      .populate("categoryIds", "name parentId slug")
      .populate("modelsId")
      .lean();

    return res.status(200).json({
      products: foundProducts || [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const searchProducts = async (req, res) => {
  try {
    const searchTerm = (req.query.q || "").trim();
    const limit = Math.min(Number(req.query.limit) || 10, 50);

    if (!searchTerm) {
      return res.status(200).json({
        products: [],
        success: true,
      });
    }

    const safeTerm = escapeRegex(searchTerm);

    const products = await ProductModel.find({
      productName: { $regex: safeTerm, $options: "i" },
    })
      .select("_id productName productUrl images")
      .populate("modelsId", "salePrice discount")
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      products,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
    });
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
  fetchProducts,
  searchProducts,
  getProductsByCategoryIds,
  getPopularProducts
};
