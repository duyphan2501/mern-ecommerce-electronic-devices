import {  IconButton, Rating, Stack, Tooltip } from "@mui/material";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import { Link } from "react-router-dom";
import AddToCartBtn from "./AddToCartBtn";
import { useContext } from "react";
import MyContext from "../Context/MyContext";

const ProductListShape = ({
  image1,
  image2,
  name,
  price,
  discount,
  isNew,
  rating,
  description,
}) => {
  const discountPrice = price - price * (discount / 100);
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
  const formattedDiscountPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(discountPrice);

  const {openModal} = useContext(MyContext)

  return (
    <div className="p-4 rounded-md shadow bg-gray-100 flex items-center gap-10 relative border border-gray-200">
      {isNew && (
        <span className="px-2 rounded-md bg-secondary text-white absolute top-3 right-4">
          New!
        </span>
      )}
    
        <div className="relative group h-[300px] overflow-hidden rounded-lg">
            <Link to={"/san-pham/chi-tiet"}>
          <img
            src={image1}
            alt=""
            className="w-full object-contain h-full rounded-lg"
          />
          {image2 !== "" && (
            <img
              src={image2}
              alt=""
              className="w-full object-contain h-full rounded-lg absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out cursor-pointer group-hover:scale-105"
            />
          )}
          </Link>
          <Tooltip title="Xem thêm" placement="top" arrow>
            <IconButton
              variant="text"
              className="!w-[35px] !h-[35px] !min-w-[35px] !rounded-full !bg-gray-200 !text-black !absolute hover:!bg-[#0d68f3] hover:!text-white !transition-all top-[-30px] opacity-0 duration-200 group-hover:top-3 group-hover:opacity-100 right-3 z-50"
              onClick={openModal}
            >
              <HiOutlineArrowsExpand
                size={20}
                className="pointer-events-none"
              />
            </IconButton>
          </Tooltip>
        </div>

      <div className="flex flex-col justify-between flex-1 gap-2">
        <h4 className="text-2xl text-black font-semibold font-sans">{name}</h4>
        <p className="w-[95%] line-clamp-6">{description}</p>
        <div className="">
          <Stack spacing={1}>
            <Rating
              size="small"
              name="half-rating"
              defaultValue={rating}
              precision={0.5}
              readOnly
            />
          </Stack>
        </div>
        <div className="my-2">
          {discount === 0 ? (
            <>
              <p className="font-bold">{product.price} VND</p>
            </>
          ) : (
            <>
              <p className="text-highlight font-bold text-lg">
                {formattedDiscountPrice}
              </p>
              <span className="rounded-lg bg-white text-sm text-black p-1">
                -{discount}%
              </span>
              <span className="ml-2 text-[13px] line-through align-text-top text-black">
                {formattedPrice}
              </span>
            </>
          )}
        </div>
        <div className="w-fit">
          <AddToCartBtn />
        </div>
      </div>
    </div>
  );
};

export default ProductListShape;
