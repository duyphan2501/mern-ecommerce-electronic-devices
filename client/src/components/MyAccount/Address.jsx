import useAddressStore from "../../store/addressStore";
import AddressList from "../AddressList";
import OrderCard from "./od";
const order = {
  id: "12345",
  status: "pending", // completed | pending | canceled
  createdAt: "2025-09-08T14:30:00Z",
  paymentMethod: "Thanh toán khi nhận hàng",
  items: [
    { id: 1, name: "Cà phê sữa", qty: 2, price: 25000 },
    { id: 2, name: "Trà đào", qty: 1, price: 30000 },
  ],
  total: 80000,
};

const Address = () => {
  const addresses = useAddressStore((state) => state.addresses);

  return (
    <div className="bg-white rounded-md border border-gray-200 shadow p-5">
      <AddressList title={"Địa chỉ giao hàng"} address={addresses}/>
      <OrderCard order={order} />
    </div>
  );
};

export default Address;
