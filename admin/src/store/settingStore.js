import toast from "react-hot-toast";
import { create } from "zustand";

const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

export const defaultCommonInformation = {
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

const useSettingStore = create((set) => ({
  commonInformation: defaultCommonInformation,
  isLoading: false,
  isSaving: false,

  fetchCommonInformation: async (axiosPrivate) => {
    set({ isLoading: true });
    try {
      const response = await axiosPrivate.get(
        "/api/settings/admin/common-information",
      );
      const commonInformation = {
        ...defaultCommonInformation,
        ...response.data.commonInformation,
      };
      set({ commonInformation });
      return commonInformation;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  saveCommonInformation: async (axiosPrivate, commonInformation) => {
    set({ isSaving: true });
    try {
      const response = await axiosPrivate.put(
        "/api/settings/admin/common-information",
        commonInformation,
      );
      const savedInformation = {
        ...defaultCommonInformation,
        ...response.data.commonInformation,
      };
      set({ commonInformation: savedInformation });
      toast.success(response.data.message);
      return savedInformation;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },
}));

export default useSettingStore;
