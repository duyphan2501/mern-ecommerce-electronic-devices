import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  modelId: mongoose.Types.ObjectId,
  totalStock: Number,
  soldStock: { type: Number, default: 0 },
  returnedStock: { type: Number, default: 0 }
});

const InventoryModel = mongoose.model("inventories", InventorySchema);

export default InventoryModel;