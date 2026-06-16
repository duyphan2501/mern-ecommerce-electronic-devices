import * as blogService from "../service/blog.service.js";

const uploadBlogImage = async (req, res, next) => {
  try {
    const uploadedImage = await blogService.uploadBlogImage(req.file);
    return res.status(200).json({
      message: "Blog image uploaded successfully",
      uploadedImage,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getPublicBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getPublicBlogs();
    return res.status(200).json({ blogs, success: true });
  } catch (error) {
    next(error);
  }
};

const getPublicBlogBySlug = async (req, res, next) => {
  try {
    const blog = await blogService.getPublicBlogBySlug(req.params.slug);
    return res.status(200).json({ blog, success: true });
  } catch (error) {
    next(error);
  }
};

const getAdminBlogs = async (req, res, next) => {
  try {
    const blogs = await blogService.getAdminBlogs();
    return res.status(200).json({ blogs, success: true });
  } catch (error) {
    next(error);
  }
};

const getAdminBlogById = async (req, res, next) => {
  try {
    const blog = await blogService.getAdminBlogById(req.params.id);
    return res.status(200).json({ blog, success: true });
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req, res, next) => {
  try {
    const blog = await blogService.createBlog(req.body);
    return res.status(201).json({
      message: "Blog created successfully",
      blog,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);
    return res.status(200).json({
      message: "Blog updated successfully",
      blog,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    await blogService.deleteBlog(req.params.id);
    return res.status(200).json({
      message: "Blog deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createBlog,
  deleteBlog,
  getAdminBlogById,
  getAdminBlogs,
  getPublicBlogBySlug,
  getPublicBlogs,
  updateBlog,
  uploadBlogImage,
};
