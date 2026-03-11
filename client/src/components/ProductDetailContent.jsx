import { Rating, Stack } from "@mui/material";
import QuantityButton from "./QuantityButton";
import AddToCartBtn from "./AddToCartBtn";
import { useState } from "react";
import ProductModel from "./ProductModel";
import formatMoney from "../utils/MoneyFormat";
import {
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaFileExcel,
  FaFile,
} from "react-icons/fa";

import { AiFillFileText } from "react-icons/ai";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

const ProductDetailContent = ({ product }) => {
  if (!product) return null;
  const [selectedModelIndex, setSelectedModelIndex] = useState(
    product.selectedModelIndex || 0,
  );
  const model = product.modelsId[selectedModelIndex];

  const discountPrice =
    model.salePrice - model.salePrice * (model.discount / 100);

  const getDocumentIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FaFilePdf />;
      case "doc":
      case "docx":
        return <FaFileWord />;
      case "ppt":
        return <FaFilePowerpoint />;
      case "xlsx":
        return <FaFileExcel />;
      case "txt":
        return <AiFillFileText />;
      default:
        return <FaFile />;
    }
  };
  const [addValue, setAddValue] = useState(1);
  const { addToCart } = useCartStore();
  const userId = useAuthStore.getState().user?._id;

  const handleAddToCart = async () => {
    const cartData = {
      userId,
      modelId: model._id,
      quantity: addValue,
    };
    await addToCart(cartData);
  };

  const formattedPrice = formatMoney(model.salePrice);
  const formattedDiscountPrice = formatMoney(discountPrice);
  return (
    <div className="flex flex-col justify-center h-full pl-6 lg:border-l-2">
      <div className="">
        <div className="flex flex-col justify-between flex-1 gap-2">
          <h4 className="text-2xl text-black font-semibold font-sans mb-2">
            {product.productName}
            {product.hasModels && " - " + model.modelName}
          </h4>
          <h6 className="text-sm">
            Thương hiệu:{" "}
            <a
              className="font-bold text-gray-800 hover:underline"
              href={`/products/${product.brand?.slug}`}
            >
              {product.brand?.name}
            </a>
          </h6>
          <p
            className="w-[95%]"
            dangerouslySetInnerHTML={{ __html: model.specifications }}
          />

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
          {product.hasModels && (
            <>
              <h5 className="font-semibold">Models:</h5>
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
            </>
          )}
          {model.documents.length > 0 && (
            <>
              <p className="font-semibold">Tài liệu kỹ thuật</p>
              <ul>
                {model.documents.map((doc, index) => {
                  // Gọi hàm để lấy link tải chuẩn
                  const downloadUrl = doc.url;
                  const extension = doc.name.split(".").pop().toLowerCase();
                  return (
                    <li
                      key={index}
                      className="flex items-center group bg-gray-50 hover:bg-white border border-gray-200 p-3 rounded-lg transition-all"
                    >
                      {/* Icon Tài liệu */}
                      <div className="text-blue-500 mr-3">
                        {getDocumentIcon(extension)}
                      </div>

                      {/* Thông tin file */}
                      <div className="flex-1 min-w-0">
                        <a
                          href={downloadUrl}
                          className="text-sm text-gray-800 hover:text-blue-600 truncate block"
                        >
                          {doc.name}
                        </a>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}

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
              <span className="text-emerald-600 font-bold">
                {model.stockQuantity}
              </span>
            </div>
          </div>
          <div className="flex gap-5">
            <QuantityButton setNumberValue={setAddValue} />
            <div className="w-fit">
              <AddToCartBtn handleAdd={handleAddToCart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailContent;
