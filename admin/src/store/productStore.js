import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

let cancelSource = null;

const useProductStore = create((set) => {
  const uploadImages = async (images, axiosPrivate) => {
    if (!images?.length) return [];
    const formData = new FormData();
    images.forEach((img) => formData.append("productImages", img));

    try {
      const res = await axiosPrivate.post(
        `${API_URL}/api/product/upload-images`,
        formData,
        { cancelToken: cancelSource?.token },
      );
      toast.success(res.data?.message);
      const uploadedImages = res.data?.uploadedImages || [];
      const data = uploadedImages.map((item) => item.url);
      return data || [];
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Upload images canceled");
      } else {
        toast.error(err.response?.data?.message || "Lỗi upload ảnh");
      }
      throw err;
    }
  };

  const uploadDocumentsForModels = async (models, axiosPrivate) => {
    const newModels = [...models];
    for (let i = 0; i < newModels.length; i++) {
      if (!newModels[i].documents?.length) continue;

      const formData = new FormData();
      newModels[i].documents.forEach((doc) =>
        formData.append("documents", doc),
      );

      try {
        const res = await axiosPrivate.post(
          `${API_URL}/api/product/upload-documents`,
          formData,
          { cancelToken: cancelSource?.token },
        );
        toast.success(res.data?.message);
        newModels[i].documents = res.data?.uploadedDocuments || [];
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Upload documents canceled");
        } else {
          toast.error(err.response?.data?.message || "Lỗi upload tài liệu");
        }
        throw err;
      }
    }
    return newModels;
  };

  const saveProduct = async (product, axiosPrivate, isEdit = false) => {
    set({ isLoading: true });
    cancelSource = axios.CancelToken.source();

    try {
      const uploadedImages = await uploadImages(product.images, axiosPrivate);
      const newModels = await uploadDocumentsForModels(
        product.models,
        axiosPrivate,
      );

      const payload = {
        ...product,
        images: uploadedImages.length ? uploadedImages : product.images,
        models: newModels,
      };

      const url = isEdit
        ? `${API_URL}/api/product/update/${product._id}`
        : `${API_URL}/api/product/create`;

      const res = await axiosPrivate.post(url, payload, {
        cancelToken: cancelSource.token,
      });
      toast.success(res.data?.message);
    } catch (error) {
      if (axios.isCancel(error)) {
        toast.error("Save product progress canceled");
      } else {
        toast.error(
          error.response?.data?.message || error.message || "Đã có lỗi xảy ra.",
        );
      }
    } finally {
      set({ isLoading: false });
      cancelSource = null;
    }
  };

  const cancelSaveProduct = () => {
    if (cancelSource) {
      cancelSource.cancel("Save product progress canceled");
      cancelSource = null;
    }
    set({ isLoading: false });
  };

  return {
    isLoading: false,
    createProduct: (product, axiosPrivate) =>
      saveProduct(product, axiosPrivate, false),
    updateProduct: (product, axiosPrivate) =>
      saveProduct(product, axiosPrivate, true),
    cancelSaveProduct,
  };
});

export default useProductStore;
