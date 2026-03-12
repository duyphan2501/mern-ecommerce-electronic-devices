import axios from "axios";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const useBrandStore = create((set) => ({
  brandList: [],
  getAllBrands: async () => {
    try {
      const res = await axios.get(`${API_URL}/api/brand/all`);
      set({ brandList: res.data.brands || [] });
      return res.data.brands || [];
    } catch (error) {
      console.error("Failed to fetch brands:", error);
      return [];
    }
  },
}));

export default useBrandStore;
