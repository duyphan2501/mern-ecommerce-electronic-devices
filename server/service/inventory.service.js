import mongoose from "mongoose";
import redisClient from "../config/init.redis.js";
import GoodsReceiptModel from "../model/goodsReceipt.model.js";
import InventoryMovementModel from "../model/inventoryMovement.model.js";
import ModelsModel from "../model/productModel.model.js";
import StockExportModel from "../model/stockExport.model.js";

const buildInventoryItem = (model) => {
  const product = model.productId || {};
  const brand = product.brandId || {};
  const stockQuantity = Number(model.stockQuantity || 0);
  const minimumQuantity = Number(model.minimumQuantity || 0);
  const expectedQuantity = Number(model.expectedQuantity || 0);
  const costPrice = Number(model.costPrice || 0);
  const salePrice = Number(model.salePrice || 0);

  return {
    _id: model._id,
    modelId: model._id,
    modelName: model.modelName || "Default",
    productId: product._id,
    productName: product.productName || "",
    productUrl: product.productUrl || "",
    image: model.images?.[0] || "",
    brand: brand?.name || "",
    stockQuantity,
    minimumQuantity,
    expectedQuantity,
    costPrice,
    salePrice,
    soldQuantity: Number(model.soldQuantity || 0),
    stockValue: stockQuantity * costPrice,
    status:
      stockQuantity <= 0
        ? "out_of_stock"
        : stockQuantity < minimumQuantity
          ? "low_stock"
          : "in_stock",
  };
};

const generateReceiptCode = async () => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );
  const countToday = await GoodsReceiptModel.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  return `GR${year}${month}${day}${String(countToday + 1).padStart(4, "0")}`;
};

const generateExportCode = async () => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
  );
  const countToday = await StockExportModel.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  return `SE${year}${month}${day}${String(countToday + 1).padStart(4, "0")}`;
};

const getInventoryItems = async () => {
  const models = await ModelsModel.find({})
    .populate({
      path: "productId",
      select: "productName productUrl brandId",
      populate: { path: "brandId", select: "name slug" },
    })
    .sort({ updatedAt: -1 })
    .lean();

  return models.map(buildInventoryItem);
};

const getInventorySummary = async () => {
  const [items, profitAgg] = await Promise.all([
    getInventoryItems(),
    InventoryMovementModel.aggregate([
      { $match: { type: { $in: ["order_export", "manual_export"] } } },
      {
        $group: {
          _id: null,
          totalProfit: { $sum: "$profit" },
          totalRevenue: { $sum: "$totalSale" },
          totalExportCost: { $sum: "$totalCost" },
        },
      },
    ]),
  ]);

  return {
    totalStockValue: items.reduce((sum, item) => sum + item.stockValue, 0),
    lowStockCount: items.filter((item) => item.status === "low_stock").length,
    outOfStockCount: items.filter((item) => item.status === "out_of_stock")
      .length,
    estimatedProfit: profitAgg[0]?.totalProfit || 0,
    totalRevenue: profitAgg[0]?.totalRevenue || 0,
    totalExportCost: profitAgg[0]?.totalExportCost || 0,
    totalModels: items.length,
  };
};

const getInventoryMovements = async (modelId, limit = 10) => {
  const query = {};
  if (modelId) {
    if (!mongoose.Types.ObjectId.isValid(modelId)) {
      throw new Error("Invalid modelId");
    }
    query.modelId = modelId;
  }

  return InventoryMovementModel.find(query)
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 10, 50))
    .populate("modelId", "modelName")
    .populate("productId", "productName")
    .lean();
};

