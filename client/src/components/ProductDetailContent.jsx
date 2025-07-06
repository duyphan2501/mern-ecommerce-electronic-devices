import { Button, Rating, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import QuantityButton from "./QuantityButton";
import AddToCartBtn from "./AddToCartBtn";
import { useState } from "react";
import ProductModel from "./ProductModel";
import formatMoney from "../utils/MoneyFormat";

const models = [
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "SUN-5K-SG04LP1-EU-SM2",
    price: 1000000,
    discount: 0,
    inStock: 520,
    description: "Lorem Ipsum is simpafasdfasfly dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    rating: 4,

  },
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "SUN-5K-SG05LP1-EU-SM2",
    price: 900000,
    discount: 0,
    inStock: 50,
    description: "Lorem Ipsum is simplasdfasdfy dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    rating: 4.5,

  },
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "SUN-5K-SG05LPL-EU-SM2",
    price: 900000,
    discount: 10,
    inStock: 500,
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printaadsfer took a galley of type and scrambled it to make a type specimen book.",
    rating: 5,

  },
  {
    image:
      "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
    name: "SUN-5K-SG05LP1-EU-SM3",
    price: 900000,
    discount: 20,
    inStock: 150,
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. adsfasdfasdf",
    rating: 5,

  },
];

const ProductDetailContent = ({ product }) => {
  const [selectedModel, setSelectedModel] = useState(0);
  const model = models[selectedModel]
  const discountPrice =
    model.price - model.price * (model.discount / 100);

  const formattedPrice = formatMoney(model.price);
  const formattedDiscountPrice = formatMoney(discountPrice);

  return (
    <div className="flex flex-col justify-center h-full pl-6 lg:border-l-2">
      <div className="">
        <div className="flex flex-col justify-between flex-1 gap-2">
          <h4 className="text-2xl text-black font-semibold font-sans mb-2">
            {product.name} {" - "}
            {model.name}
          </h4>
          <h6 className="text-sm">
            Thương hiệu:{" "}
            <Link className="font-bold text-gray-800 hover:underline">
              {product.brand}
            </Link>
          </h6>
          <p className="w-[95%]">{model.description}</p>
          <div className="flex items-center gap-4">
            <Stack spacing={1}>
              <Rating
                size="small"
                name="half-rating"
                defaultValue={model.rating}
                precision={0.5}
                readOnly
              />
            </Stack>
            <div className="text-sm">Reviews ({5})</div>
          </div>
          <div className="">
            <h5 className="font-semibold mb-2">Models:</h5>
            <div className="flex flex-wrap gap-2 max-h-[200px] ">
              {models.map((model, index) => (
                <ProductModel
                  model={model}
                  isSelected={selectedModel === index}
                  onSelect={() => setSelectedModel(index)}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-5 my-2">
            <div className="">
              {model.discount === 0 ? (
                <>
                  <p className="text-highlight font-bold text-xl">
                    {formatMoney(model.price)} 
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
              <span className="text-emerald-600 font-bold">{model.inStock}</span>
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
