import mongoose from "mongoose";
import BrandModel from "../model/brand.model.js";
import ProductModel from "../model/product.model.js";
import ModelsModel from "../model/productModel.model.js";

const validStatuses = ["draft", "active", "archived"];

const createHttpError = (statusCode, message) =>
  Object.assign(new Error(message), { statusCode });

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
  images: Array.isArray(model.images) ? model.images.filter(Boolean) : [],
  documents: (model.documents || []).map(normalizeDocument),
  productId,
});

const validateProductId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, "Invalid product id");
  }
};

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
    throw createHttpError(400, "All fields are required");
  }

  if (!validStatuses.includes(status)) {
    throw createHttpError(400, "Invalid status value");
  }
};

const getAllProducts = () => ProductModel.find().populate("modelsId");

const getAdminProducts = async ({
  page: pageQuery,
  limit: limitQuery,
  term: termQuery = "",
  status = "all",
}) => {
  const page = Math.max(Number(pageQuery) || 1, 1);
  const limit = Math.min(Math.max(Number(limitQuery) || 10, 1), 50);
  const term = termQuery.trim();
  const skip = (page - 1) * limit;
  const query = {};

  if (status !== "all") {
    if (!validStatuses.includes(status)) {
      throw createHttpError(400, "Invalid status value");
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

  return {
    products,
    totalProducts,
    totalPages: Math.ceil(totalProducts / limit),
    page,
    limit,
  };
};

const getAdminProductById = async (id) => {
  validateProductId(id);

  const product = await ProductModel.findById(id)
    .populate("brandId", "name slug")
    .populate("categoryIds", "name parentId slug")
    .populate("modelsId")
    .lean();

  if (!product) {
    throw createHttpError(404, "Product does not exist");
  }

  return product;
};

const createProduct = async (body) => {
  validateProductPayload(body);

  const parsedCategoryIds = normalizeObjectIdArray(body.categoryIds);
  if (parsedCategoryIds.length <= 0) {
    throw createHttpError(400, "Invalid categoryIds");
  }

  const session = await mongoose.startSession();
  try {
    let result;

    await session.withTransaction(async () => {
      const [newProduct] = await ProductModel.create(
        [
          {
            productName: body.productName,
            description: body.description,
            categoryIds: parsedCategoryIds,
            brandId: normalizeBrandId(body.brandId),
            shippingCost: body.shippingCost,
            pageTitle: body.pageTitle,
            metaKeywords: body.metaKeywords,
            metaDescription: body.metaDescription,
            productUrl: body.productUrl,
            status: body.status,
            hasModels: body.hasModels,
            modelsId: [],
          },
        ],
        { session },
      );

      const createdModels = await ModelsModel.insertMany(
        body.models.map((model) => normalizeModelPayload(model, newProduct._id)),
        { session },
      );

      newProduct.modelsId = createdModels.map((model) => model._id);
      await newProduct.save({ session });

      result = { product: newProduct, models: createdModels };
    });

    return result;
  } finally {
    session.endSession();
  }
};

const updateProduct = async (id, body) => {
  validateProductId(id);
  validateProductPayload(body);

  const parsedCategoryIds = normalizeObjectIdArray(body.categoryIds);
  if (parsedCategoryIds.length <= 0) {
    throw createHttpError(400, "Invalid categoryIds");
  }

  const session = await mongoose.startSession();
  try {
    let result;

    await session.withTransaction(async () => {
      const product = await ProductModel.findById(id).session(session);
      if (!product) {
        throw createHttpError(404, "Product does not exist");
      }

      const nextModelIds = [];
      const updatedModels = [];

      for (const model of body.models) {
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

      product.productName = body.productName;
      product.description = body.description;
      product.categoryIds = parsedCategoryIds;
      product.brandId = normalizeBrandId(body.brandId);
      product.shippingCost = Number(body.shippingCost || 0);
      product.pageTitle = body.pageTitle;
      product.metaKeywords = body.metaKeywords;
      product.metaDescription = body.metaDescription;
      product.productUrl = body.productUrl;
      product.status = body.status;
      product.hasModels = body.hasModels;
      product.modelsId = nextModelIds;

      await product.save({ session });
      result = { product, models: updatedModels };
    });

    return result;
  } finally {
    session.endSession();
  }
};

const archiveProduct = async (id) => {
  validateProductId(id);

  const product = await ProductModel.findByIdAndUpdate(
    id,
    { status: "archived" },
    { new: true },
  );

  if (!product) {
    throw createHttpError(404, "Product does not exist");
  }

  return product;
};

const getNewProducts = async (limitQuery) => {
  const limit = parseInt(limitQuery) || 10;

  const products = await ProductModel.find()
    .sort({ create_at: -1 })
    .limit(limit)
    .populate("brand", "name slug")
    .populate("categoryIds", "name parentId slug")
    .populate("modelsId")
    .lean();

  if (!products || products.length === 0) {
    throw createHttpError(404, "No products found");
  }

  return products;
};

const filterProducts = async (page, limit, sortOption, filterParams, terms) => {
  const skipIndex = (page - 1) * limit;
  let matchCriteria = { status: "active" };

  if (filterParams.categoryIds?.length > 0) {
    matchCriteria.categoryIds = {
      $in: filterParams.categoryIds.map(
        (id) => new mongoose.Types.ObjectId(`${id}`),
      ),
    };
  }
  if (filterParams.brandIds?.length > 0) {
    matchCriteria.brandId = {
      $in: filterParams.brandIds.map(
        (id) => new mongoose.Types.ObjectId(`${id}`),
      ),
    };
  }
  if (terms?.length > 0) {
    matchCriteria.name = { $regex: new RegExp(terms.join("|"), "i") };
  }

  let pipeline = [
    { $match: matchCriteria },
    {
      $lookup: {
        from: "categories",
        localField: "categoryIds",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1, slug: 1 } }],
        as: "categories",
      },
    },
    {
      $lookup: {
        from: "brands",
        localField: "brandId",
        foreignField: "_id",
        pipeline: [{ $project: { name: 1, slug: 1 } }],
        as: "brand",
      },
    },
    { $addFields: { brand: { $arrayElemAt: ["$brand", 0] } } },
    {
      $lookup: {
        from: "models",
        localField: "modelsId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              modelName: 1,
              discount: 1,
              tax: 1,
              stockQuantity: 1,
              soldQuantity: 1,
              salePrice: 1,
              images: 1,
              documents: 1,
              specifications: 1,
            },
          },
        ],
        as: "modelsId",
      },
    },
    {
      $addFields: {
        computedPrice: {
          $let: {
            vars: { firstModel: { $arrayElemAt: ["$modelsId", 0] } },
            in: {
              $multiply: [
                { $ifNull: ["$$firstModel.salePrice", 0] },
                {
                  $subtract: [
                    1,
                    {
                      $divide: [{ $ifNull: ["$$firstModel.discount", 0] }, 100],
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    },
    ...(filterParams.minPrice || filterParams.maxPrice
      ? [
          {
            $match: {
              computedPrice: {
                ...(filterParams.minPrice && {
                  $gte: Number(filterParams.minPrice),
                }),
                ...(filterParams.maxPrice && {
                  $lte: Number(filterParams.maxPrice),
                }),
              },
            },
          },
        ]
      : []),
    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [
          {
            $sort: {
              ...(sortOption === "price_asc" ? { computedPrice: 1 } : {}),
              ...(sortOption === "price_desc" ? { computedPrice: -1 } : {}),
              ...(sortOption === "name_asc" ? { productName: 1 } : {}),
              ...(sortOption === "name_desc" ? { productName: -1 } : {}),
              ...(![
                "price_asc",
                "price_desc",
                "name_asc",
                "name_desc",
              ].includes(sortOption)
                ? { createdAt: -1 }
                : {}),
              _id: 1,
            },
          },
          { $skip: skipIndex },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              productName: 1,
              productUrl: 1,
              hasModels: 1,
              status: 1,
              categories: 1,
              brand: 1,
              modelsId: 1,
              computedPrice: 1,
              created_at: 1,
            },
          },
        ],
      },
    },
  ];

  const [result] = await ProductModel.aggregate(pipeline).exec();
  const total = result.metadata[0]?.total || 0;

  return {
    totalPages: Math.ceil(total / limit),
    totalProducts: total,
    products: result.data,
  };
};

const getProductBySlug = async (productUrl) => {
  if (!productUrl) {
    throw createHttpError(400, "Product url is missing!");
  }

  const product = await ProductModel.findOne({
    productUrl,
    status: "active",
  })
    .populate("brandId", "name slug")
    .populate("categoryIds", "name parentId slug")
    .populate("modelsId")
    .lean();

  if (!product) {
    throw createHttpError(404, "Product does not exist!");
  }

  return product;
};

const getPopularProducts = (limitQuery) => {
  const limit = parseInt(limitQuery) || 8;

  return ProductModel.find({ status: "active" })
    .sort({
      views: -1,
      rating: -1,
      createdAt: -1,
    })
    .limit(limit)
    .populate("brandId", "name slug")
    .populate("categoryIds", "name slug")
    .populate("modelsId")
    .lean();
};

const getProductsByCategoryIds = (categoryIdsQuery) => {
  if (!categoryIdsQuery) {
    throw createHttpError(400, "Category ids are missing");
  }

  const ids = categoryIdsQuery
    .split(",")
    .map((id) => new mongoose.Types.ObjectId(`${id}`));

  return ProductModel.find({
    categoryIds: { $in: ids },
    status: "active",
  })
    .populate("brandId", "name slug")
    .populate("categoryIds", "name parentId slug")
    .populate("modelsId")
    .lean();
};

const getProductByCategoryId = (categoryId) => {
  if (!categoryId) {
    throw createHttpError(400, "Category id is missing");
  }

  return ProductModel.find({
    categoryIds: categoryId,
    status: "active",
  })
    .populate("brandId", "name slug")
    .populate("categoryIds", "name parentId slug")
    .populate("modelsId")
    .lean();
};

const searchProducts = (query, limitQuery) => {
  const searchTerm = (query || "").trim();
  const limit = Math.min(Number(limitQuery) || 10, 50);

  if (!searchTerm) {
    return [];
  }

  const safeTerm = escapeRegex(searchTerm);

  return ProductModel.find({
    productName: { $regex: safeTerm, $options: "i" },
  })
    .select("_id productName productUrl")
    .populate("modelsId", "salePrice discount images")
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();
};

export {
  archiveProduct,
  createProduct,
  filterProducts,
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
};
