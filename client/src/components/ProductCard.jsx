import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import AddToCartBtn from "./AddToCartBtn";
import MyContext from "../Context/MyContext";
import { useContext } from "react";
import formatMoney from "../utils/MoneyFormat";

const ProductCard = ({
  product,
}) => {
  const discount = product.modelsId[0]?.discount;
  const price = product.modelsId[0]?.salePrice;
  const isNew = (Date.now - product.create_at) / (1000 * 60 * 60 * 24) < 7

  const discountPrice = price - price * (discount / 100);
  const formattedPrice = formatMoney(price) 
  const formattedDiscountPrice = formatMoney(discountPrice)

  const { openModal, setSelectedProduct } = useContext(MyContext);

  const handleViewMore = () => {
    setSelectedProduct(product)
    openModal()
  }

  return (
    <div className="productCard border-1 border-gray-200 rounded-md p-2 flex flex-col h-full shadow">
      <div className="relative group h-[200px] overflow-hidden">
        <Link to={`/san-pham/chi-tiet/${product.productUrl}`}>
          <img
            src={product.images[0]}
            alt=""
            className="w-full object-contain h-full rounded-md"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              className="w-full object-contain h-full rounded-md absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out cursor-pointer group-hover:scale-105"
            />
          )}
        </Link>
        <Tooltip title="Xem thêm" placement="top" arrow>
          <IconButton
            variant="text"
            className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-gray-200 !text-black !absolute right-0 hover:!bg-[#0d68f3] hover:!text-white top-[-30px] opacity-0 group-hover:top-1 group-hover:opacity-100 z-50 !transition-all !duration-100"
            onClick={handleViewMore}
          >
            <HiOutlineArrowsExpand size={20} className="pointer-events-none" />
          </IconButton>
        </Tooltip>
        {isNew && (
          <span className="px-2 rounded-xl bg-secondary text-white absolute top-1">
            New!
          </span>
        )}
      </div>
      <div className="flex flex-col justify-between flex-1">
        <div className="">
          <h4 className="line-clamp-2">{product.productName}</h4>
          <div className="">
            <Stack spacing={1}>
              <Rating
                size="small"
                name="half-rating"
                defaultValue={product?.modelsId[0]?.rating || 5}
                precision={0.5}
                readOnly
              />
            </Stack>
          </div>
          <div className="my-2">
            {discount === 0 ? (
              <>
                <p className="font-bold">{formattedPrice}</p>
              </>
            ) : (
              <>
                <p className="text-highlight font-bold text-lg">
                  {formattedDiscountPrice}
                </p>
                <span className="rounded-lg bg-gray-100 text-sm text-black p-1">
                  -{discount}%
                </span>
                <span className="ml-2 text-[13px] line-through align-text-top">
                  {formattedPrice}
                </span>
              </>
            )}
          </div>
        </div>
        <div className="">
          <AddToCartBtn />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
