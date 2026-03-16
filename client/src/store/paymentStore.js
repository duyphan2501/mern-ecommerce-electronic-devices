import toast from "react-hot-toast";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const usePaymentStore = create((set) => {
  const createPayment = async (axiosPrivate, cartItems, address) => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.");
      return null;
    }
    set({ isPaymentLoading: true });
    try {
      const res = await axiosPrivate.post(`${API_URL}/api/payment/create`, {
        cartItems,
        address,
        provider: "payos",
        orderStatus: "draft",
      });
      const checkoutUrl = res.data.url;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error(error);
      toast.error("Chức năng thanh toán Online đang bảo trì!");
    } finally {
      set({ isPaymentLoading: false });
    }
  };

  return {
    isPaymentLoading: false,
    createPayment,
  };
});

export default usePaymentStore;
