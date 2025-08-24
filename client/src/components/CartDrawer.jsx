import { useContext, useEffect } from "react";
import MyContext from "../Context/MyContext";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import { IoClose } from "react-icons/io5";
import CartItem from "./CartItem";
import formatMoney from "../utils/MoneyFormat";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

const CartDrawer = () => {
  const { isOpenCart, closeCart } = useContext(MyContext);
  const cart = useCartStore((state) => state.cart);

  const totalCost = cart?.items && calculateTotalCost();

  function calculateTotalCost() {
    let sum = 0;
    cart?.items.forEach((product) => {
      sum +=
        product.quantity *
        (product.price - (product.price * product.discount) / 100);
    });
    return sum;
  }

  const DrawerList = (
    <Box sx={{ width: 400 }} role="presentation">
      <div className="px-4 h-[60vh] overflow-y-scroll scroll">
        {cart?.items &&
          cart?.items.map((product, index) => (
            <div className="" key={index}>
              <CartItem product={product} userId={cart?.userId}/>
            </div>
          ))}
      </div>
      <div className="flex justify-center items-center h-[28vh]">
        <div className="w-8/10">
          <div className="py-2 pt-4 border-b border-gray-300">
            <div className="flex justify-between w-full border-gray-300">
              <div className="">Tổng cộng:</div>
              <div className="text-lg font-bold">{formatMoney(totalCost)}</div>
            </div>
            <div className="flex justify-between w-full border-gray-300">
              <div className="">Vận chuyển:</div>
              <div className="">Free</div>
            </div>
          </div>
          <div>
            <div className="flex justify-between py-2 w-full">
              <div className="font-semibold">Thành tiền:</div>
              <div className="text-highlight font-bold text-lg">
                {formatMoney(totalCost)}
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <Button
                component={Link}
                to={"/cart?"}
                className="!w-full !py-3 !bg-blue-500 !text-white !font-bold hover:!bg-black"
                onClick={closeCart}
              >
                Xem Giỏ Hàng
              </Button>
              <Button
                component={Link}
                to={"/checkout"}
                className="!w-full !py-3 !bg-white !text-blue-500 !border-2 !border-blue-500 !font-bold hover:!bg-black hover:!text-white hover:!border-black"
                onClick={closeCart}
              >
                CheckOut
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Box>
  );

  return (
    <div>
      <Drawer open={isOpenCart} onClose={closeCart} anchor={"right"}>
        <h3 className="flex items-center justify-between p-3 font-semibold text-content">
          Giỏ hàng ({cart?.items?.length})
          <div className="hover:bg-gray-200 p-1 rounded-full cursor-pointer transition">
            <IoClose onClick={closeCart} size={25} />
          </div>
        </h3>
        <Divider />
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default CartDrawer;
