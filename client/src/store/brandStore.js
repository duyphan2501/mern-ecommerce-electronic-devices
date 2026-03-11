import { create } from "zustand";
import { API } from "../API/axiosInstance";

const useBrandStore = create((set) => ({
  brandList: [],
  getAllBrands: async () => {
    try {
      const res = await API.get(`/api/brand/all`);
      set({ brandList: res.data.brands || [] });
      return res.data.brands || [];
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      return [];
    }
  },
}));

export default useBrandStore;
