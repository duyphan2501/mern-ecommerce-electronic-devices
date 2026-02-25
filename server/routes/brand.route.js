import express from "express";  
import { getAllBrands } from "../controller/brand.controller.js";
const brandRouter = express.Router()

brandRouter.get("/all" , getAllBrands)

export default brandRouter;