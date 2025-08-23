import express from "express";
import checkAuth from "../middleware/auth.middleware.js";
import {createAddress, deleteAddress, getAllAddresses, setAddressAsDefault, updateAddress} from "../controller/address.controller.js";

const addressRouter = express.Router();

addressRouter.post("/create", checkAuth, createAddress);
addressRouter.get("/all", checkAuth, getAllAddresses);
addressRouter.delete("/delete/:id", checkAuth, deleteAddress);
addressRouter.put("/update", checkAuth, updateAddress);
addressRouter.put("/set-default", checkAuth, setAddressAsDefault);

export default addressRouter;