import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.config.js";
import uploadFiles from "../helper/upload.js";
import SlideModel from "../model/slide.model.js";

const slideFolder = "slides";
const validTypes = ["hero", "feature", "side"];
const validStatuses = ["draft", "active"];

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
    return "Slide name and image are required";
  }

  if (!validTypes.includes(slide.type)) {
    return "Invalid slide type";
  }

  if (!validStatuses.includes(slide.status)) {
    return "Invalid slide status";
  }

  if (slide.type === "feature" && (!slide.content || !slide.linkContent)) {
    return "Feature ads require a headline and button label";
  }

  return null;
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
  const filename =
    extensionIndex >= 0 ? path.slice(0, extensionIndex) : path;
  return `${slideFolder}/${decodeURIComponent(filename)}`;
};

const removeImageIfUnused = async (url) => {
  if (!isCloudinarySlideImage(url)) return;

  const references = await SlideModel.countDocuments({
    $or: [{ image: url }, { mobileImage: url }],
  });

  if (references > 0) return;

  const publicId = getCloudinaryPublicId(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Unable to remove slide image from Cloudinary:", error);
    }
  }
};

const uploadSlideImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
        success: false,
      });
    }

    const [uploadedImage] = await uploadFiles(req.file, {
      folder: slideFolder,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    return res.status(200).json({
      message: "Slide image uploaded successfully",
      uploadedImage,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getPublicSlides = async (req, res, next) => {
  try {
    const query = { status: "active" };

    if (req.query.type) {
      if (!validTypes.includes(req.query.type)) {
        return res.status(400).json({
          message: "Invalid slide type",
          success: false,
        });
      }
      query.type = req.query.type;
    }

    const slides = await SlideModel.find(query)
      .sort({ type: 1, order: 1, createdAt: 1 })
      .lean();

    return res.status(200).json({ slides, success: true });
  } catch (error) {
    next(error);
  }
};

const getAdminSlides = async (req, res, next) => {
  try {
    const slides = await SlideModel.find()
      .sort({ type: 1, order: 1, createdAt: 1 })
      .lean();

    return res.status(200).json({ slides, success: true });
  } catch (error) {
    next(error);
  }
};

const getAdminSlideById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid slide id",
        success: false,
      });
    }

    const slide = await SlideModel.findById(req.params.id).lean();
    if (!slide) {
      return res.status(404).json({
        message: "Slide not found",
        success: false,
      });
    }

    return res.status(200).json({ slide, success: true });
  } catch (error) {
    next(error);
  }
};

const createSlide = async (req, res, next) => {
  try {
    const payload = normalizeSlidePayload(req.body);
    const validationError = validateSlidePayload(payload);

    if (validationError) {
      return res.status(400).json({
        message: validationError,
        success: false,
      });
    }

    const slide = await SlideModel.create(payload);
    return res.status(201).json({
      message: "Slide created successfully",
      slide,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const updateSlide = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid slide id",
        success: false,
      });
    }

    const slide = await SlideModel.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({
        message: "Slide not found",
        success: false,
      });
    }

    const payload = normalizeSlidePayload(req.body);
    const validationError = validateSlidePayload(payload);
    if (validationError) {
      return res.status(400).json({
        message: validationError,
        success: false,
      });
    }

    const previousImages = [slide.image, slide.mobileImage];
    Object.assign(slide, payload);
    await slide.save();

    const replacedImages = previousImages.filter(
      (url) => url && url !== slide.image && url !== slide.mobileImage,
    );
    await Promise.all(replacedImages.map(removeImageIfUnused));

    return res.status(200).json({
      message: "Slide updated successfully",
      slide,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const duplicateSlide = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid slide id",
        success: false,
      });
    }

    const sourceSlide = await SlideModel.findById(req.params.id).lean();
    if (!sourceSlide) {
      return res.status(404).json({
        message: "Slide not found",
        success: false,
      });
    }

    const { _id, createdAt, updatedAt, ...sourceData } = sourceSlide;
    const slide = await SlideModel.create({
      ...sourceData,
      name: `${sourceData.name} copy`,
      status: "draft",
    });

    return res.status(201).json({
      message: "Draft copy created",
      slide,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSlide = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid slide id",
        success: false,
      });
    }

    const slide = await SlideModel.findByIdAndDelete(req.params.id);
    if (!slide) {
      return res.status(404).json({
        message: "Slide not found",
        success: false,
      });
    }

    const slideImages = [...new Set([slide.image, slide.mobileImage])].filter(
      Boolean,
    );
    await Promise.all(slideImages.map(removeImageIfUnused));

    return res.status(200).json({
      message: "Slide deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
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
