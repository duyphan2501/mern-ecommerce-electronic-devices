import ProductModel from "../model/product.model.js";
import ModelsModel from "../model/productModel.model.js";
import BrandModel from "../model/brand.model.js";
import uploadFiles from "../helper/upload.js";
import mongoose from "mongoose";
import { filterProducts } from "../service/product.service.js";

const productFolder = "products";
const documentFolder = "documents";
const validStatuses = ["draft", "active", "archived"];

const normalizeObjectIdArray = (ids = []) =>
  ids
    .map((id) =>
      mongoose.Types.ObjectId.isValid(id)
        ? new mongoose.Types.ObjectId(`${id}`)
        : null,
    )
    .filter(Boolean);

const normalizeBrandId = (brandId) =>
  mongoose.Types.ObjectId.isValid(brandId)
    ? new mongoose.Types.ObjectId(`${brandId}`)
    : null;

const normalizeDocument = (document) => {
  if (typeof document === "string") {
    return { url: document, name: document.split("/").pop(), public_id: "" };
  }

  return {
    url: document?.url || "",
    name: document?.name || "",
    public_id: document?.public_id || "",
  };
};

const normalizeModelPayload = (model, productId) => ({
  modelName: model.modelName || "Default",
  discount: Number(model.discount || 0),
  tax: Number(model.tax || 0),
  stockQuantity: Number(model.stockQuantity || 0),
  soldQuantity: Number(model.soldQuantity || 0),
  salePrice: Number(model.salePrice || 0),
  expectedQuantity: Number(model.expectedQuantity || 0),
  minimumQuantity: Number(model.minimumQuantity || 0),
  costPrice: Number(model.costPrice || 0),
  specifications: model.specifications || "<p></p>",
  documents: (model.documents || []).map(normalizeDocument),
  productId,
});

const validateProductPayload = ({
  productName,
  description,
  models,
  categoryIds,
  shippingCost,
  pageTitle,
  metaKeywords,
  metaDescription,
  productUrl,
  status,
}) => {
  if (
    !productName ||
    !description ||
    !categoryIds ||
    !Array.isArray(categoryIds) ||
    categoryIds.length < 1 ||
    !models ||
    !Array.isArray(models) ||
    models.length < 1 ||
    shippingCost === undefined ||
    !pageTitle ||
    !metaKeywords ||
    !metaDescription ||
    !productUrl ||
    !status
  ) {
    return "All fields are required";
  }

  if (!validStatuses.includes(status)) {
    return "Invalid status value";
  }

  return null;
};

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

const getAdminProducts = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
    const term = (req.query.term || "").trim();
    const status = req.query.status || "all";
    const skip = (page - 1) * limit;
    const query = {};

    if (status !== "all") {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid status value",
          success: false,
        });
      }
      query.status = status;
    }

    if (term) {
      const safeTerm = escapeRegex(term);
      const [matchingModels, matchingBrands] = await Promise.all([
        ModelsModel.find({ modelName: { $regex: safeTerm, $options: "i" } })
          .select("_id")
          .lean(),
        BrandModel.find({ name: { $regex: safeTerm, $options: "i" } })
          .select("_id")
          .lean(),
      ]);

      query.$or = [
        { productName: { $regex: safeTerm, $options: "i" } },
        { productUrl: { $regex: safeTerm, $options: "i" } },
        { modelsId: { $in: matchingModels.map((model) => model._id) } },
        { brandId: { $in: matchingBrands.map((brand) => brand._id) } },
      ];
    }

    const [products, totalProducts] = await Promise.all([
      ProductModel.find(query)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("brandId", "name slug")
        .populate("categoryIds", "name parentId slug")
        .populate("modelsId")
        .lean(),
      ProductModel.countDocuments(query),
    ]);

    return res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      page,
      limit,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAdminProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product id",
        success: false,
      });
    }

    const product = await ProductModel.findById(id)
      .populate("brandId", "name slug")
      .populate("categoryIds", "name parentId slug")
      .populate("modelsId")
      .lean();

    if (!product) {
      return res.status(404).json({
        message: "Product does not exist",
        success: false,
      });
    }

    return res.status(200).json({
      product,
      success: true,
    });
  } catch (error) {
    next(error);
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

    const validationError = validateProductPayload(req.body);
    if (validationError) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: validationError, success: false });
    }

    // Parse ObjectId
    const parsedCategoryIds = normalizeObjectIdArray(categoryIds);
    const parsedBrandId = normalizeBrandId(brandId);

    if (parsedCategoryIds.length <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ message: "Invalid categoryIds", success: false });
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
      models.map((model) => normalizeModelPayload(model, newProduct._id)),
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

const updateProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Invalid product id",
        success: false,
      });
    }

    const validationError = validateProductPayload(req.body);
    if (validationError) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: validationError,
        success: false,
      });
    }

    const product = await ProductModel.findById(id).session(session);
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: "Product does not exist",
        success: false,
      });
    }

    const parsedCategoryIds = normalizeObjectIdArray(categoryIds);
    if (parsedCategoryIds.length <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Invalid categoryIds",
        success: false,
      });
    }

    const nextModelIds = [];
    const updatedModels = [];

    for (const model of models) {
      const modelPayload = normalizeModelPayload(model, product._id);

      if (model._id && mongoose.Types.ObjectId.isValid(model._id)) {
        const updatedModel = await ModelsModel.findOneAndUpdate(
          { _id: model._id, productId: product._id },
          modelPayload,
          { new: true, session },
        );

        if (updatedModel) {
          nextModelIds.push(updatedModel._id);
          updatedModels.push(updatedModel);
          continue;
        }
      }

      const [createdModel] = await ModelsModel.create([modelPayload], {
        session,
      });
      nextModelIds.push(createdModel._id);
      updatedModels.push(createdModel);
    }

    product.productName = productName;
    product.description = description;
    product.categoryIds = parsedCategoryIds;
    product.brandId = normalizeBrandId(brandId);
    product.shippingCost = Number(shippingCost || 0);
    product.pageTitle = pageTitle;
    product.metaKeywords = metaKeywords;
    product.metaDescription = metaDescription;
    product.productUrl = productUrl;
    product.images = images || [];
    product.status = status;
    product.hasModels = hasModels;
    product.modelsId = nextModelIds;

    await product.save({ session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
      models: updatedModels,
      success: true,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Update product error:", error);
    return res
      .status(500)
      .json({ message: error.message || error, success: false });
  }
};

const archiveProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid product id",
        success: false,
      });
    }

    const product = await ProductModel.findByIdAndUpdate(
      id,
      { status: "archived" },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({
        message: "Product does not exist",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Product archived successfully",
      product,
      success: true,
    });
  } catch (error) {
    next(error);
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
  getAdminProducts,
  getAdminProductById,
  uploadImages,
  createProduct,
  updateProduct,
  archiveProduct,
  uploadDocument,
  getProductBySlug,
  getProductByCategoryId,
  getNewProducts,
  fetchProducts,
  searchProducts,
  getProductsByCategoryIds,
  getPopularProducts,
};
