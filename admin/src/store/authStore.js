import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

axios.defaults.withCredentials = true;

const initialState = {
  user: null,
  isAuthenticated: false,
  message: null,
  isVerified: false,
  isLoading: false,
  accessToken: null,
};

const useAuthStore = create((set) => ({
  ...initialState,
  reset: () => {
    set({ message: null, isLoading: false });
  },

  verifyEmail: async (email, code) => {
    set({ isLoading: true, message: null });
    try {
      const res = await axios.put(`${API_URL}/api/user/verify-email`, {
        email,
        code,
      });
      set({
        user: res.data.user,
        isAuthenticated: true,
        isVerified: true,
        isLoading: false,
        message: res.data.message || "Verify Email Successfully",
      });
    } catch (error) {
      set({
        message: error.response?.data?.message || "Verify Email failed",
        isLoading: false,
      });
      throw error;
    }
  },

  sendVerificationEmail: async (email) => {
    set({ message: null });
    try {
      const res = await axios.put(
        `${API_URL}/api/user/send-verification-email`,
        {
          email,
        }
      );
      set({
        message: res.data?.message || "Sent successfully",
      });
    } catch (error) {
      set({
        message: error.response?.data?.message || "Sent Verify Email failed",
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, message: null });
    try {
      const res = await axios.post(`${API_URL}/api/user/login`, {
        email,
        password,
      });

      set({
        user: res?.data?.user,
        isLoading: false,
        isAuthenticated: true,
        message: res?.data?.message || "Login successfully",
        isVerified: true, // reset về true nếu login thành công
        accessToken: res.data.accessToken,
      });
    } catch (error) {
      let message = "Login failed";
      let isVerified = true;
      let user = null;

      if (error.response) {
        message = error.response.data?.message || message;
        if (
          error.response.status === 401 &&
          error.response.data?.user?.isVerified === false
        ) {
          isVerified = false;
          user = error.response.data?.user;
        }
      }
      set({
        message,
        isLoading: false,
        isVerified,
        user,
      });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, message: null });
    try {
      const res = await axios.post(`${API_URL}/api/user/forgot-password`, {
        email,
      });
      set({ message: res.data.message, user: res.data.user, isLoading: false });
    } catch (error) {
      set({
        message: error.response.data.message,
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (token, newPassword, confirmPassword) => {
    set({ isLoading: true, message: null });
    try {
      const res = await axios.put(
        `${API_URL}/api/user/reset-password/${token}`,
        {
          password: newPassword,
          confirmPassword,
        }
      );
      set({ user: res.data.user, isLoading: false, message: res.data.message });
    } catch (error) {
      set({
        message: error.response.data.message || "Reset password failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, message: null });
    try {
      const res = await axios.get(`${API_URL}/api/user/logout`);
      set({
        ...initialState,
        message: res.data.message || "Logout successfully",
      });
    } catch (error) {
      set({
        message: error.response.data.message || "Logout failed",
        isLoading: false,
      });
      throw error;
    }
  },

  refreshToken: async () => {
    set({ isLoading: true, message: null });
    try {
      const res = await axios.put(`${API_URL}/api/user/refresh-token`);
      set({
        isLoading: false,
        isAuthenticated: true,
        isVerified: true,
        user: res.data.user,
        accessToken: res.data.accessToken,
      });
      return { accessToken: res.data.accessToken };
    } catch (error) {
      set({
        message:
          error.response.data.message ||
          "Token is expired, you have login again!",
        isLoading: false,
      });
      throw error;
    }
  },

  googleLogin: async (token) => {
    try {
      const res = await axios.post(`${API_URL}/api/user/google`, { token });
      set({
        user: res.data.user,
        accessToken: res.data.accessToken,
      });
    } catch (error) {
      throw error;
    }
  },
  
}));

export default useAuthStore;
