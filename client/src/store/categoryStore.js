import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const useCategoryStore = create((set) => {
  const getAllCategories = async () => {
    try {
      const url = `${API_URL}/api/category/list`;
      const res = await axios.get(url);
      return res.data.categories;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return {
    getAllCategories,
  };
});

export default useCategoryStore;
