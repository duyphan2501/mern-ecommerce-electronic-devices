import { create } from "zustand";
import toast from "react-hot-toast";

const emptyDashboard = {
  summary: {},
  sales: [],
  topProducts: [],
  lowStock: [],
  recentOrders: [],
};

const useDashboardStore = create((set) => ({
  dashboard: emptyDashboard,
  isLoading: false,
  error: null,

  getDashboard: async (axiosPrivate, params, signal) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosPrivate.get(
        "/api/order/admin/dashboard/summary",
        { params, signal },
      );
      set({ dashboard: response.data?.dashboard || emptyDashboard });
    } catch (error) {
      if (error?.code === "ERR_CANCELED" || error?.name === "CanceledError") {
        return;
      }
      const message =
        error.response?.data?.message || "Unable to load dashboard data";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useDashboardStore;
