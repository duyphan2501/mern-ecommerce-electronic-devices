import { create } from "zustand";
import { toast } from "react-hot-toast";

const replaceOrder = (orders, updatedOrder) =>
  orders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order));

const useOrderStore = create((set, get) => ({
  orders: [],
  originalOrders: [],
  orderDetail: null,
  dashboard: {},
  pagination: {
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  statusCounts: {
    pending: 0,
    confirmed: 0,
    packing: 0,
    shipping: 0,
    delivered: 0,
    cancelled: 0,
  },
  currentFilters: {
    status: "all",
    search: "",
    page: 0,
    limit: 10,
  },
  isLoading: false,

  getOrders: async (axiosPrivate, filters = {}) => {
    set({ isLoading: true });
    try {
      const currentFilters = {
        ...get().currentFilters,
        ...filters,
      };
      const res = await axiosPrivate.get("/api/order/admin", {
        params: currentFilters,
      });

      set({
        orders: res.data.orders || [],
        originalOrders: res.data.orders || [],
        pagination: res.data.pagination || get().pagination,
        statusCounts: {
          ...get().statusCounts,
          ...(res.data.statusCounts || {}),
        },
        currentFilters,
      });
    } catch (error) {
      console.error(error);
      toast.error("Khong the tai danh sach don hang");
    } finally {
      set({ isLoading: false });
    }
  },

  getOrderById: async (axiosPrivate, id) => {
    set({ isLoading: true });
    try {
      const res = await axiosPrivate.get(`/api/order/admin/${id}`);
      set({ orderDetail: res.data.order });
      return res.data.order;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Tai don hang that bai");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (axiosPrivate, id, status, payload = {}) => {
    set({ isLoading: true });
    try {
      const res = await axiosPrivate.put(`/api/order/admin/${id}/status`, {
        ...payload,
        status,
      });
      const updatedOrder = res.data.order;
      set({
        orderDetail: updatedOrder,
        orders: replaceOrder(get().orders, updatedOrder),
        originalOrders: replaceOrder(get().originalOrders, updatedOrder),
      });
      await get().getOrders(axiosPrivate, get().currentFilters);
      toast.success("Cap nhat trang thai don hang thanh cong");
      return updatedOrder;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Cap nhat don hang that bai");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  editOrder: async (axiosPrivate, id, payload) => {
    set({ isLoading: true });
    try {
      const res = await axiosPrivate.put(`/api/order/admin/${id}/edit`, payload);
      const updatedOrder = res.data.order;
      set({
        orderDetail: updatedOrder,
        orders: replaceOrder(get().orders, updatedOrder),
        originalOrders: replaceOrder(get().originalOrders, updatedOrder),
      });
      toast.success("Cap nhat chi tiet don hang thanh cong");
      return updatedOrder;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Cap nhat chi tiet that bai");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  createRma: async (axiosPrivate, id, payload) => {
    return get().mutateRma(axiosPrivate, "post", `/api/order/admin/${id}/rma`, payload);
  },

  receiveRma: async (axiosPrivate, id, rmaId, payload) => {
    return get().mutateRma(
      axiosPrivate,
      "put",
      `/api/order/admin/${id}/rma/${rmaId}/receive`,
      payload,
    );
  },

  assessRma: async (axiosPrivate, id, rmaId, payload) => {
    return get().mutateRma(
      axiosPrivate,
      "put",
      `/api/order/admin/${id}/rma/${rmaId}/assess`,
      payload,
    );
  },

  matchRmaQuantity: async (axiosPrivate, id, rmaId) => {
    return get().mutateRma(
      axiosPrivate,
      "put",
      `/api/order/admin/${id}/rma/${rmaId}/match-quantity`,
      {},
    );
  },

  refundRma: async (axiosPrivate, id, rmaId) => {
    return get().mutateRma(
      axiosPrivate,
      "put",
      `/api/order/admin/${id}/rma/${rmaId}/refund`,
      {},
    );
  },

  mutateRma: async (axiosPrivate, method, url, payload) => {
    set({ isLoading: true });
    try {
      const res = await axiosPrivate[method](url, payload);
      const updatedOrder = res.data.order;
      set({
        orderDetail: updatedOrder,
        orders: replaceOrder(get().orders, updatedOrder),
        originalOrders: replaceOrder(get().originalOrders, updatedOrder),
      });
      toast.success("Cap nhat RMA thanh cong");
      return res.data;
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Cap nhat RMA that bai");
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  setOrders: (orders) => set({ orders }),
  setOrderDetail: (orderDetail) => set({ orderDetail }),
}));

export default useOrderStore;
