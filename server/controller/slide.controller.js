import * as slideService from "../service/slide.service.js";

const uploadSlideImage = async (req, res, next) => {
  try {
    const uploadedImage = await slideService.uploadSlideImage(req.file);
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
    const slides = await slideService.getPublicSlides(req.query.type);
    return res.status(200).json({ slides, success: true });
  } catch (error) {
    next(error);
  }
};

const getAdminSlides = async (req, res, next) => {
  try {
    const slides = await slideService.getAdminSlides();
    return res.status(200).json({ slides, success: true });
  } catch (error) {
    next(error);
  }
};

const getAdminSlideById = async (req, res, next) => {
  try {
    const slide = await slideService.getAdminSlideById(req.params.id);
    return res.status(200).json({ slide, success: true });
  } catch (error) {
    next(error);
  }
};

const createSlide = async (req, res, next) => {
  try {
    const slide = await slideService.createSlide(req.body);
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
    const slide = await slideService.updateSlide(req.params.id, req.body);
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
    const slide = await slideService.duplicateSlide(req.params.id);
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
    await slideService.deleteSlide(req.params.id);
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
