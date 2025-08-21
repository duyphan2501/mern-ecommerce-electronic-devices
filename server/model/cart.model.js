import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  items: Array, // {modelId, quantity}
});

const CartModel = mongoose.model("cart", cartSchema);

export default CartModel;
