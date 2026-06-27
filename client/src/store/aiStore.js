import { create } from "zustand";
import { API } from "../API/axiosInstance";

const useAiStore = create((set) => ({
  isLoading: false,
  error: "",

  getRecommendations: async ({ message, history = [] }) => {
    set({ isLoading: true, error: "" });

    try {
      const res = await API.post("/api/ai/recommendations", {
        message,
        history,
      });

      return {
        reply: res.data?.reply || "",
        products: res.data?.products || [],
        filters: res.data?.filters || {
          keywords: [],
          minPrice: null,
          maxPrice: null,
        },
      };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Trợ lý AI đang bận. Bạn thử lại sau nhé.";

      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: "" }),
}));

export default useAiStore;