const createGoodsReceipt = async ({ items, note, createdBy }) => {
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error("Receipt items are required");
    err.statusCode = 400;
    throw err;
  }

  const receiptItems = [];
  const seenModelIds = new Set();

  for (const item of items) {
    const quantity = Number(item.quantity);
    const unitCost = Number(item.unitCost);

    if (!mongoose.Types.ObjectId.isValid(item.modelId)) {
      const err = new Error("Invalid modelId");
      err.statusCode = 400;
      throw err;
    }
    if (seenModelIds.has(item.modelId)) {
      const err = new Error(
        "Each product model can appear only once per receipt",
      );
      err.statusCode = 400;
      throw err;
    }
    seenModelIds.add(item.modelId);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      const err = new Error("Quantity must be a whole number greater than 0");
      err.statusCode = 400;
      throw err;
    }
    if (!Number.isFinite(unitCost) || unitCost < 0) {
      const err = new Error("Unit cost must be 0 or greater");
      err.statusCode = 400;
      throw err;
    }

    const model = await ModelsModel.findById(item.modelId).select(
      "productId stockQuantity costPrice",
    );

    if (!model) {
      const err = new Error("Model not found");
      err.statusCode = 404;
      throw err;
    }

    receiptItems.push({
      model,
      quantity,
      unitCost,
      note: item.note || "",
    });
  }

  const receiptCode = await generateReceiptCode();
  const goodsReceipt = await GoodsReceiptModel.create({
    receiptCode,
    items: receiptItems.map(
      ({ model, quantity, unitCost, note: itemNote }) => ({
        modelId: model._id,
        productId: model.productId,
        quantity,
        unitCost,
        totalCost: quantity * unitCost,
        note: itemNote,
      }),
    ),
    totalQuantity: receiptItems.reduce((sum, item) => sum + item.quantity, 0),
    totalCost: receiptItems.reduce(
      (sum, item) => sum + item.quantity * item.unitCost,
      0,
    ),
    createdBy,
    note,
  });

  const movements = [];

  for (const item of receiptItems) {
    const oldStock = Number(item.model.stockQuantity || 0);
    const oldCost = Number(item.model.costPrice || 0);
    const newStock = oldStock + item.quantity;
    const weightedCost =
      newStock > 0
        ? Math.round(
            (oldStock * oldCost + item.quantity * item.unitCost) / newStock,
          )
        : item.unitCost;

    await ModelsModel.findByIdAndUpdate(item.model._id, {
      $inc: { stockQuantity: item.quantity },
      $set: { costPrice: weightedCost },
    });
    await redisClient.hIncrBy(
      `stock:${item.model._id.toString()}`,
      "available",
      item.quantity,
    );

    movements.push({
      type: "import",
      modelId: item.model._id,
      productId: item.model.productId,
      quantity: item.quantity,
      unitCost: item.unitCost,
      totalCost: item.quantity * item.unitCost,
      referenceType: "goods_receipt",
      referenceId: goodsReceipt._id,
      createdBy,
      note: item.note || note || "",
    });
  }

  await InventoryMovementModel.insertMany(movements);

  return goodsReceipt;
};

