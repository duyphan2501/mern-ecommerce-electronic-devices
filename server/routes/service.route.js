import express from "express";
import {
  createService,
  deleteService,
  getAdminServiceById,
  getAdminServices,
  getPublicServices,
  updateService,
  uploadServiceImage,
} from "../controller/service.controller.js";
import checkAdmin from "../middleware/admin.middleware.js";
import checkAuth from "../middleware/auth.middleware.js";
import { uploadImg } from "../middleware/cloudinary.middleware.js";

const serviceRouter = express.Router();

serviceRouter.get("/public", getPublicServices);
serviceRouter.get("/admin", checkAuth, checkAdmin, getAdminServices);
serviceRouter.get("/admin/:id", checkAuth, checkAdmin, getAdminServiceById);
serviceRouter.post(
  "/admin/upload-image",
  checkAuth,
  checkAdmin,
  uploadImg.single("serviceImage"),
  uploadServiceImage,
);
serviceRouter.post("/admin", checkAuth, checkAdmin, createService);
serviceRouter.put("/admin/:id", checkAuth, checkAdmin, updateService);
serviceRouter.delete("/admin/:id", checkAuth, checkAdmin, deleteService);

export default serviceRouter;
