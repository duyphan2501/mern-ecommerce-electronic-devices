import { Checkbox, Rating, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import formatMoney from "../utils/MoneyFormat";
import { FaX } from "react-icons/fa6";
import QuantityCartBtn from "./QuantityCartBtn";

const CartPageItem = ({ product }) => {
  const discountPrice =
    product.price - (product.price * product.discount) / 100;
  return (
    <div>
      <div className="rounded-md p-2 flex items-center font-bold border-b border-gray-200 select-none">
        <div className="w-3/8">
          <div className="flex gap-3">
            <div className="self-center">
              <Checkbox defaultChecked />
            </div>
            <Link to={"/san-pham/chi-tiet"}>
              <div className="h-22 w-20 rounded-md overflow-hidden">
                <img
                  src={product.image}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
              </div>
            </Link>
            <div className="flex flex-col justify-center gap-1">
              <p className="font-semibold text-black line-clamp-2">
                {product.name}
              </p>
              <div className="">
                <Stack spacing={1}>
                  <Rating
                    size="small"
                    name="half-rating"
                    defaultValue={product.rating}
                    precision={0.5}
                    readOnly
                  />
                </Stack>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 justify-between items-center">
          <div className="flex-1">
            {product.discount === 0 ? (
              <>
                <p className="font-bold">{formatMoney(product.price)}</p>
              </>
            ) : (
              <>
                <p className="text-highlight font-bold text-lg">
                  {formatMoney(discountPrice)}
                </p>
                <span className="rounded-lg bg-gray-100 text-sm p-1">
                  -{product.discount}%
                </span>
                <span className="ml-2 text-[13px] line-through align-text-top">
                  {formatMoney(product.price)}
                </span>
              </>
            )}
          </div>
          <div className="flex-1">
            <QuantityCartBtn quan={product.quantity} />
          </div>
          <div className="flex-1 font-bold text-lg">
            {formatMoney(discountPrice * product.quantity)}
          </div>
          <div className="hover:text-red-600 cursor-pointer text-start w-10">
            <FaX />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageItem;
