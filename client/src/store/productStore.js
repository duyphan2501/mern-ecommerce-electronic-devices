import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

const useProductStore = create((set) => {
  const getAllProducts = async () => {
    set({ isLoading: true });
    try {
      const url = `${API_URL}/api/product/all`;
      const res = await axios.get(url);
      return res.data?.products || [];
    } catch (error) {
      toast.error(error.response?.data?.message || "Get all product error");
    } finally {
      set({ isLoading: false });
    }
  };

  const getProductBySlug = async (slug) => {
    set({ isLoading: true });
    try {
      const url = `${API_URL}/api/product/get/${slug}`;
      const res = await axios.get(url);
      return res.data?.product;
    } catch (error) {
      toast.error(error.response?.data?.message || "Get product error");
    } finally {
      set({ isLoading: false });
    }
  };

  const getProductByCategoryId = async (categoryId) => {
    set({ isLoading: true });
    try {
      const url = `${API_URL}/api/product/category/${categoryId}`;
      const res = await axios.get(url);
      return res.data?.products;
    } catch (error) {
      toast.error(error.response?.data?.message || "Get product error");
    } finally {
      set({ isLoading: false });
    }
  };

  const getNewProducts = async () => {
    set({ isLoading: true });
    try {
      const url = `${API_URL}/api/product/new`;
      const res = await axios.get(url);
      return res.data?.products;
    } catch (error) {
      toast.error(error.response?.data?.message || "Get product error");
    } finally {
      set({ isLoading: false });
    }
  };

  return {
    isLoading: false,
    getAllProducts,
    getProductBySlug,
    getProductByCategoryId,
    getNewProducts,
  };
});

export default useProductStore;
