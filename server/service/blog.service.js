import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config.js";
import slugify from "../helper/slugify.js";
import uploadFiles from "../helper/upload.js";
import BlogModel from "../model/blog.model.js";

const blogFolder = "blogs";
const validStatuses = ["draft", "published"];

const createHttpError = (statusCode, message) =>
  Object.assign(new Error(message), { statusCode });

const validateBlogId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, "Invalid blog id");
  }
};

const normalizeBlogPayload = (payload) => ({
  title: payload.title?.trim(),
  slug: payload.slug?.trim(),
  excerpt: payload.excerpt?.trim() || "",
  content: payload.content || "",
  coverImage: payload.coverImage?.trim(),
  author: payload.author?.trim() || "",
  status: payload.status || "draft",
});

const validateBlogPayload = (blog) => {
  if (!blog.title || !blog.coverImage) {
    throw createHttpError(400, "Blog title and cover image are required");
  }

  if (!validStatuses.includes(blog.status)) {
    throw createHttpError(400, "Invalid blog status");
  }
};

const ensureUniqueSlug = async (slugSource, blogId = null) => {
  const baseSlug = slugify(slugSource) || `blog-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 2;

  while (
    await BlogModel.exists({
      slug,
      ...(blogId ? { _id: { $ne: blogId } } : {}),
    })
  ) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

const getCloudinaryPublicId = (url) => {
  if (
    typeof url !== "string" ||
    !url.includes("res.cloudinary.com") ||
    !url.includes(`/${blogFolder}/`)
  ) {
    return "";
  }

  const path = url.split(`/${blogFolder}/`)[1]?.split("?")[0];
  if (!path) return "";

  const extensionIndex = path.lastIndexOf(".");
  const filename = extensionIndex >= 0 ? path.slice(0, extensionIndex) : path;
  return `${blogFolder}/${decodeURIComponent(filename)}`;
};

const removeImageIfUnused = async (url) => {
  const publicId = getCloudinaryPublicId(url);
  if (!publicId) return;

  const references = await BlogModel.countDocuments({ coverImage: url });
  if (references > 0) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Unable to remove blog image from Cloudinary:", error);
  }
};

const uploadBlogImage = async (file) => {
  if (!file) {
    throw createHttpError(400, "No image uploaded");
  }

  const [uploadedImage] = await uploadFiles(file, {
    folder: blogFolder,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  });

  return uploadedImage;
};

const getPublicBlogs = () =>
  BlogModel.find({ status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

const getPublicBlogBySlug = async (slug) => {
  const blog = await BlogModel.findOne({
    slug,
    status: "published",
  }).lean();

  if (!blog) {
    throw createHttpError(404, "Blog not found");
  }

  return blog;
};

const getAdminBlogs = () =>
  BlogModel.find().sort({ updatedAt: -1, createdAt: -1 }).lean();

const getAdminBlogById = async (id) => {
  validateBlogId(id);

  const blog = await BlogModel.findById(id).lean();
  if (!blog) {
    throw createHttpError(404, "Blog not found");
  }

  return blog;
};

const createBlog = async (body) => {
  const payload = normalizeBlogPayload(body);
  validateBlogPayload(payload);

  payload.slug = await ensureUniqueSlug(payload.slug || payload.title);
  payload.publishedAt =
    payload.status === "published" ? new Date() : null;

  return BlogModel.create(payload);
};

const updateBlog = async (id, body) => {
  validateBlogId(id);

  const blog = await BlogModel.findById(id);
  if (!blog) {
    throw createHttpError(404, "Blog not found");
  }

  const payload = normalizeBlogPayload(body);
  validateBlogPayload(payload);

  payload.slug = await ensureUniqueSlug(payload.slug || payload.title, id);
  payload.publishedAt =
    payload.status === "published"
      ? blog.publishedAt || new Date()
      : null;

  const previousImage = blog.coverImage;
  Object.assign(blog, payload);
  await blog.save();

  if (previousImage && previousImage !== blog.coverImage) {
    await removeImageIfUnused(previousImage);
  }

  return blog;
};

const deleteBlog = async (id) => {
  validateBlogId(id);

  const blog = await BlogModel.findByIdAndDelete(id);
  if (!blog) {
    throw createHttpError(404, "Blog not found");
  }

  await removeImageIfUnused(blog.coverImage);
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
