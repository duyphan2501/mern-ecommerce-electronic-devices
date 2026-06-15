import express from "express";
import {
  createSlide,
  deleteSlide,
  duplicateSlide,
  getAdminSlideById,
  getAdminSlides,
  getPublicSlides,
  updateSlide,
  uploadSlideImage,
} from "../controller/slide.controller.js";
import checkAdmin from "../middleware/admin.middleware.js";
import checkAuth from "../middleware/auth.middleware.js";
import { uploadImg } from "../middleware/cloudinary.middleware.js";

const slideRouter = express.Router();

slideRouter.get("/public", getPublicSlides);
slideRouter.get("/admin", checkAuth, checkAdmin, getAdminSlides);
slideRouter.get("/admin/:id", checkAuth, checkAdmin, getAdminSlideById);
slideRouter.post(
  "/admin/upload-image",
  checkAuth,
  checkAdmin,
  uploadImg.single("slideImage"),
  uploadSlideImage,
);
slideRouter.post("/admin", checkAuth, checkAdmin, createSlide);
slideRouter.post(
  "/admin/:id/duplicate",
  checkAuth,
  checkAdmin,
  duplicateSlide,
);
slideRouter.put("/admin/:id", checkAuth, checkAdmin, updateSlide);
slideRouter.delete("/admin/:id", checkAuth, checkAdmin, deleteSlide);

export default slideRouter;

