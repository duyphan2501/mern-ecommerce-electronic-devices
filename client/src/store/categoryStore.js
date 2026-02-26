import { create } from "zustand";
import {API} from "../API/axiosInstance";

const useCategoryStore = create((set) => {
  const getListOfCategories = async () => {
    try {
      const url = `/api/category/list`;
      const res = await API.get(url);
      set({ categoryList: res.data.categories || [] });
      return res.data.categories || [];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  };

  return {
    categoryList: [],
    getListOfCategories,
  };
});

export default useCategoryStore;
