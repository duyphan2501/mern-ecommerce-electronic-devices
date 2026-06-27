import express from "express";
import { recommendProducts } from "../controller/ai.controller.js";

const aiRouter = express.Router();

aiRouter.post("/recommendations", recommendProducts);

export default aiRouter;
