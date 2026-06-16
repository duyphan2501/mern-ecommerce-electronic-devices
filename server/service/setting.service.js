import SettingModel from "../model/setting.model.js";

const COMMON_INFORMATION_KEY = "common-information";

const createHttpError = (statusCode, message) =>
  Object.assign(new Error(message), { statusCode });

const commonInformationDefaults = {
  storeName: "",
  tagline: "",
  logo: "",
  favicon: "",
  email: "",
  phone: "",
  hotline: "",
  address: "",
  openingHours: "",
  facebook: "",
  instagram: "",
  youtube: "",
  tiktok: "",
};

const normalizeCommonInformation = (payload = {}) =>
  Object.keys(commonInformationDefaults).reduce(
    (settings, key) => ({
      ...settings,
      [key]:
        typeof payload[key] === "string"
          ? payload[key].trim()
          : commonInformationDefaults[key],
    }),
    {},
  );

const validateCommonInformation = (settings) => {
  if (!settings.storeName) {
    throw createHttpError(400, "Store name is required");
  }

  if (settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    throw createHttpError(400, "Invalid contact email");
  }
};

const getCommonInformation = async () => {
  const setting = await SettingModel.findOne({
    key: COMMON_INFORMATION_KEY,
  }).lean();

  return {
    ...commonInformationDefaults,
    ...(setting?.commonInformation || {}),
  };
};

const updateCommonInformation = async (body) => {
  const commonInformation = normalizeCommonInformation(body);
  validateCommonInformation(commonInformation);

  const setting = await SettingModel.findOneAndUpdate(
    { key: COMMON_INFORMATION_KEY },
    { $set: { commonInformation } },
    { new: true, upsert: true, runValidators: true },
  ).lean();

  return setting.commonInformation;
};

export { getCommonInformation, updateCommonInformation };
