import UserModel from "../model/user.model.js";

const checkAdmin = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user?.userId).select("role");
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Admin permission is required",
        success: false,
      });
    }

    req.user.role = user.role;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
    });
  }
};

export default checkAdmin;
