import { Button } from "@mui/material";
import CartPageItem from "../components/CartPageItem";
import formatMoney from "../utils/MoneyFormat";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import { FiLoader } from "react-icons/fi";
import { useMemo } from "react";

const Cart = () => {
  const cart = useCartStore((state) => state.cart);
  const user = useAuthStore((state) => state.user);
  const { isLoading, updateCartItem, removeCartItem } = useCartStore();

  const invalidItemsExist = useCartStore((state) => state.needRenewSlot());
  const renewReservation = useCartStore((state) => state.renewReservation);
  const handleRenewReservation = async () => {
    if (isLoading) return;
    await renewReservation(user?._id);
  };
  const cartItems = useCartStore((state) => state.cart.items);
  const validItems = useMemo(
    () => cartItems.filter((item) => item.status === "available"),
    [cartItems],
  );
  const totalCost = calculateTotalCost(validItems || []);

  const handleUpdateQuantity = async (modelId, newQuantity) => {
    try {
      if (isLoading) return;
      await updateCartItem(user?._id, modelId, newQuantity);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveItem = (modelId) => {
    removeCartItem(user?._id, modelId);
  };

  return (
    <div className="py-6 sm:py-10">
      <div className="container">
        <div className="lg:flex gap-10 mt-2">
          <div className="lg:w-3/4 mb-5 lg:mb-0 bg-white rounded-md shadow border-[1px] border-gray-300 p-3 sm:p-5 min-w-0 overflow-x-auto scroll-x">
            <div className="pb-4 space-y-1 lg:flex justify-between items-center">
              <h3 className="text-xl font-bold font-sans uppercase">
                Giỏ hàng của bạn
              </h3>
              <div className="flex items-center gap-4">
                <p>
                  Có{" "}
                  <span className="text-highlight font-bold">
                    {cart?.items?.length || 0}
                  </span>{" "}
                  sản phẩm trong giỏ hàng
                </p>
                {invalidItemsExist && (
                  <button
                    className="flex items-center gap-1 text-xs text-whie px-2 py-1 rounded-2xl hover:text-blue-700 transition cursor-pointer bg-blue-100 hover:bg-blue-200 font-semibold"
                    onClick={handleRenewReservation}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin">
                        <FiLoader />
                      </div>
                    ) : (
                      "Gia hạn giữ chỗ"
                    )}
                  </button>
                )}
              </div>
            </div>
            <div className="hidden md:flex rounded-md bg-gray-300 p-2 font-bold items-center min-w-[720px]">
              <div className="w-4/9 flex items-center">Sản phẩm</div>
              <div className="grid flex-1 grid-cols-[1fr_1fr_1fr_40px] items-center">
                <div>Đơn giá</div>
                <div>Số lượng</div>
                <div>Thành tiền</div>
                <div className="w-10">Xoá</div>
              </div>
            </div>
            {cart?.items && cart.items.length === 0 ? (
              <div className="flex justify-center items-center h-fit my-5">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Giỏ hàng của bạn trống
                  </h3>
                  <p className="text-gray-600">
                    Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.
                  </p>
                </div>
              </div>
            ) : (
              cart?.items?.map((item) => {
                return (
                  <div key={item.modelId}>
                    <CartPageItem
                      item={item}
                      onUpdate={handleUpdateQuantity}
                      onDelete={handleRemoveItem}
                    />
                  </div>
                );
              })
            )}
          </div>
          <div className="lg:w-1/4">
            <div className="sticky top-37 bg-white p-5 rounded-md shadow border-[1px] border-gray-300">
              <h4 className="text-center font-bold text-lg border-b-2 pb-2 mb-2 border-gray-200">
                Cart Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center gap-4">
                  <div>Tổng cộng: </div>
                  <div className="font-bold text-right">
                    {formatMoney(totalCost)}
                  </div>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <div>Vận chuyển: </div>
                  <div className="italic">Free</div>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <div>Thuế: </div>
                  <div className="italic">Included</div>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <div className="font-bold">Thành tiền: </div>
                  <div className="font-bold text-right">
                    {formatMoney(totalCost)}
                  </div>
                </div>
                {invalidItemsExist && (
                  <div className="rounded-md bg-yellow-100 text-yellow-800 px-3 py-2 text-sm mt-3">
                    Giỏ hàng có sản phẩm hết hạn hoặc hết hàng. Hãy cập nhật lại giỏ hàng trước khi thanh toán. Hệ thống sẽ tự động cập nhật số lượng khả dụng thực tế trong kho tổng khi thanh toán.
                  </div>
                )}
                <Button
                  component={Link}
                  to={"/checkout"}
                  className="!w-full !bg-blue-500 !text-white hover:!bg-black !font-bold !font-sans"
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function calculateTotalCost(items) {
  if (!items) return 0;
  let sum = 0;
  items.forEach((item) => {
    if (item.isReserved === false) return;
    sum += item.quantity * (item.price - (item.price * item.discount) / 100);
  });
  return sum;
}

export default Cart;
