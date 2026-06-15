import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config.js";
import uploadFiles from "../helper/upload.js";
import ServiceModel from "../model/service.model.js";

const serviceFolder = "services";
const validStatuses = ["draft", "active"];

const createHttpError = (statusCode, message) =>
  Object.assign(new Error(message), { statusCode });

const normalizeServicePayload = (payload) => ({
  name: payload.name?.trim(),
  image: payload.image?.trim(),
  description: payload.description?.trim() || "",
  link: payload.link?.trim() || "",
  status: payload.status || "draft",
  order: Math.max(Number(payload.order) || 1, 1),
});

const validateServicePayload = (service) => {
  if (!service.name || !service.image) {
    throw createHttpError(400, "Service name and image are required");
  }

  if (!validStatuses.includes(service.status)) {
    throw createHttpError(400, "Invalid service status");
  }
};

const validateServiceId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createHttpError(400, "Invalid service id");
  }
};

const getCloudinaryPublicId = (url) => {
  if (
    typeof url !== "string" ||
    !url.includes("res.cloudinary.com") ||
    !url.includes(`/${serviceFolder}/`)
  ) {
    return "";
  }

  const path = url.split(`/${serviceFolder}/`)[1]?.split("?")[0];
  if (!path) return "";

  const extensionIndex = path.lastIndexOf(".");
  const filename = extensionIndex >= 0 ? path.slice(0, extensionIndex) : path;
  return `${serviceFolder}/${decodeURIComponent(filename)}`;
};

const removeImageIfUnused = async (url) => {
  const publicId = getCloudinaryPublicId(url);
  if (!publicId) return;

  const references = await ServiceModel.countDocuments({ image: url });
  if (references > 0) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Unable to remove service image from Cloudinary:", error);
  }
};

const uploadServiceImage = async (file) => {
  if (!file) {
    throw createHttpError(400, "No image uploaded");
  }

  const [uploadedImage] = await uploadFiles(file, {
    folder: serviceFolder,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
  });

  return uploadedImage;
};

const getPublicServices = () =>
  ServiceModel.find({ status: "active" })
    .sort({ order: 1, createdAt: 1 })
    .lean();

const getAdminServices = () =>
  ServiceModel.find().sort({ order: 1, createdAt: 1 }).lean();

const getAdminServiceById = async (id) => {
  validateServiceId(id);

  const service = await ServiceModel.findById(id).lean();
  if (!service) {
    throw createHttpError(404, "Service not found");
  }

  return service;
};

const createService = async (body) => {
  const payload = normalizeServicePayload(body);
  validateServicePayload(payload);
  return ServiceModel.create(payload);
};

const updateService = async (id, body) => {
  validateServiceId(id);

  const service = await ServiceModel.findById(id);
  if (!service) {
    throw createHttpError(404, "Service not found");
  }

  const payload = normalizeServicePayload(body);
  validateServicePayload(payload);

  const previousImage = service.image;
  Object.assign(service, payload);
  await service.save();

  if (previousImage && previousImage !== service.image) {
    await removeImageIfUnused(previousImage);
  }

  return service;
};

const deleteService = async (id) => {
  validateServiceId(id);

  const service = await ServiceModel.findByIdAndDelete(id);
  if (!service) {
    throw createHttpError(404, "Service not found");
  }

  await removeImageIfUnused(service.image);
};

export {
  createService,
  deleteService,
  getAdminServiceById,
  getAdminServices,
  getPublicServices,
  updateService,
  uploadServiceImage,
};
