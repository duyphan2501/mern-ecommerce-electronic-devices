import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

const useCartStore = create((set) => {
  const addToCart = async (cartData) => {
    set({ isLoading: true });
    try {
      const url = `${API_URL}/api/cart/add`;
      const res = await axios.post(url, cartData);
      toast.success(res.data.message);
      set({ cart: res.data.cart });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      set({ isLoading: false });
    }
  };

  const loadCart = async (userId) => {
    set({ isLoading: true });
    try {
      const url = `${API_URL}/api/cart/get/${userId || "guest"}`;
      const res = await axios.get(url);
      set({ cart: res.data.cart });
      return res.data.cart;
    } catch (error) {
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  };

  const updateCartItem = async (userId, modelId, quantity) => {
    set({ isLoading: true });
    try {
      const url = `${API_URL}/api/cart/update`;
      const res = await axios.put(url, { userId, modelId, quantity });
      toast.success(res.data.message);
      set({ cart: res.data.cart });
    } catch (error) {
      if (error.response.status === 400)
        set({ cart: error.response.data.cart });
      toast.error(error.response?.data?.message || "Failed to update cart");
    } finally {
      set({ isLoading: false });
    }
  };

  const removeCartItem = async (userId, modelId) => {
    set({ isLoading: true });
    try {
      const url = `${API_URL}/api/cart/item/delete`;
      const res = await axios.delete(url, { data: { userId, modelId } });
      toast.success(res.data.message);
      set({ cart: res.data.cart });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove item from cart",
      );
    } finally {
      set({ isLoading: false });
    }
  };

  const clearCart = () => {
    set({ cart: { items: [] } });
  };

  return {
    isLoading: false,
    cart: { items: [] },
    addToCart,
    loadCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  };
});

export default useCartStore;
