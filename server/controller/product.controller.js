import uploadFiles from "../helper/upload.js";
import * as productService from "../service/product.service.js";

const productFolder = "products";
const documentFolder = "documents";

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ message: "No files uploaded.", success: false });
    }

    const uploadedDocuments = await uploadFiles(req.files, {
      folder: documentFolder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      resource_type: "auto",
      flags: "attachment",
    });

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

    const uploadedImages = await uploadFiles(req.files, {
      folder: productFolder,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    });

    return res.status(200).json({
      message: "Upload images successful",
      uploadedImages,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    return res.status(200).json({ products, success: true });
  } catch (error) {
    next(error);
  }
};

const getAdminProducts = async (req, res, next) => {
  try {
    const result = await productService.getAdminProducts(req.query);
    return res.status(200).json({ ...result, success: true });
  } catch (error) {
    next(error);
  }
};

const getAdminProductById = async (req, res, next) => {
  try {
    const product = await productService.getAdminProductById(req.params.id);
    return res.status(200).json({ product, success: true });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { product, models } = await productService.createProduct(req.body);
    return res.status(201).json({
      message: "Product and models created successfully",
      product,
      models,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { product, models } = await productService.updateProduct(
      req.params.id,
      req.body,
    );

    return res.status(200).json({
      message: "Product updated successfully",
      product,
      models,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const archiveProduct = async (req, res, next) => {
  try {
    const product = await productService.archiveProduct(req.params.id);
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
    const products = await productService.getNewProducts(req.query.limit);
    return res.status(200).json({
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
    const term = req.query.term || "";
    const searchTerm = term.split(/[+ ]/).filter((t) => t.trim() !== "");
    const categoryIds = [].concat(req.query.categoryIds || []);
    const brandIds = [].concat(req.query.brandIds || []);

    const result = await productService.filterProducts(
      page,
      limit,
      sortOption,
      {
        categoryIds,
        brandIds,
        minPrice: req.query.minPrice,
        maxPrice: req.query.maxPrice,
      },
      searchTerm,
    );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const product = await productService.getProductBySlug(req.params.slug);
    return res.status(200).json({
      product,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getPopularProducts = async (req, res, next) => {
  try {
    const products = await productService.getPopularProducts(req.query.limit);
    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductsByCategoryIds = async (req, res, next) => {
  try {
    const products = await productService.getProductsByCategoryIds(
      req.query.categoryIds,
    );

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

const getProductByCategoryId = async (req, res, next) => {
  try {
    const products = await productService.getProductByCategoryId(
      req.params.categoryId,
    );

    return res.status(200).json({
      products: products || [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const products = await productService.searchProducts(
      req.query.q,
      req.query.limit,
    );

    return res.status(200).json({
      products,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export {
  archiveProduct,
  createProduct,
  fetchProducts,
  getAdminProductById,
  getAdminProducts,
  getAllProducts,
  getNewProducts,
  getPopularProducts,
  getProductByCategoryId,
  getProductBySlug,
  getProductsByCategoryIds,
  searchProducts,
  updateProduct,
  uploadDocument,
  uploadImages,
};
