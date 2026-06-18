import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

let cancelSource = null;

const isFile = (value) => value instanceof File;

const useProductStore = create((set) => {
  const uploadImages = async (images, axiosPrivate) => {
    const imageList = images || [];
    const files = imageList.filter(isFile);
    if (!files.length) return imageList;

    const formData = new FormData();
    files.forEach((img) => formData.append("productImages", img));

    try {
      const res = await axiosPrivate.post(
        `${API_URL}/api/product/upload-images`,
        formData,
        { cancelToken: cancelSource?.token },
      );
      toast.success(res.data?.message);

      const uploadedUrls = (res.data?.uploadedImages || []).map(
        (item) => item.url,
      );
      let uploadIndex = 0;

      return imageList.map((image) => {
        if (!isFile(image)) return image;
        const uploadedUrl = uploadedUrls[uploadIndex];
        uploadIndex += 1;
        return uploadedUrl;
      });
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Upload images canceled");
      } else {
        toast.error(err.response?.data?.message || "Image upload failed");
      }
      throw err;
    }
  };

  const uploadDocumentsForModels = async (models, axiosPrivate) => {
    const newModels = (models || []).map((model) => ({
      ...model,
      documents: model.documents || [],
    }));

    for (let i = 0; i < newModels.length; i++) {
      const documents = newModels[i].documents || [];
      const files = documents.filter(isFile);
      if (!files.length) continue;

      const formData = new FormData();
      files.forEach((doc) => formData.append("documents", doc));

      try {
        const res = await axiosPrivate.post(
          `${API_URL}/api/product/upload-documents`,
          formData,
          { cancelToken: cancelSource?.token },
        );
        toast.success(res.data?.message);

        const uploadedDocuments = res.data?.uploadedDocuments || [];
        let uploadIndex = 0;

        newModels[i].documents = documents.map((document) => {
          if (!isFile(document)) return document;
          const uploadedDocument = uploadedDocuments[uploadIndex];
          uploadIndex += 1;
          return uploadedDocument;
        });
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Upload documents canceled");
        } else {
          toast.error(err.response?.data?.message || "Document upload failed");
        }
        throw err;
      }
    }

    return newModels;
  };

  const uploadImagesForModels = async (models, axiosPrivate) => {
    const newModels = (models || []).map((model) => ({
      ...model,
      images: model.images || [],
    }));

    for (let i = 0; i < newModels.length; i++) {
      newModels[i].images = await uploadImages(newModels[i].images, axiosPrivate);
    }

    return newModels;
  };

  const saveProduct = async (product, axiosPrivate, isEdit = false) => {
    set({ isLoading: true });
    cancelSource = axios.CancelToken.source();

    try {
      const modelsWithImages = await uploadImagesForModels(
        product.models,
        axiosPrivate,
      );
      const newModels = await uploadDocumentsForModels(
        modelsWithImages,
        axiosPrivate,
      );

      const payload = {
        ...product,
        models: newModels,
      };

      const url = isEdit
        ? `${API_URL}/api/product/update/${product._id}`
        : `${API_URL}/api/product/create`;

      const res = await axiosPrivate.post(url, payload, {
        cancelToken: cancelSource.token,
      });
      toast.success(res.data?.message);
      return res.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        toast.error("Save product progress canceled");
      } else {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Unable to save product.",
        );
      }
      throw error;
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
    isListLoading: false,
    products: [],
    totalProducts: 0,
    totalPages: 0,
    selectedProduct: null,
    fetchAdminProducts: async (params, axiosPrivate) => {
      set({ isListLoading: true });
      try {
        const res = await axiosPrivate.get(`${API_URL}/api/product/admin`, {
          params,
        });
        const data = res.data || {};
        set({
          products: data.products || [],
          totalProducts: data.totalProducts || 0,
          totalPages: data.totalPages || 0,
        });
        return data;
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load products.",
        );
        return { products: [], totalProducts: 0, totalPages: 0 };
      } finally {
        set({ isListLoading: false });
      }
    },
    fetchAdminProductById: async (id, axiosPrivate) => {
      set({ isLoading: true, selectedProduct: null });
      try {
        const res = await axiosPrivate.get(`${API_URL}/api/product/admin/${id}`);
        const product = res.data?.product || null;
        set({ selectedProduct: product });
        return product;
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load product.",
        );
        return null;
      } finally {
        set({ isLoading: false });
      }
    },
    createProduct: (product, axiosPrivate) =>
      saveProduct(product, axiosPrivate, false),
    updateProduct: (product, axiosPrivate) =>
      saveProduct(product, axiosPrivate, true),
    archiveProduct: async (productId, axiosPrivate) => {
      set({ isLoading: true });
      try {
        const res = await axiosPrivate.post(
          `${API_URL}/api/product/archive/${productId}`,
        );
        toast.success(res.data?.message || "Product archived");
        return true;
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to archive product.",
        );
        return false;
      } finally {
        set({ isLoading: false });
      }
    },
    cancelSaveProduct,
  };
});

export default useProductStore;
