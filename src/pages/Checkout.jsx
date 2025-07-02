import { Button } from "@mui/material";
import { FaPlus } from "react-icons/fa6";
import AddressCard from "../components/AddressCard";
import CheckoutItem from "../components/CheckoutItem";
import formatMoney from "../utils/MoneyFormat";
import { useContext, useState } from "react";
import MyContext from "../Context/MyContext";
import AddressForm from "../components/AddressForm";

const addresses = [
  {
    id: 0,
    type: "Nhà riêng",
    name: "Duy Phan",
    address: "Hoà Phú 1",
    village: "Định Thuỷ",
    district: "Mỏ Cày Nam",
    province: "Bến Tre",
    phone: "0197463712",
  },
  {
    id: 1,
    type: "Nhà riêng",
    name: "Duy Phan",
    address: "Hoà Phú 1",
    village: "Định Thuỷ",
    district: "Mỏ Cày Nam",
    province: "Bến Tre",
    phone: "0197463712",
  },
];
const products = [
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "Inverter Dye Hydrid 3kw",
    quantity: 2,
    price: 1000000,
    rating: 4.5,
    discount: 10,
  },
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "Inverter Dye Hydrid 3kw",
    quantity: 2,
    price: 1000000,
    rating: 4.5,
    discount: 10,
  },
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "Inverter Dye Hydrid 3kw",
    quantity: 2,
    price: 1000000,
    rating: 4.5,
    discount: 10,
  },
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "Inverter Dye Hydrid 3kw",
    quantity: 2,
    price: 1000000,
    rating: 4.5,
    discount: 10,
  },
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "Inverter Dye Hydrid 3kw",
    quantity: 2,
    price: 1000000,
    rating: 4.5,
    discount: 10,
  },
];
const totalCost = calculateTotalCost();

const Checkout = () => {
  const [selectedId, setSelectedId] = useState(null);

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const {isOpenAddrFrm, openAddrFrm} = useContext(MyContext)

  return (
    <div className="py-10 flex justify-center ">
      <div className="2xl:w-7/10 xl:w-8/10 lg:w-9/10 sm:w-9/10">
        <div className="lg:flex gap-5">
          <div className="lg:w-3/5 bg-white rounded-md border-[1px] border-gray-200 shadow p-5 h-fit">
            <div className="flex justify-between items-center">
              <h4 className="capitalize font-semibold text-lg">
                Chọn địa chỉ giao hàng
              </h4>
              <div className="">
                <Button className="!gap-1 !bg-white !border-1 !font-semibold  !border-blue-500 !rounded-md" onClick={openAddrFrm}>
                  <FaPlus />
                  Thêm đia chỉ mới
                </Button>
              </div>
            </div>
            <div className="mt-5 space-y-5">
              {addresses.map((addr) => (
                <AddressCard
                  key={addr.id}
                  address={addr}
                  selected={selectedId === addr.id}
                  onSelect={() => handleSelect(addr.id)}
                />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-md border-[1px] border-gray-200 shadow p-5 lg:w-2/5 h-fit mt-5 lg:mt-0">
            <h4 className="capitalize text-lg font-bold border-b border-gray-300 pb-2">
              Đơn hàng của bạn
            </h4>
            <div className="flex justify-between items-center p-2 border-b border-gray-300 ">
              <div className="font-semibold">Sản phẩm</div>
              <div className="font-semibold">Tổng cộng</div>
            </div>
            <div className="max-h-40 overflow-scroll scroll px-2">
              {products.map((product, index) => (
                <CheckoutItem product={product} key={index} />
              ))}
            </div>
            <div className="flex justify-between items-center py-2">
              <p className="font-semibold">Tiền cần thanh toán:</p>
              <p className="font-bold text-highlight text-lg">
                {formatMoney(totalCost)}
              </p>
            </div>
            <Button className="!w-full !bg-blue-500 !text-white !font-bold hover:!bg-black  ">
              Đặt hàng
            </Button>
          </div>
        </div>
      </div>
      {isOpenAddrFrm && <AddressForm/>}
    </div>
  );
};

function calculateTotalCost() {
  let sum = 0;
  products.forEach((product) => {
    sum +=
      product.quantity *
      (product.price - (product.price * product.discount) / 100);
  });
  return sum;
}

export default Checkout;
