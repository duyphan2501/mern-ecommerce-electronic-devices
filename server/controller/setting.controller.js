import {
  getCommonInformation as getCommonInformationService,
  updateCommonInformation as updateCommonInformationService,
} from "../service/setting.service.js";

const getCommonInformation = async (req, res, next) => {
  try {
    const commonInformation = await getCommonInformationService();
    return res.status(200).json({ commonInformation, success: true });
  } catch (error) {
    return next(error);
  }
};

const updateCommonInformation = async (req, res, next) => {
  try {
    const commonInformation = await updateCommonInformationService(req.body);
    return res.status(200).json({
      message: "Common information updated successfully",
      commonInformation,
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

export { getCommonInformation, updateCommonInformation };
