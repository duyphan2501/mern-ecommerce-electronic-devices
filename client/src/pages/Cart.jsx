import { Button, Checkbox } from "@mui/material";
import CartPageItem from "../components/CartPageItem";
import formatMoney from "../utils/MoneyFormat";
import { Link } from "react-router-dom";

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
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const Cart = () => {
  return (
    <div className=" py-10">
      <div className="container">
        <div className="flex gap-10 mt-2">
          <div className="w-3/4 bg-white rounded-md shadow border-[1px] border-gray-300 p-5">
            <div className="pb-4 space-y-1 lg:flex justify-between items-center">
              <h3 className="text-xl font-bold font-sans uppercase">
                Giỏ hàng của bạn
              </h3>
              <p className="">
                Có{" "}
                <span className="text-highlight font-bold ">
                  {products.length}
                </span>{" "}
                sản phẩm trong giỏ hàng
              </p>
            </div>
            <div className="rounded-md bg-gray-300 p-2 flex font-bold items-center">
              <div className="w-3/8 flex items-center">
                <Checkbox {...label} defaultChecked />
                Tất cả ({products.length} Sản phẩm)
              </div>
              <div className="flex flex-1 justify-between">
                <div className="flex-1">Đơn giá</div>
                <div className="flex-1">Số lượng</div>
                <div className="flex-1">Thành tiền</div>
                <div className="w-10">Xoá</div>
              </div>
            </div>
            {products.map((product, index) => {
              return (
                <div className="" key={index}>
                  <CartPageItem product={product} />
                </div>
              );
            })}
          </div>
          <div className="w-1/4 ">
            <div className="sticky top-37 bg-white p-5 rounded-md shadow border-[1px] border-gray-300">
              <h4 className="text-center font-bold text-lg border-b-2 pb-2 mb-2 border-gray-200">
                Cart Summary
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="">Tổng cộng: </div>
                  <div className="font-bold">{formatMoney(totalCost)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="">Vận chuyển: </div>
                  <div className="">Free</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="">Thuế: </div>
                  <div className="">...</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="font-bold">Thành tiền: </div>
                  <div className="font-bold">{formatMoney(totalCost)}</div>
                </div>
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

function calculateTotalCost() {
  let sum = 0;
  products.forEach((product) => {
    sum +=
      product.quantity *
      (product.price - (product.price * product.discount) / 100);
  });
  return sum;
}

export default Cart;
