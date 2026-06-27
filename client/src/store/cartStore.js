import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_BACKEND_URL;

axios.defaults.withCredentials = true;

const useCartStore = create((set, get) => ({
  cart: { items: [] },
  isLoading: false,

  /* ======================================================
      1. ADD TO CART
  ====================================================== */
  addToCart: async (cartData) => {
    set({ isLoading: true });
    try {
      // Backend trả về HTTP 200 cho cả thành công (0) và điều chỉnh kho (2)
      const res = await axios.post(`${API_URL}/api/cart/add`, cartData);
      const finalQty = res.data.currentCartQty;
      const backendStatusNum = res.data.status; // Mã số: 0, 1, 2

      // Dịch mã số từ API sang chuỗi chữ cho Store quản lý đồng nhất
      let uiStatusStr = "available";
      if (backendStatusNum === 1) uiStatusStr = "out_of_stock";

      toast.success(res.data.message);

      // Cập nhật Store tập trung và truyền userId để không bị mất phiên danh tính
      get().updateCartStore(
        cartData.modelId,
        finalQty,
        uiStatusStr,
        cartData.userId,
      );
    } catch (error) {
      const data = error.response?.data;
      toast.error(data?.message || "Thêm vào giỏ hàng thất bại");

      // Xử lý khi lỗi 400 (Hết hàng hoàn toàn hoặc lỗi hệ thống)
      if (
        error.response?.status === 400 &&
        data?.currentCartQty !== undefined
      ) {
        get().updateCartStore(
          cartData.modelId,
          data.currentCartQty,
          "out_of_stock",
        );
      }
    } finally {
      set({ isLoading: false });
    }
  },

  /* ======================================================
      2. LOAD CART (Duy nhất hàm này nhận chữ từ Backend)
  ====================================================== */
  loadCart: async (userId) => {
    set({ isLoading: true });
    try {
      const res = await axios.get(
        `${API_URL}/api/cart/get/${userId || "guest"}`,
      );
      const cartData = res.data.cart || { items: [] };

      set({ cart: cartData });
      return cartData;
    } catch (error) {
      console.error("Load cart error:", error);
      return { items: [] };
    } finally {
      set({ isLoading: false });
    }
  },

  /* ======================================================
      3. UPDATE ITEM QTY (Tăng / Giảm / Sửa số lượng)
  ====================================================== */
  updateCartItem: async (userId, modelId, quantity) => {
    set({ isLoading: true });
    try {
      const res = await axios.put(`${API_URL}/api/cart/update`, {
        userId,
        modelId,
        quantity,
      });

      const finalQty = res.data.currentCartQty;
      const backendStatusNum = res.data.status; // Mã số: 0, 1, 2

      // Dịch mã số từ API sang chuỗi chữ cho Store
      let uiStatusStr = "available";
      if (backendStatusNum === 1) uiStatusStr = "out_of_stock";

      toast.success(res.data.message);

      get().updateCartStore(modelId, finalQty, uiStatusStr, userId);
    } catch (error) {
      const data = error.response?.data;
      toast.error(data?.message || "Cập nhật giỏ hàng lỗi");

      if (
        error.response?.status === 400 &&
        data?.currentCartQty !== undefined
      ) {
        get().updateCartStore(modelId, data.currentCartQty, "out_of_stock");
      } else {
        // Fallback an toàn nếu lỗi hệ thống nghiêm trọng: Xóa khỏi UI
        get().updateCartStore(modelId, 0, "out_of_stock");
      }
    } finally {
      set({ isLoading: false });
    }
  },

  /* ======================================================
      4. RENEW RESERVATION (Gia hạn hàng loạt sản phẩm quá hạn)
  ====================================================== */
  renewReservation: async (userId) => {
    if (get().isLoading) return
    const cartItems = get().cart?.items || [];
    const expiredItems = cartItems.filter(
      (item) => item.status !== "available",
    );

    if (expiredItems.length === 0) return;

    set({ isLoading: true });

    // Tạo mảng Promises gọi luồng API để tái áp dụng giữ kho
    const renewPromises = expiredItems.map((item) =>
      axios
        .put(`${API_URL}/api/cart/update`, {
          userId,
          modelId: item.modelId,
          quantity: item.quantity,
        })
        .then((res) => ({
          modelId: item.modelId,
          success: true,
          currentCartQty: res.data.currentCartQty,
          renewStatus: res.data.status, // Trả về số: 0 hoặc 2
        }))
        .catch((error) => {
          const data = error.response?.data;
          return {
            modelId: item.modelId,
            success: false,
            currentCartQty: data?.currentCartQty || 0,
            renewStatus: 1, // Lỗi 400 hoặc hết hàng, gán mã số 1 (out_of_stock)
          };
        }),
    );

    try {
      const results = await Promise.all(renewPromises);

      set((state) => {
        const updatedItems = state.cart.items.map((item) => {
          const renewResult = results.find((r) => r.modelId === item.modelId);
          if (!renewResult) return item;

          // Dịch mã số (0, 1, 2) của API thành chuỗi chữ cho cấu trúc Store đồng nhất
          let nextStatus = "available";
          if (renewResult.renewStatus === 1) {
            nextStatus = "out_of_stock";
          } else if (
            renewResult.renewStatus === 2 ||
            renewResult.renewStatus === 0
          ) {
            nextStatus = "available";
          }

          return {
            ...item,
            quantity: renewResult.currentCartQty,
            status: nextStatus,
            renewStatus: renewResult.renewStatus, // Gắn số 0, 1, 2 để UI hiển thị thông báo chi tiết
          };
        });
        toast.success("Đã gia hạn giỏ hàng")

        return {
          cart: {
            ...state.cart,
            items: updatedItems,
          },
        };
      });
    } catch (globalError) {
      console.error("Gia hạn lỗi hệ thống:", globalError);
      toast.error("Không thể kết nối đến máy chủ để gia hạn");
    } finally {
      set({ isLoading: false });
    }
  },

  /* ======================================================
      5. UPDATE CART STORE (CORE MUTATOR)
  ====================================================== */
  updateCartStore: (modelId, finalQty, status = "available", userId = null) => {
    const cart = get().cart;
    if (!cart || !cart.items) return;

    const existItem = cart.items.find((item) => item.modelId === modelId);

    // Kịch bản A: Số lượng bằng 0 hoặc trạng thái báo hết hàng -> Xóa hoàn toàn khỏi UI để giữ sạch màn hình
    if (finalQty <= 0 || status === "out_of_stock") {
      return;
    }

    // Kịch bản B: Sản phẩm chưa có trong Store (Thêm mới thành công)
    if (!existItem && finalQty > 0) {
      const newItem = {
        modelId,
        quantity: finalQty,
        status: status,
        modelName: "Đang tải...",
        price: 0,
        discount: 0,
        productId: null,
        productName: "Đang tải...",
        images: [],
        slug: "loading",
      };

      set((state) => ({
        cart: {
          ...state.cart,
          items: [...state.cart.items, newItem],
        },
      }));

      // Gọi ngầm loadCart chính xác theo danh tính User hiện tại để điền đầy dữ liệu ảnh/tên từ DB
      get().loadCart(userId);
      return;
    }

    // Kịch bản C: Cập nhật số lượng và trạng thái của sản phẩm đã có sẵn
    set((state) => ({
      cart: {
        ...state.cart,
        items: state.cart.items.map((item) =>
          item.modelId === modelId
            ? { ...item, quantity: finalQty, status: status }
            : item,
        ),
      },
    }));
  },

  /* ======================================================
      6. REMOVE CART ITEM (Chủ động xóa sản phẩm thủ công)
  ====================================================== */
  removeCartItem: async (userId, modelId) => {
    set({ isLoading: true });
    try {
      const res = await axios.delete(`${API_URL}/api/cart/item/delete`, {
        data: { userId, modelId },
      });

      set((state) => ({
        cart: {
          ...state.cart,
          items: state.cart.items.filter((item) => item.modelId !== modelId),
        },
      }));

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Xóa sản phẩm thất bại");
    } finally {
      set({ isLoading: false });
    }
  },

  needRenewSlot: () => {
    return get().cart.items.some((item) => item.status !== "available");
  },

  /* ======================================================
      7. CLEAR CART (Gọi sau khi đã Thanh toán hoàn tất)
  ====================================================== */
  clearCart: () => {
    set({ cart: { items: [] } });
  },

}));

export default useCartStore;
