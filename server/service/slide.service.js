import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config.js";
import uploadFiles from "../helper/upload.js";
import SlideModel from "../model/slide.model.js";

const slideFolder = "slides";
const validTypes = ["hero", "feature", "side"];
const validStatuses = ["draft", "active"];

const createHttpError = (statusCode, message) =>
  Object.assign(new Error(message), { statusCode });

const normalizeSlidePayload = (payload) => ({
  name: payload.name?.trim(),
  type: payload.type,
  image: payload.image?.trim(),
  mobileImage: payload.mobileImage?.trim() || "",
  title: payload.title?.trim() || "",
  content: payload.content?.trim() || "",
  footer: payload.footer?.trim() || "",
  link: payload.link?.trim() || "",
  linkContent: payload.linkContent?.trim() || "",
  status: payload.status || "draft",
  order: Math.max(Number(payload.order) || 1, 1),
});

const validateSlidePayload = (slide) => {
  if (!slide.name || !slide.image) {
    throw createHttpError(400, "Slide name and image are required");
  }

  if (!validTypes.includes(slide.type)) {
    throw createHttpError(400, "Invalid slide type");
  }

  if (!validStatuses.includes(slide.status)) {
    throw createHttpError(400, "Invalid slide status");
  }

  if (slide.type === "feature" && (!slide.content || !slide.linkContent)) {
    throw createHttpError(
      400,
      "Feature ads require a headline and button label",
    );
  }
};

const validateSlideId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, "Invalid slide id");
  }
};

const isCloudinarySlideImage = (url) =>
  typeof url === "string" &&
  url.includes("res.cloudinary.com") &&
  url.includes(`/${slideFolder}/`);

const getCloudinaryPublicId = (url) => {
  const marker = `/${slideFolder}/`;
  const path = url.split(marker)[1]?.split("?")[0];
  if (!path) return "";

  const extensionIndex = path.lastIndexOf(".");
  const filename = extensionIndex >= 0 ? path.slice(0, extensionIndex) : path;
  return `${slideFolder}/${decodeURIComponent(filename)}`;
};

const removeImageIfUnused = async (url) => {
  if (!isCloudinarySlideImage(url)) return;

  const references = await SlideModel.countDocuments({
    $or: [{ image: url }, { mobileImage: url }],
  });
  if (references > 0) return;

  const publicId = getCloudinaryPublicId(url);
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Unable to remove slide image from Cloudinary:", error);
  }
};

const uploadSlideImage = async (file) => {
  if (!file) {
    throw createHttpError(400, "No image uploaded");
  }

  const [uploadedImage] = await uploadFiles(file, {
    folder: slideFolder,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  });

  return uploadedImage;
};

const getPublicSlides = (type) => {
  const query = { status: "active" };

  if (type) {
    if (!validTypes.includes(type)) {
      throw createHttpError(400, "Invalid slide type");
    }
    query.type = type;
  }

  return SlideModel.find(query)
    .sort({ type: 1, order: 1, createdAt: 1 })
    .lean();
};

const getAdminSlides = () =>
  SlideModel.find().sort({ type: 1, order: 1, createdAt: 1 }).lean();

const getAdminSlideById = async (id) => {
  validateSlideId(id);

  const slide = await SlideModel.findById(id).lean();
  if (!slide) {
    throw createHttpError(404, "Slide not found");
  }

  return slide;
};

const createSlide = async (body) => {
  const payload = normalizeSlidePayload(body);
  validateSlidePayload(payload);
  return SlideModel.create(payload);
};

const updateSlide = async (id, body) => {
  validateSlideId(id);

  const slide = await SlideModel.findById(id);
  if (!slide) {
    throw createHttpError(404, "Slide not found");
  }

  const payload = normalizeSlidePayload(body);
  validateSlidePayload(payload);

  const previousImages = [slide.image, slide.mobileImage];
  Object.assign(slide, payload);
  await slide.save();

  const replacedImages = previousImages.filter(
    (url) => url && url !== slide.image && url !== slide.mobileImage,
  );
  await Promise.all(replacedImages.map(removeImageIfUnused));

  return slide;
};

const duplicateSlide = async (id) => {
  validateSlideId(id);

  const sourceSlide = await SlideModel.findById(id).lean();
  if (!sourceSlide) {
    throw createHttpError(404, "Slide not found");
  }

  const { _id, createdAt, updatedAt, ...sourceData } = sourceSlide;
  return SlideModel.create({
    ...sourceData,
    name: `${sourceData.name} copy`,
    status: "draft",
  });
};

const deleteSlide = async (id) => {
  validateSlideId(id);

  const slide = await SlideModel.findByIdAndDelete(id);
  if (!slide) {
    throw createHttpError(404, "Slide not found");
  }

  const slideImages = [...new Set([slide.image, slide.mobileImage])].filter(
    Boolean,
  );
  await Promise.all(slideImages.map(removeImageIfUnused));
};

export {
  createSlide,
  deleteSlide,
  duplicateSlide,
  getAdminSlideById,
  getAdminSlides,
  getPublicSlides,
  updateSlide,
  uploadSlideImage,
};
