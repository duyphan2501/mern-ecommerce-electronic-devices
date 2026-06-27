import { Button } from "@mui/material";
import CheckoutItem from "../components/CheckoutItem";
import formatMoney from "../utils/MoneyFormat";
import { useContext, useEffect, useMemo, useState } from "react";
import MyContext from "../Context/MyContext";
import AddressForm from "../components/AddressForm";
import AddressList from "../components/AddressList";
import useCartStore from "../store/cartStore";
import useAddressStore from "../store/addressStore";
import usePaymentStore from "../store/paymentStore";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useOrderStore from "../store/orderStore";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore"; // Đảm bảo đã import hook auth
import toast from "react-hot-toast";

const Checkout = () => {
  const { isOpenAddrFrm, fiLoader } = useContext(MyContext);

  const { isPaymentLoading, createPayment } = usePaymentStore();
  const addresses = useAddressStore((state) => state.addresses);
  const { createOrder, isLoading } = useOrderStore();
  const user = useAuthStore((state) => state.user);

  // Lấy hàm gia hạn hàng loạt từ Store của bạn
  const renewReservation = useCartStore((state) => state.renewReservation);

  const [selectedAddress, setSelectedAddress] = useState();
  const [isValidating, setIsValidating] = useState(true); // Cờ kiểm soát luồng giữ kho ngầm

  const cartItems = useCartStore((state) => state.cart.items || []);

  const validItems = useMemo(
    () => cartItems.filter((item) => item.status === "available"),
    [cartItems, isValidating],
  );
  const hasInvalidItems = useMemo(
    () => cartItems.some((item) => item.status !== "available"),
    [cartItems, isValidating],
  );
  const totalCost = useMemo(() => calculateTotalCost(validItems), [validItems]);
  const navigator = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const loadCart = useCartStore(s => s.loadCart)

  const handleCreateOrder = async () => {
    if (isLoading) return;
    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    const res = await createOrder(axiosPrivate, {
      cartItems: validItems,
      address: selectedAddress,
      provider: "cod",
      orderStatus: "draft",
      userId: user?._id,
    });

    await loadCart(user?._id)
    if (res.success) {
      navigator(`/order-success?orderCode=${res.newOrder.orderCode}`);
    } else {
      setIsValidating(true)
    }
  };

  useEffect(() => {
    const lockAndRenewInventory = async () => {
      if (user?._id && isValidating) {
        try {
          // Kích hoạt chạy ngầm gia hạn cho các món expired, trả về kết quả map số 0,1,2
          await renewReservation(user._id);
        } catch (err) {
          console.error("Gia hạn tự động thất bại:", err);
        } finally {
          setIsValidating(false); // Hoàn tất kiểm tra kho, tắt màn hình chờ
        }
      } else {
        setIsValidating(false);
      }
    };

    lockAndRenewInventory();
  }, [user?._id, isValidating]);

  if (isValidating) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <p className="text-gray-500 font-medium text-sm p-2 text-center">
          Đang kiểm tra và gia hạn giữ chỗ sản phẩm trong kho tổng...
        </p>
      </div>
    );
  }

  return (
    <div className="py-10 flex justify-center ">
      <div className="xl:w-8/10 lg:w-9/10 sm:w-9/10">
        <div className="lg:flex gap-5">
          <div className=" bg-white rounded-md border-[1px] border-gray-200 shadow p-5 h-fit flex-1">
            <AddressList
              title={"Chọn địa chỉ giao hàng"}
              address={addresses}
              isCheckout={true}
              setSelectedAddress={(addr) => setSelectedAddress(addr)}
            />
          </div>
          <div className="bg-white rounded-md border-[1px] flex-1 border-gray-200 shadow p-5 h-fit mt-5 lg:mt-0 w-full lg:w-fit">
            <h4 className="capitalize text-lg font-bold border-b border-gray-300 pb-2">
              Đơn hàng của bạn
            </h4>
            <div className="flex justify-between items-center p-2 border-b border-gray-300 ">
              <div className="font-semibold">Sản phẩm</div>
              <div className="font-semibold">Đơn giá</div>
            </div>
            <div className="max-h-40 overflow-scroll scroll px-2">
              {/* SỬA: Chỉ hiển thị validItems trên hóa đơn thanh toán chính thức */}
              {validItems.length > 0 ? (
                validItems.map((item) => (
                  <CheckoutItem item={item} key={item.modelId} />
                ))
              ) : (
                <p className="text-gray-400 text-sm py-4 text-center">
                  Không có sản phẩm nào khả dụng để thanh toán.
                </p>
              )}
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="">Vận chuyển: </div>
              <p className="italic">Free</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="">Thuế: </div>
              <p className="italic">Included</p>
            </div>
            <div className="flex justify-between items-center py-2">
              <p className="font-semibold">Tiền cần thanh toán:</p>
              <p className="font-bold text-highlight text-lg">
                {formatMoney(totalCost)}
              </p>
            </div>

            {/* HIỂN THỊ THÔNG BÁO MINH BẠCH THEO UX CHUẨN */}
            {hasInvalidItems && (
              <div className="rounded-md bg-amber-50 text-amber-800 border border-amber-200 px-3 py-2 text-xs mb-3 space-y-1">
                <p className="font-semibold">Lưu ý đơn hàng:</p>
                <p>
                  Các sản phẩm quá hạn hoặc hết hàng sẽ không được đưa vào danh
                  sách thanh toán. Vui lòng quay lại giỏ hàng nếu bạn muốn gia
                  hạn hoặc dọn dẹp.
                </p>
              </div>
            )}

            <Button
              className="!w-full !mb-3 !bg-teal-400 !text-white !font-bold hover:!bg-black disabled:!bg-gray-200 disabled:!text-gray-400"
              onClick={handleCreateOrder}
              disabled={validItems.length === 0 || isLoading}
            >
              Thanh toán khi nhận hàng (COD) {isLoading && fiLoader}
            </Button>

            <Button
              className="!w-full !bg-blue-500 !text-white !font-bold hover:!bg-black disabled:!bg-gray-200 disabled:!text-gray-400"
              onClick={() =>
                createPayment(axiosPrivate, validItems, selectedAddress)
              }
              disabled={validItems.length === 0 || isPaymentLoading}
            >
              Thanh toán ngay {isPaymentLoading && fiLoader}
            </Button>
          </div>
        </div>
      </div>
      {isOpenAddrFrm && <AddressForm />}
    </div>
  );
};

function calculateTotalCost(items) {
  if (!items) return 0;
  let sum = 0;
  items.forEach((item) => {
    sum += item.quantity * (item.price - (item.price * item.discount) / 100);
  });
  return sum;
}
export default Checkout;
