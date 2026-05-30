import express from "express";
import {
  createGoodsReceiptController,
  createStockExportController,
  fetchInventoryItems,
  fetchInventoryMovements,
  fetchInventorySummary,
} from "../controller/inventory.controller.js";
import checkAuth from "../middleware/auth.middleware.js";

const inventoryRouter = express.Router();

inventoryRouter.get("/summary", checkAuth, fetchInventorySummary);
inventoryRouter.get("/items", checkAuth, fetchInventoryItems);
inventoryRouter.get("/movements", checkAuth, fetchInventoryMovements);
inventoryRouter.post(
  "/goods-receipts",
  checkAuth,
  createGoodsReceiptController,
);
inventoryRouter.post("/stock-exports", checkAuth, createStockExportController);

export default inventoryRouter;
