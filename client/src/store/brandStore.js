import { create } from "zustand";
import { API } from "../API/axiosInstance";

const useBrandStore = create((set) => ({
  getAllBrands: async () => {
    try {
      const res = await API.get(`/api/brand/all`);
      return res.data.brands || [];
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      return [];
    }
  },
}));

export default useBrandStore;
