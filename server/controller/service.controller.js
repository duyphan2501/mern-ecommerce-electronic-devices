import * as serviceService from "../service/service.service.js";

const uploadServiceImage = async (req, res, next) => {
  try {
    const uploadedImage = await serviceService.uploadServiceImage(req.file);
    return res.status(200).json({
      message: "Service image uploaded successfully",
      uploadedImage,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getPublicServices = async (req, res, next) => {
  try {
    const services = await serviceService.getPublicServices();
    return res.status(200).json({ services, success: true });
  } catch (error) {
    next(error);
  }
};

const getAdminServices = async (req, res, next) => {
  try {
    const services = await serviceService.getAdminServices();
    return res.status(200).json({ services, success: true });
  } catch (error) {
    next(error);
  }
};

const getAdminServiceById = async (req, res, next) => {
  try {
    const service = await serviceService.getAdminServiceById(req.params.id);
    return res.status(200).json({ service, success: true });
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body);
    return res.status(201).json({
      message: "Service created successfully",
      service,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const service = await serviceService.updateService(
      req.params.id,
      req.body,
    );
    return res.status(200).json({
      message: "Service updated successfully",
      service,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    await serviceService.deleteService(req.params.id);
    return res.status(200).json({
      message: "Service deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
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
