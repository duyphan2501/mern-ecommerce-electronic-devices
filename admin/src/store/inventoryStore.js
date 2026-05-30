import { create } from "zustand";
import { toast } from "react-hot-toast";

const useInventoryStore = create((set, get) => ({
  items: [],
  summary: {},
  movementsByModel: {},
  isLoading: false,
  isSaving: false,

  getInventoryData: async (axiosPrivate) => {
    set({ isLoading: true });
    try {
      const [itemsRes, summaryRes] = await Promise.all([
        axiosPrivate.get("/api/inventory/items"),
        axiosPrivate.get("/api/inventory/summary"),
      ]);

      set({
        items: itemsRes.data?.items || [],
        summary: summaryRes.data?.summary || {},
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to load inventory data",
      );
    } finally {
      set({ isLoading: false });
    }
  },

  getMovements: async (modelId, axiosPrivate) => {
    if (!modelId) return [];
    try {
      const res = await axiosPrivate.get(
        `/api/inventory/movements?modelId=${modelId}&limit=8`,
      );
      const movements = res.data?.movements || [];
      set((state) => ({
        movementsByModel: {
          ...state.movementsByModel,
          [modelId]: movements,
        },
      }));
      return movements;
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to load stock movements",
      );
      return [];
    }
  },

  createGoodsReceipt: async (payload, axiosPrivate) => {
    set({ isSaving: true });
    try {
      const res = await axiosPrivate.post("/api/inventory/goods-receipts", payload);
      toast.success(res.data?.message || "Goods receipt created");
      await get().getInventoryData(axiosPrivate);
      set({ movementsByModel: {} });
      return true;
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to create goods receipt",
      );
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  createStockExport: async (payload, axiosPrivate) => {
    set({ isSaving: true });
    try {
      const res = await axiosPrivate.post("/api/inventory/stock-exports", payload);
      toast.success(res.data?.message || "Stock export created");
      await get().getInventoryData(axiosPrivate);
      set({ movementsByModel: {} });
      return true;
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Unable to create stock export",
      );
      return false;
    } finally {
      set({ isSaving: false });
    }
  },
}));

export default useInventoryStore;
