import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCart,
} from "../controller/cart.controller.js";

const cartRouter = express.Router();

cartRouter.post("/add", addToCart);
cartRouter.get("/get/:userId", getCart);
cartRouter.put("/update", updateCart);
cartRouter.delete("/item/delete", removeFromCart);

export default cartRouter;
