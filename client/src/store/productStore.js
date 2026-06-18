import { create } from "zustand";
import { API } from "../API/axiosInstance";

const initialProductLoading = {
  getAllProducts: false,
  getProductBySlug: false,
  fetchProducts: false,
  getProductByCategoryId: false,
  getProductsByCategoryIds: false,
  getNewProducts: false,
  searchProducts: false,
};

const cleanParams = (params) => {
  const cleaned = {};
  for (const key in params) {
    // Chỉ thêm vào nếu giá trị không rỗng, không phải null, không phải 0 mặc định (nếu 0 là default min price)
    if (
      params[key] !== "" &&
      params[key] !== null &&
      params[key] !== undefined
    ) {
      cleaned[key] = params[key];
    }
  }
  return cleaned;
};

const useProductStore = create((get, set) => {
  const setProductLoading = (key, value) => {
    set((state) => {
      const productLoading = {
        ...state.productLoading,
        [key]: value,
      };

      return {
        productLoading,
        isLoading: Object.values(productLoading).some(Boolean),
      };
    });
  };

  const setLoading = (isLoading) => setProductLoading("fetchProducts", isLoading);

  const getAllProducts = async () => {
    setProductLoading("getAllProducts", true);
    try {
      const url = `/api/product/all`;
      const res = await API.get(url);
      return res.data?.products || [];
    } catch (error) {
      console.error(error.response?.data?.message || "Get all product error");
    } finally {
      setProductLoading("getAllProducts", false);
    }
  };

  const getProductBySlug = async (slug) => {
    setProductLoading("getProductBySlug", true);
    try {
      const url = `/api/product/get/${slug}`;
      const res = await API.get(url);
      return res.data?.product;
    } catch (error) {
      console.error(error.response?.data?.message || "Get product error");
    } finally {
      setProductLoading("getProductBySlug", false);
    }
  };

  const fetchProducts = async (
    page,
    itemsPerPage,
    sortOption,
    filterParams,
  ) => {
    setProductLoading("fetchProducts", true);
    try {
      const params = new URLSearchParams(
        cleanParams({
          page: page,
          limit: itemsPerPage,
          sort: sortOption,
        }),
      );
      if (filterParams.categoryIds && filterParams.categoryIds.length > 0) {
        filterParams.categoryIds.forEach((id) => {
          params.append("categoryIds", id);
        });
      }
      if (filterParams.brandIds && filterParams.brandIds.length > 0) {
        filterParams.brandIds.forEach((brandName) => {
          params.append("brandIds", brandName);
        });
      }
      params.append("minPrice", filterParams.minPrice);
      params.append("maxPrice", filterParams.maxPrice);

      // Gọi API với đầy đủ tham số
      const res = await API.get(`/api/product/fetch?${params.toString()}`);

      return {
        products: res.data?.products,
        totalProducts: res.data?.totalProducts,
        totalPages: res.data?.totalPages,
      };
    } catch (error) {
      console.error(error.response?.data?.message || "Get product error");
      return { products: [], totalPages: 0 };
    } finally {
      setProductLoading("fetchProducts", false);
    }
  };

  const getProductByCategoryId = async (cateId) => {
    setProductLoading("getProductByCategoryId", true);
    try {
      const url = `/api/product/category/${cateId}`;
      const res = await API.get(url);
      return res.data?.products;
    } catch (error) {
      console.error(error.response?.data?.message || "Get product error");
    } finally {
      setProductLoading("getProductByCategoryId", false);
    }
  };

  const getProductsByCategoryIds = async (cateIds) => {
    setProductLoading("getProductsByCategoryIds", true);
    try {
      const url = `/api/product/categoryIds`;
      const res = await API.get(url, {
        params: {
          categoryIds: cateIds.join(","),
        },
      });
      return res.data?.products;
    } catch (error) {
      console.error(error.response?.data?.message || "Get product error");
    } finally {
      setProductLoading("getProductsByCategoryIds", false);
    }
  };

  const getNewProducts = async () => {
    setProductLoading("getNewProducts", true);
    try {
      const url = `/api/product/new`;
      const res = await API.get(url);
      set({ newProducts: res.data?.products });
      return res.data?.products;
    } catch (error) {
      console.error(error.response?.data?.message || "Get product error");
    } finally {
      setProductLoading("getNewProducts", false);
    }
  };
  const searchProducts = async (searchTerm) => {
    setProductLoading("searchProducts", true);
    try {
      const url = `/api/product/search?q=${encodeURIComponent(searchTerm)}`;
      const res = await API.get(url);
      return res.data?.products || [];
    } catch (error) {
      console.error(error.response?.data?.message || "Search product error");
      return [];
    } finally {
      setProductLoading("searchProducts", false);
    }
  };

  return {
    isLoading: false,
    productLoading: initialProductLoading,
    newProducts: [],
    setLoading,
    setProductLoading,
    getAllProducts,
    getProductBySlug,
    getProductByCategoryId,
    getNewProducts,
    fetchProducts,
    searchProducts,
    getProductsByCategoryIds,
  };
});

export default useProductStore;
