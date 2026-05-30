import {
  createGoodsReceipt,
  createStockExport,
  getInventoryItems,
  getInventoryMovements,
  getInventorySummary,
} from "../service/inventory.service.js";

const fetchInventorySummary = async (req, res, next) => {
  try {
    const summary = await getInventorySummary();
    return res.status(200).json({ success: true, summary });
  } catch (error) {
    next(error);
  }
};

const fetchInventoryItems = async (req, res, next) => {
  try {
    const items = await getInventoryItems();
    return res.status(200).json({ success: true, items });
  } catch (error) {
    next(error);
  }
};

const fetchInventoryMovements = async (req, res, next) => {
  try {
    const movements = await getInventoryMovements(
      req.query.modelId,
      req.query.limit,
    );
    return res.status(200).json({ success: true, movements });
  } catch (error) {
    next(error);
  }
};

const createGoodsReceiptController = async (req, res, next) => {
  try {
    const goodsReceipt = await createGoodsReceipt({
      items: req.body.items,
      note: req.body.note,
      createdBy: req.user?.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Goods receipt created successfully",
      goodsReceipt,
    });
  } catch (error) {
    next(error);
  }
};

const createStockExportController = async (req, res, next) => {
  try {
    const stockExport = await createStockExport({
      items: req.body.items,
      note: req.body.note,
      createdBy: req.user?.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Stock export created successfully",
      stockExport,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createGoodsReceiptController,
  createStockExportController,
  fetchInventoryItems,
  fetchInventoryMovements,
  fetchInventorySummary,
};
