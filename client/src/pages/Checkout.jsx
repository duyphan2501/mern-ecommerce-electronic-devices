import { Button } from "@mui/material";
import CheckoutItem from "../components/CheckoutItem";
import formatMoney from "../utils/MoneyFormat";
import { useContext, useMemo } from "react";
import MyContext from "../Context/MyContext";
import AddressForm from "../components/AddressForm";
import AddressList from "../components/AddressList";
import useCartStore from "../store/cartStore";
import useAddressStore from "../store/addressStore";
import usePaymentStore from "../store/paymentStore";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useState } from "react";
import useOrderStore from "../store/orderStore";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { isOpenAddrFrm, fiLoader } = useContext(MyContext);
  
  const cart = useCartStore((state) => state.cart);
  const { isPaymentLoading, createPayment } = usePaymentStore();
  const addresses = useAddressStore((state) => state.addresses);
  const { createOrder, isLoading } = useOrderStore();
  
  const [selectedAddress, setSelectedAddress] = useState();
  const totalCost = useMemo(() => calculateTotalCost(cart?.items), [cart]);
  const navigator = useNavigate();

  const axiosPrivate = useAxiosPrivate();

  const handleCreateOrder = async () => {
    const res = await createOrder(axiosPrivate, {
      cartItems: cart?.items,
      address: selectedAddress,
      provider: "cod",
      orderStatus: "draft",
    });

    if (res.success) {
      navigator(`/order-success?orderCode=${res.newOrder.orderCode}`);
    }
  };

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
          <div className="bg-white rounded-md border-[1px] border-gray-200 shadow p-5 h-fit mt-5 lg:mt-0 w-full lg:w-fit">
            <h4 className="capitalize text-lg font-bold border-b border-gray-300 pb-2">
              Đơn hàng của bạn
            </h4>
            <div className="flex justify-between items-center p-2 border-b border-gray-300 ">
              <div className="font-semibold">Sản phẩm</div>
              <div className="font-semibold">Đơn giá</div>
            </div>
            <div className="max-h-40 overflow-scroll scroll px-2">
              {cart?.items?.length > 0 && cart?.items.map((item) => (
                <CheckoutItem item={item} key={item.modelId} />
              ))}
            </div>
            <div className="flex justify-between items-center">
              <div className="">Vận chuyển: </div>
              <div className="">Free</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="">Thuế: </div>
              <div className="">...</div>
            </div>
            <div className="flex justify-between items-center py-2">
              <p className="font-semibold">Tiền cần thanh toán:</p>
              <p className="font-bold text-highlight text-lg">
                {formatMoney(totalCost)}
              </p>
            </div>
            
            <Button
              className="!w-full !mb-3 !bg-teal-400 !text-white !font-bold hover:!bg-black"
              onClick={handleCreateOrder}
            >
              Thanh toán khi nhận hàng (COD) {isLoading && fiLoader}
            </Button>

            <Button
              className="!w-full !bg-blue-500 !text-white !font-bold hover:!bg-black"
              onClick={() =>
                createPayment(axiosPrivate, cart?.items, selectedAddress)
              }
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
