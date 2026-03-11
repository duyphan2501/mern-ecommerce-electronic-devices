import { create } from "zustand";
import { API } from "../API/axiosInstance";
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
  const setLoading = (isLoading) => set({ isLoading });
  const getAllProducts = async () => {
    set({ isLoading: true });
    try {
      const url = `/api/product/all`;
      const res = await API.get(url);
      return res.data?.products || [];
    } catch (error) {
      console.error(error.response?.data?.message || "Get all product error");
    } finally {
      set({ isLoading: false });
    }
  };

  const getProductBySlug = async (slug) => {
    set({ isLoading: true });
    try {
      const url = `/api/product/get/${slug}`;
      const res = await API.get(url);
      return res.data?.product;
    } catch (error) {
      console.error(error.response?.data?.message || "Get product error");
    } finally {
      set({ isLoading: false });
    }
  };

  const fetchProducts = async (
    page,
    itemsPerPage,
    sortOption,
    filterParams,
  ) => {
    set({ isLoading: true });
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
      set({ isLoading: false });
    }
  };

  const getProductByCategoryId = async (cateId) => {
    set({ isLoading: true });
    try {
      const url = `/api/product/category/${cateId}`;
      const res = await API.get(url);
      return res.data?.products;
    } catch (error) {
      console.error(error.response?.data?.message || "Get product error");
    } finally {
      set({ isLoading: false });
    }
  };

  const getNewProducts = async () => {
    set({ isLoading: true });
    try {
      const url = `/api/product/new`;
      const res = await API.get(url);
      set({ newProducts: res.data?.products });
      return res.data?.products;
    } catch (error) {
      console.error(error.response?.data?.message || "Get product error");
    } finally {
      set({ isLoading: false });
    }
  };
    const searchProducts = async (searchTerm) => {
      try {
        const url = `/api/product/search?q=${encodeURIComponent(searchTerm)}`;
        const res = await API.get(url);
        return res.data?.products || [];
      } catch (error) {
        console.error(error.response?.data?.message || "Search product error");
        return [];
      }
    };

  return {
    isLoading: false,
    newProducts: [],
    setLoading,
    getAllProducts,
    getProductBySlug,
    getProductByCategoryId,
    getNewProducts,
    fetchProducts,
    searchProducts,
  };
});

export default useProductStore;
