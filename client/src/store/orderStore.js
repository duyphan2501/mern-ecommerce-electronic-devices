import { create } from "zustand";
import { toast } from "react-hot-toast";
import useCartStore from "./cartStore";

const useOrderStore = create((set, get) => ({
  orders: [],
  orderPagination: {
    total: 0,
    limit: 10,
    hasMore: false,
    nextCursor: null,
  },
  isLoading: false,
  setOrders: (newOrders) => set({ orders: [...newOrders] }),
  createOrder: async (axiosPrivate, orderData) => {
    if (!orderData.cartItems || orderData.cartItems.length === 0) {
      toast.error("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.");
      return null;
    }
    set({ isLoading: true });
    try {
      const res = await axiosPrivate.post("/api/order/create", orderData);
      toast.success("Tạo đơn hàng thành công!");
      useCartStore.getState().clearCart();
      return res.data;
    } catch (error) {
      console.error("Failed to create order:", error);
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi tạo đơn hàng.",
      );
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
  getOrderByOrderCode: async (axiosPrivate, orderCode) => {
    set({ isLoading: true });
    try {
      const res = await axiosPrivate.get(
        `/api/order/by-order-code/${orderCode}`,
      );
      return res.data.order;
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getOrders: async (axiosPrivate, filters = {}, options = {}) => {
    set({ isLoading: true });
    try {
      const res = await axiosPrivate.get("/api/order", {
        params: {
          status: filters.status || "all",
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          cursor: options.cursor || undefined,
          limit: options.limit || 10,
        },
      });
      set((state) => ({
        orders: options.append
          ? [...state.orders, ...res.data.orders]
          : res.data.orders,
        orderPagination: res.data.pagination || {
          total: res.data.orders?.length || 0,
          limit: options.limit || 10,
          hasMore: false,
          nextCursor: null,
        },
      }));
      return res.data;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  getOrderById: async (axiosPrivate, orderId) => {
    try {
      const res = await axiosPrivate.get(`/api/order/id/${orderId}`);
      return res.data.order;
    } catch (error) {
      console.error("Failed to fetch order by ID:", error);
    }
  },

  cancelOrder: async (axiosPrivate, orderId) => {
    set({ isLoading: true });
    try {
      const res = await axiosPrivate.put(`/api/order/cancel/${orderId}`);
      toast.success("Hủy đơn hàng thành công!");
      set({orders: get().orders.filter((order) => order._id !== orderId)});
      return res.data.order;
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi hủy đơn hàng.",
      );
    } finally {
      set({ isLoading: false });
    }
  },

  reOrder: async (axiosPrivate, orderId) => {
    set({ isLoading: true });
    try {
      const res = await axiosPrivate.put(`/api/order/reorder/${orderId}`);
      toast.success(res.data.message || "Đặt lại đơn hàng thành công!");
      return res.data;
    } catch (error) {
      console.error("Failed to re-order:", error);
      toast.error(
        error.response?.data?.message || "Đã xảy ra lỗi khi đặt lại đơn hàng.",
      );
    } finally {
      set({ isLoading: false });
    }
  },

  setOrderStatus: async (axiosPrivate, orderId, status) => {
    set({ isLoading: true });
    try {
      const res = await axiosPrivate.put(`/api/order/set-status/${orderId}`, {
        status,
      });
      return res.data.order;
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error(
        error.response?.data?.message ||
          "Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng.",
      );
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useOrderStore;
