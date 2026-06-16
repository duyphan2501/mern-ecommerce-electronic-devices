import express from "express";
import {
  createBlog,
  deleteBlog,
  getAdminBlogById,
  getAdminBlogs,
  getPublicBlogBySlug,
  getPublicBlogs,
  updateBlog,
  uploadBlogImage,
} from "../controller/blog.controller.js";
import checkAdmin from "../middleware/admin.middleware.js";
import checkAuth from "../middleware/auth.middleware.js";
import { uploadImg } from "../middleware/cloudinary.middleware.js";

const blogRouter = express.Router();

blogRouter.get("/public", getPublicBlogs);
blogRouter.get("/public/:slug", getPublicBlogBySlug);
blogRouter.get("/admin", checkAuth, checkAdmin, getAdminBlogs);
blogRouter.get("/admin/:id", checkAuth, checkAdmin, getAdminBlogById);
blogRouter.post(
  "/admin/upload-image",
  checkAuth,
  checkAdmin,
  uploadImg.single("blogImage"),
  uploadBlogImage,
);
blogRouter.post("/admin", checkAuth, checkAdmin, createBlog);
blogRouter.put("/admin/:id", checkAuth, checkAdmin, updateBlog);
blogRouter.delete("/admin/:id", checkAuth, checkAdmin, deleteBlog);

export default blogRouter;