const createStockExport = async ({ items, note, createdBy }) => {
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error("Export items are required");
    err.statusCode = 400;
    throw err;
  }

  const exportItems = [];
  const seenModelIds = new Set();

  for (const item of items) {
    const quantity = Number(item.quantity);
    const unitSalePrice = Number(item.unitSalePrice);

    if (!mongoose.Types.ObjectId.isValid(item.modelId)) {
      const err = new Error("Invalid modelId");
      err.statusCode = 400;
      throw err;
    }
    if (seenModelIds.has(item.modelId)) {
      const err = new Error(
        "Each product model can appear only once per export",
      );
      err.statusCode = 400;
      throw err;
    }
    seenModelIds.add(item.modelId);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      const err = new Error("Quantity must be a whole number greater than 0");
      err.statusCode = 400;
      throw err;
    }
    if (!Number.isFinite(unitSalePrice) || unitSalePrice < 0) {
      const err = new Error("Unit sale price must be 0 or greater");
      err.statusCode = 400;
      throw err;
    }

    const model = await ModelsModel.findById(item.modelId).select(
      "productId stockQuantity costPrice salePrice",
    );

    if (!model) {
      const err = new Error("Model not found");
      err.statusCode = 404;
      throw err;
    }
    if (Number(model.stockQuantity || 0) < quantity) {
      const err = new Error("Export quantity cannot exceed current stock");
      err.statusCode = 400;
      throw err;
    }

    const stockInfo = await redisClient.hGetAll(
      `stock:${model._id.toString()}`,
    );
    const availableStock = Number(stockInfo.available || 0);
    if (availableStock < quantity) {
      const err = new Error(
        `Only ${availableStock} item(s) are available because some stock is reserved`,
      );
      err.statusCode = 400;
      throw err;
    }

    exportItems.push({
      model,
      quantity,
      unitSalePrice,
      note: item.note || "",
    });
  }

  const exportCode = await generateExportCode();
  const stockExport = await StockExportModel.create({
    exportCode,
    items: exportItems.map(
      ({ model, quantity, unitSalePrice, note: itemNote }) => {
        const unitCost = Number(model.costPrice || 0);
        const totalCost = unitCost * quantity;
        const totalSale = unitSalePrice * quantity;

        return {
          modelId: model._id,
          productId: model.productId,
          quantity,
          unitCost,
          unitSalePrice,
          totalCost,
          totalSale,
          profit: totalSale - totalCost,
          note: itemNote,
        };
      },
    ),
    totalQuantity: exportItems.reduce((sum, item) => sum + item.quantity, 0),
    totalCost: exportItems.reduce(
      (sum, item) => sum + Number(item.model.costPrice || 0) * item.quantity,
      0,
    ),
    totalSale: exportItems.reduce(
      (sum, item) => sum + item.unitSalePrice * item.quantity,
      0,
    ),
    profit: exportItems.reduce(
      (sum, item) =>
        sum +
        (item.unitSalePrice - Number(item.model.costPrice || 0)) *
          item.quantity,
      0,
    ),
    createdBy,
    note,
  });

  const movements = [];

  for (const item of exportItems) {
    const unitCost = Number(item.model.costPrice || 0);
    const totalCost = unitCost * item.quantity;
    const totalSale = item.unitSalePrice * item.quantity;

    await ModelsModel.findByIdAndUpdate(item.model._id, {
      $inc: {
        stockQuantity: -item.quantity,
        soldQuantity: item.quantity,
      },
    });
    await redisClient.hIncrBy(
      `stock:${item.model._id.toString()}`,
      "available",
      -item.quantity,
    );

    movements.push({
      type: "manual_export",
      modelId: item.model._id,
      productId: item.model.productId,
      quantity: item.quantity,
      unitCost,
      unitSalePrice: item.unitSalePrice,
      totalCost,
      totalSale,
      profit: totalSale - totalCost,
      referenceType: "stock_export",
      referenceId: stockExport._id,
      createdBy,
      note: item.note || note || "",
    });
  }

  await InventoryMovementModel.insertMany(movements);

  return stockExport;
};

const createOrderExportMovements = async (order, session = null) => {
  if (!order?.items?.length) return [];

  const modelIds = order.items.map((item) => item.modelId);

  const models = await ModelsModel.find({ _id: { $in: modelIds } })
    .select("_id productId costPrice")
    .session(session)
    .lean();

  const modelMap = new Map(
    models.map((model) => [model._id.toString(), model]),
  );

  const movements = order.items
    .map((item) => {
      if (!item.modelId) return null;

      const model = modelMap.get(item.modelId.toString());
      if (!model) return null;

      const quantity = Number(item.quantity || 0);
      const unitSalePrice = Number(item.price || 0);
      const unitCost = Number(model.costPrice || 0);

      return {
        type: "order_export",
        modelId: model._id,
        productId: model.productId,
        quantity,
        unitCost,
        unitSalePrice,
        totalCost: unitCost * quantity,
        totalSale: unitSalePrice * quantity,
        profit: (unitSalePrice - unitCost) * quantity,
        referenceType: "order",
        referenceId: order._id,
        createdBy: order.userId,
        note: order.orderId,
      };
    })
    .filter(Boolean);

  if (!movements.length) return [];

  return InventoryMovementModel.insertMany(movements, { session });
};

export {
  createGoodsReceipt,
  createOrderExportMovements,
  createStockExport,
  getInventoryItems,
  getInventoryMovements,
  getInventorySummary,
};
