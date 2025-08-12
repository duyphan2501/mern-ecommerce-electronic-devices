import { create } from "zustand";
import useAuthStore from "./authStore";

const useUserStore = create((set) => ({
  message: null,
  isLoading: {
    avatar: false,
    details: false,
    changePwd: false,
  },
  updateAvatar: async (axiosPrivate, formData) => {
    set((state) => ({
      isLoading: { ...state.isLoading, avatar: true },
      message: null,
    }));
    try {
      const res = await axiosPrivate.post("/api/user/avatar/upload", formData);
      set((state) => ({
        isLoading: { ...state.isLoading, avatar: false },
        message: res.data.message,
      }));
    } catch (error) {
      set({
        message: error.response.data.message || "Update avatar failed",
        isLoading: false,
      });
      throw error;
    }
  },

  updateUserDetails: async (axiosPrivate, userDetails) => {
    set((state) => ({
      isLoading: { ...state.isLoading, details: true },
      message: null,
    }));
    try {
      const res = await axiosPrivate.put("/api/user/update", userDetails);
      set((state) => ({
        isLoading: { ...state.isLoading, details: false },
        message: res.data.message,
      }));
      useAuthStore.setState({ user: res.data.user });
      console.log(useAuthStore.getState().user)
    } catch (error) {
      set({
        message: error.response.data.message || "Update user details failed",
        isLoading: false,
      });
      throw error;
    }
  },

  changePassword: async(axiosPrivate, passData) => {
    set((state) => ({
      isLoading: { ...state.isLoading, changePwd: true },
      message: null,
    }));
    try {
      const res = await axiosPrivate.put("/api/user/change-password", passData);
      set((state) => ({
        isLoading: { ...state.isLoading, changePwd: false },
        message: res.data.message,
      }));
    } catch (error) {
      set({
        message: error.response.data.message || "Change password failed",
        isLoading: false,
      });
      throw error;
    }
  },
}));

export default useUserStore;
