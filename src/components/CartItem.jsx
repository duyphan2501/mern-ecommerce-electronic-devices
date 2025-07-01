import { useContext } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import MyContext from "../Context/MyContext";
import QuantityMenu from "./QuantityMenu";

const CartItem = ({ product }) => {
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.price);

  const {closeCart} = useContext(MyContext)
  return (
    <div className="flex gap-3 border-b-1 border-gray-300 w-full">
      <Link to={"/san-pham/chi-tiet"} onClick={closeCart}>
        <div className="size-25 rounded-md overflow-hidden">
          <img
            src={product.image} 
            alt=""
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>
      </Link>
      <div className="flex flex-col justify-center flex-1 gap-2">
        <div className="flex justify-between">
          <p className="line-clamp-1 w-2/3 font-semibold">{product.name}</p>
          <div className="link">
            <IoTrashOutline size={20} />
          </div>
        </div>
        <div className="flex gap-5 text-sm">
          <QuantityMenu quantity={product.quantity}/>
          <div>
            Đ.Giá:{" "}
            <span className="text-highlight font-bold">{formattedPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
