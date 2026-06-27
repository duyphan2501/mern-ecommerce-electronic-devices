import * as aiService from "../service/ai.service.js";

const recommendProducts = async (req, res, next) => {
  try {
    const result = await aiService.recommendProducts(req.body);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export { recommendProducts };
