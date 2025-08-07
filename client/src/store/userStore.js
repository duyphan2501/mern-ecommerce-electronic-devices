import { create } from "zustand";

const useUserStore = create((set) => ({
  message: null,
  isLoading: false,
  updateAvatar: async (axiosPrivate, formData) => {
    set({ isLoading: true, message: null });
    try {
      const res = await axiosPrivate.post("/api/user/avatar/upload", formData);
      set({
        message: res.data.message,
        isLoading: false,
      });
    } catch (error) {
      set({
        message: error.response.data.message || "Update avatar failed",
        isLoading: false,
      });
      throw error;
    }
  },
}));

export default useUserStore;
