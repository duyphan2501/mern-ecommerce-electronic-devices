import {  Rating, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import QuantityButton from "./QuantityButton";
import AddToCartBtn from "./AddToCartBtn";
import { useState } from "react";
import ProductModel from "./ProductModel";
import formatMoney from "../utils/MoneyFormat";

const ProductDetailContent = ({ product }) => {
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const model = product.modelsId[selectedModelIndex]

  const discountPrice = 
    model.salePrice - model.salePrice * (model.discount / 100);

  const formattedPrice = formatMoney(model.salePrice);
  const formattedDiscountPrice = formatMoney(discountPrice);

  return (
    <div className="flex flex-col justify-center h-full pl-6 lg:border-l-2">
      <div className="">
        <div className="flex flex-col justify-between flex-1 gap-2">
          <h4 className="text-2xl text-black font-semibold font-sans mb-2">
            {product.productName} {" - "}
            {model.modelName}
          </h4>
          <h6 className="text-sm">
            Thương hiệu:{" "}
            <Link className="font-bold text-gray-800 hover:underline">
              {product.brandId}
            </Link>
          </h6>
          <p className="w-[95%]">{model.specifications}</p>
          <div className="flex items-center gap-4">
            <Stack spacing={1}>
              <Rating
                size="small"
                name="half-rating"
                defaultValue={model.rating || 5}
                precision={0.5}
                readOnly
              />
            </Stack>
            <div className="text-sm">Reviews ({5})</div>
          </div>
          <div className="">
            <h5 className="font-semibold mb-2">Models:</h5>
            <div className="flex flex-wrap gap-2 max-h-[200px] ">
              {product.modelsId.map((model, index) => (
                <ProductModel
                  model={model}
                  isSelected={selectedModelIndex === index}
                  onSelect={() => setSelectedModelIndex(index)}
                  key={model.modelName}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-5 my-2">
            <div className="">
              {model.discount === 0 ? (
                <>
                  <p className="text-highlight font-bold text-xl">
                    {formatMoney(model.salePrice)} 
                  </p>
                </>
              ) : (
                <>
                  <p className="text-highlight font-bold text-xl">
                    {formattedDiscountPrice}
                  </p>
                  <span className="rounded-lg text-sm bg-gray-100 text-black p-1">
                    -{model.discount}%
                  </span>
                  <span className="ml-2 line-through text-sm align-text-top text-black">
                    {formattedPrice}
                  </span>
                </>
              )}
            </div>
            <div className="text-sm">
              Trong kho:{" "}
              <span className="text-emerald-600 font-bold">{model.stockQuantity}</span>
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
