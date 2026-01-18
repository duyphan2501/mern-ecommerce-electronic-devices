import { create } from "zustand";
import { toast } from "react-hot-toast";
import useCartStore from "./cartStore";

const useOrderStore = create((set) => ({
  orders: [],
  isLoading: false,
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
        toast.error(error.response?.data?.message || "Đã xảy ra lỗi khi tạo đơn hàng.");
        return null;
    } finally {
        set({ isLoading: false });
    }
  },
  getOrderByOrderCode: async (axiosPrivate, orderCode) => {
    set({ isLoading: true });
    try {
      const res = await axiosPrivate.get(`/api/order/by-order-code/${orderCode}`);
      return res.data.order;
    } catch (error) {
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useOrderStore;