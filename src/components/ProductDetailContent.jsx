import { Button, Rating, Stack } from "@mui/material";
import { IoCartOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import QuantityButton from "./QuantityButton";
import AddToCartBtn from "./AddToCartBtn";

const ProductDetailContent = ({ product }) => {
  const discountPrice =
    product.price - product.price * (product.discount / 100);
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(product.price);
  const formattedDiscountPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(discountPrice);

  return (
    <div className="flex flex-col justify-center h-full">
      <div className="">
        <div className="flex flex-col justify-between flex-1 gap-2">
          <h4 className="text-2xl text-black font-semibold font-sans mb-2">
            {product.name}
          </h4>
          <h6 className="text-sm">
            Thương hiệu:{" "}
            <Link className="font-bold text-gray-800 hover:underline">
              {product.brand}
            </Link>
          </h6>
          <p className="w-[95%]">{product.description}</p>
          <div className="flex items-center gap-4">
            <Stack spacing={1}>
              <Rating
                size="small"
                name="half-rating"
                defaultValue={product.rating}
                precision={0.5}
                readOnly
              />
            </Stack>
            <div className="text-sm">Reviews ({5})</div>
          </div>
          <div className="flex items-center gap-5 my-2">
            <div className="">
              {product.discount === 0 ? (
                <>
                  <p className="text-highlight font-bold text-xl">
                    {product.price} VND
                  </p>
                </>
              ) : (
                <>
                  <p className="text-highlight font-bold text-xl">
                    {formattedDiscountPrice}
                  </p>
                  <span className="rounded-lg text-sm bg-gray-100 text-black p-1">
                    -{product.discount}%
                  </span>
                  <span className="ml-2 line-through text-sm align-text-top text-black">
                    {formattedPrice}
                  </span>
                </>
              )}
            </div>
            <div className="text-sm">
              Trong kho:{" "}
              <span className="text-emerald-600 font-bold">{1300}</span>
            </div>
          </div>
          <div className="flex gap-5">
            <QuantityButton />
            <div className="w-fit">
              <AddToCartBtn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailContent;
