import { useContext } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import MyContext from "../Context/MyContext";
import QuantityMenu from "./QuantityMenu";
import formatMoney from "../utils/MoneyFormat";
import useCartStore from "../store/cartStore";

const CartItem = ({ product, userId }) => {
  const formattedPrice = formatMoney(
    product.price - product.price * (product.discount / 100),
  );
  const { closeCart } = useContext(MyContext);
  const { isLoading, updateCartItem, removeCartItem } = useCartStore();

  const handleUpdateQuantity = async (newQuantity) => {
    try {
      if (isLoading) return;
      await updateCartItem(userId, product.modelId, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleRemoveItem = async () => {
    try {
      await removeCartItem(userId, product.modelId);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  return (
    <div className="flex gap-3 border-b-1 border-gray-300 w-full min-w-0 py-2">
      <Link to={`/product/${product.slug}`} onClick={closeCart}>
        <div className="size-20 sm:size-25 rounded-md overflow-hidden p-1">
          <img
            src={product?.images?.[0]}
            alt=""
            className="w-full h-full object-cover hover:scale-105 transition"
          />
        </div>
      </Link>
      <div className="flex flex-col justify-center flex-1 gap-2 min-w-0">
        <div className="flex justify-between gap-2">
          <p className="line-clamp-2 sm:line-clamp-1 min-w-0 font-semibold">
            {product.productName}
          </p>
          <div className="link flex size-6 shrink-0 items-center justify-center">
            <IoTrashOutline className="size-5" onClick={handleRemoveItem} />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 text-sm">
          <QuantityMenu
            quantity={product.quantity}
            handleChange={(quantity) => handleUpdateQuantity(quantity)}
          />
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
