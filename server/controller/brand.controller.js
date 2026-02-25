import BrandModel from "../model/brand.model.js";

const getAllBrands = async (req, res, next) => {
  try {
    const brands = await BrandModel.find().lean();
    return res.status(200).json({
      brands,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export { getAllBrands };
