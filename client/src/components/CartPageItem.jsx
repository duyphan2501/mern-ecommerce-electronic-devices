import { Rating, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import formatMoney from "../utils/MoneyFormat";
import { FaX } from "react-icons/fa6";
import QuantityCartBtn from "./QuantityCartBtn";

const CartPageItem = ({ item, onUpdate, onDelete }) => {
  const discountPrice = item.price - (item.price * item.discount) / 100;
  return (
    <div>
      <div className="rounded-md p-2 flex flex-col md:flex-row md:items-center gap-3 font-bold border-b border-gray-200 select-none md:min-w-[720px]">
        <div className="md:w-4/9 min-w-0">
          <div className="flex gap-3 min-w-0">
            <Link to={`/product/${item.slug}`}>
              <div className="h-22 w-20 shrink-0 rounded-md overflow-hidden relative">
                <img
                  src={item.images?.[0] || ""}
                  alt=""
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
                {item?.status !== "available" && (
                  <div className="absolute size-full inset-0 bg-black/30 text-center flex items-center justify-center">
                    <p
                      className={`${item?.status === "out_of_stock" ? "text-red-500" : "text-yellow-400"} font-semibold text-sm p-3`}
                    >
                      {item?.status === "out_of_stock"
                        ? "Hết hàng"
                        : "Cần gia hạn giữ chỗ"}
                    </p>
                  </div>
                )}
              </div>
            </Link>
            <div className="flex flex-col justify-center gap-1 min-w-0">
              <p className="font-semibold text-black line-clamp-2">
                {item.productName} {item.modelName && ` - ${item.modelName}`}
              </p>
              {item?.renewStatus === 1 && (
                <span className="text-xs text-red-500 p-1 rounded w-fit bg-red-100">
                  Đã hết hàng
                </span>
              )}
              {item?.renewStatus === 2 && (
                <span className="text-xs text-yellow-500 p-1 rounded w-fit bg-yellow-100">
                  Đã điều chỉnh số lượng
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="grid w-full md:flex-1 grid-cols-2 md:grid-cols-[1fr_1fr_1fr_40px] gap-3 md:gap-0 md:items-center">
          <div className="min-w-0">
            <div className="md:hidden text-xs text-gray-500 font-semibold mb-1">
              Đơn giá
            </div>
            {item.discount === 0 ? (
              <>
                <p className="font-bold">{formatMoney(item.price)}</p>
              </>
            ) : (
              <>
                <p className="text-highlight font-bold text-lg">
                  {formatMoney(discountPrice)}
                </p>
                <span className="rounded-lg bg-gray-100 text-sm p-1">
                  -{item.discount}%
                </span>
                <span className="ml-2 text-[13px] line-through align-text-top">
                  {formatMoney(item.price)}
                </span>
              </>
            )}
          </div>
          <div className="min-w-0">
            <div className="md:hidden text-xs text-gray-500 font-semibold mb-1">
              Số lượng
            </div>
            <QuantityCartBtn
              quan={item.quantity}
              onUpdate={(newQuantity) => onUpdate(item.modelId, newQuantity)}
            />
          </div>
          <div className="min-w-0 font-bold text-lg">
            <div className="md:hidden text-xs text-gray-500 font-semibold mb-1">
              Thành tiền
            </div>
            {formatMoney(discountPrice * item.quantity)}
          </div>
          <div
            className="hover:text-red-600 cursor-pointer text-start w-10 self-end md:self-auto size-full flex items-center justify-center rounded-md"
            onClick={() => onDelete(item.modelId)}
          >
            <FaX />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPageItem;
