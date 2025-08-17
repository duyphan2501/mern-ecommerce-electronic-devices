import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const useCategoryStore = create((set) => {
  const getListCategories = async () => {
    try {
      const url = `${API_URL}/api/category/list`;
      const res = await axios.get(url);
      return res.data.categories;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const getAllCategories = async () => {
    try {
      const url = `${API_URL}/api/category/all`;
      const res = await axios.get(url);
      return res.data.categories;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const uploadCategoryImage = async (axiosPrivate, file) => {
    try {
      const fileData = new FormData();
      fileData.append("categoryImage", file);
      const url = `${API_URL}/api/category/upload-image`;
      const res = await axiosPrivate.post(url, fileData);
      return res.data.uploadedImage;
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const saveCategory = async (axiosPrivate, category, isEdit = false) => {
    set({ isLoading: true });
    try {
      var uploadedImage;
      if (category.image) {
        uploadedImage = await uploadCategoryImage(axiosPrivate, category.image);
        if (!uploadedImage) return;
      }
      const payload = {
        ...category,
        image: uploadedImage,
      };

      const url = isEdit
        ? `${API_URL}/api/category/update/${category._id}`
        : `${API_URL}/api/category/create`;

      const res = isEdit
        ? await axiosPrivate.put(url, payload)
        : await axiosPrivate.post(url, payload);
      toast.success(res.data.message);
      return res.data.newCategory;
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoading: false });
    }
  };

  const deleteCategory = async (axiosPrivate, categoryId) => {
    try {
      const url = `${API_URL}/api/category/delete/${categoryId}`;
      const res = await axiosPrivate.delete(url);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return {
    isLoadin: false,
    getListCategories,
    getAllCategories,
    createCategory: (axiosPrivate, category) =>
      saveCategory(axiosPrivate, category),
    updateCategory: (axiosPrivate, category) =>
      saveCategory(axiosPrivate, category, true),
    deleteCategory,
  };
});

export default useCategoryStore;
