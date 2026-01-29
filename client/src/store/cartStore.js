import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

axios.defaults.withCredentials = true;

const useCartStore = create((set, get) => ({
  /* =======================
      STATE
  ======================== */
  isLoading: false,

  cart: {
    items: [],
  },

  /* =======================
      LOCAL HELPER
  ======================== */
  updateCartStore: (modelId, finalQty) => {
    const cart = get().cart;

    if (!cart || !cart.items) return;

    const existItem = cart.items.find((item) => item.modelId === modelId);

    // ❌ không tồn tại & qty = 0 → bỏ qua
    if (!existItem && finalQty === 0) return;

    // ✅ thêm mới
    if (!existItem && finalQty > 0) {
      set((state) => ({
        cart: {
          ...state.cart,
          items: [...state.cart.items, { modelId, quantity: finalQty }],
        },
      }));
      return;
    }

    // ✅ update qty
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.map((item) =>
          item.modelId === modelId ? { ...item, quantity: finalQty } : item,
        ),
      },
    }));
  },

  /* =======================
      ADD TO CART
  ======================== */
  addToCart: async (cartData) => {
    set({ isLoading: true });

    try {
      const res = await axios.post(`${API_URL}/api/cart/add`, cartData);

      const finalQty = res.data.currentCartQty;

      get().updateCartStore(cartData.modelId, finalQty);

      toast.success(res.data.message);
    } catch (error) {
      const data = error.response?.data;

      toast.error(data?.message || "Thêm giỏ hàng thất bại");

      // ⚠️ thiếu hàng → backend trả qty thật
      if (
        error.response?.status === 400 &&
        data?.currentCartQty !== undefined
      ) {
        get().updateCartStore(cartData.modelId, data.currentCartQty);
      }
    } finally {
      set({ isLoading: false });
    }
  },

  /* =======================
      LOAD CART
  ======================== */
  loadCart: async (userId) => {
    set({ isLoading: true });

    try {
      const res = await axios.get(
        `${API_URL}/api/cart/get/${userId || "guest"}`,
      );

      set({
        cart: res.data.cart || { items: [] },
      });

      return res.data.cart;
    } catch (error) {
      console.log("Load cart error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  /* =======================
      UPDATE ITEM QTY
  ======================== */
  updateCartItem: async (userId, modelId, quantity) => {
    set({ isLoading: true });

    try {
      const res = await axios.put(`${API_URL}/api/cart/update`, {
        userId,
        modelId,
        quantity,
      });

      const finalQty = res.data.currentCartQty;

      get().updateCartStore(modelId, finalQty);

      toast.success(res.data.message);
    } catch (error) {
      const data = error.response?.data;

      toast.error(data?.message || "Cập nhật giỏ hàng lỗi");

      if (
        error.response?.status === 400 &&
        data?.currentCartQty !== undefined
      ) {
        get().updateCartStore(modelId, data.currentCartQty);
      }
    } finally {
      set({ isLoading: false });
    }
  },

  /* =======================
      REMOVE ITEM
  ======================== */
  removeCartItem: async (userId, modelId) => {
    set({ isLoading: true });

    try {
      const res = await axios.delete(`${API_URL}/api/cart/item/delete`, {
        data: { userId, modelId },
      });

      set({
        cart: res.data.cart || { items: [] },
      });

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa sản phẩm thất bại");
    } finally {
      set({ isLoading: false });
    }
  },

  /* =======================
      CLEAR CART
  ======================== */
  clearCart: () => {
    set({ cart: { items: [] } });
  },
}));

export default useCartStore;
