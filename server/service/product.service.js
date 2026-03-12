import ProductModel from "../model/product.model.js";
import mongoose from "mongoose";

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
      $in: filterParams.brandIds.map((id) => new mongoose.Types.ObjectId(`${id}`)),
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
              documents: 1,
              specifications: 1,
            },
          },
        ],
        as: "modelsId",
      },
    },
    // STAGE TÍNH GIÁ ĐÃ FIX LỖI CHIA CHO 0
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
              ...(sortOption === "price_asc"
                ? { computedPrice: 1 }
                : sortOption === "price_desc"
                  ? { computedPrice: -1 }
                  : { createdAt: -1 }),
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
              images: 1,
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

export { filterProducts };
