import express from "express";
import {
  getCommonInformation,
  updateCommonInformation,
} from "../controller/setting.controller.js";
import checkAdmin from "../middleware/admin.middleware.js";
import checkAuth from "../middleware/auth.middleware.js";

const settingRouter = express.Router();

settingRouter.get("/common-information", getCommonInformation);
settingRouter.get(
  "/admin/common-information",
  checkAuth,
  checkAdmin,
  getCommonInformation,
);
settingRouter.put(
  "/admin/common-information",
  checkAuth,
  checkAdmin,
  updateCommonInformation,
);

export default settingRouter;
