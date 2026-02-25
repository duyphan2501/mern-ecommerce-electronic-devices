import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { HiOutlineArrowsExpand } from "react-icons/hi";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Link } from "react-router-dom";
import AddToCartBtn from "./AddToCartBtn";
import MyContext from "../Context/MyContext";
import { useContext, useState, useMemo, useCallback } from "react";
import formatMoney from "../utils/MoneyFormat";
import ProductModel from "./ProductModel";
import { IoMdArrowDropdown } from "react-icons/io";
import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

const ProductCard = ({ product }) => {
  console.log("ProductCard ~ product:", product);
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const selectedModel = product.modelsId[selectedModelIndex];
  const { openModal, setSelectedProduct } = useContext(MyContext);
  const { addToCart } = useCartStore();

  // ⚡ Memo hóa giá, format, isNew
  const discountPrice = useMemo(
    () =>
      selectedModel.salePrice -
      selectedModel.salePrice * (selectedModel.discount / 100),
    [selectedModel.salePrice, selectedModel.discount],
  );

  const formattedPrice = useMemo(
    () => formatMoney(selectedModel.salePrice),
    [selectedModel.salePrice],
  );

  const formattedDiscountPrice = useMemo(
    () => formatMoney(discountPrice),
    [discountPrice],
  );

  const isNew = useMemo(() => {
    return (
      (Date.now() - new Date(selectedModel.createdAt).getTime()) /
        (1000 * 60 * 60 * 24) <
      7
    );
  }, [selectedModel.createdAt]);

  // ⚡ Tách hàm để tránh tạo lại trong render
  const handleSelectModel = useCallback((index) => {
    setSelectedModelIndex(index);
    setIsOpen(false);
  }, []);

  const setProductDetail = useCallback(() => {
    setSelectedProduct({ ...product, selectedModelIndex });
  }, [product, selectedModelIndex, setSelectedProduct]);

  const handleViewMore = useCallback(() => {
    setProductDetail();
    openModal();
  }, [setProductDetail, openModal]);

  const handleAddToCart = async () => {
    const userId = useAuthStore.getState().user?._id;
    const cartData = {
      userId,
      modelId: selectedModel._id,
      quantity: 1,
    };
    await addToCart(cartData);
  };

  if (!product) return null;

  return (
    <div className="productCard border-1 border-gray-200 rounded-md p-2 flex flex-col h-full shadow">
      <div className="relative group h-[200px] overflow-hidden">
        <Link
          to={`/product/detail/${product.productUrl}`}
          onClick={setProductDetail}
        >
          <img
            src={product.images[0]}
            alt={product.productName}
            loading="lazy" // ✅ lazy load ảnh
            className="w-full object-contain h-full rounded-md"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={product.productName}
              loading="lazy"
              className="w-full object-contain h-full rounded-md absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out cursor-pointer group-hover:scale-105"
            />
          )}
        </Link>
        <Tooltip title="Xem thêm" placement="top" arrow>
          <IconButton
            variant="text"
            className="!w-[35px] !h-[35px] !rounded-full !bg-gray-200 !text-black !absolute right-0 hover:!bg-[#0d68f3] hover:!text-white top-[-30px] opacity-0 group-hover:top-1 group-hover:opacity-100 z-50 !transition-all !duration-100"
            onClick={handleViewMore}
          >
            <HiOutlineArrowsExpand size={20} />
          </IconButton>
        </Tooltip>
        {isNew && (
          <span className="px-2 rounded-xl bg-secondary text-white absolute top-1">
            New!
          </span>
        )}
      </div>

      <div className="flex flex-col justify-between flex-1">
        <div>
          <h4 className="line-clamp-2 font-[600]">
            {product.productName} - {selectedModel.modelName}
          </h4>
          <Stack spacing={1}>
            <Rating
              size="small"
              name="half-rating"
              defaultValue={selectedModel.rating || 5}
              precision={0.5}
              readOnly
            />
          </Stack>

          <div className="my-2 flex justify-between items-center">
            <div>
              {selectedModel.discount === 0 ? (
                <p className="font-bold">{formattedPrice}</p>
              ) : (
                <>
                  <p className="text-highlight font-bold text-lg">
                    {formattedDiscountPrice}
                  </p>
                  <span className="rounded-lg bg-gray-100 text-sm text-black p-1">
                    -{selectedModel.discount}%
                  </span>
                  <span className="ml-2 text-[13px] line-through align-text-top">
                    {formattedPrice}
                  </span>
                </>
              )}
            </div>

            {/* ✅ Dropdown chỉ render khi mở */}
            {product?.modelsId?.length > 1 && (
              <div>
                <Tooltip title="Model khác" placement="bottom" arrow>
                  <IconButton
                    className="!bg-gray-100 !p-1 hover:!bg-gray-200 relative"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <IoMdArrowDropdown
                      size={25}
                      className={`${
                        isOpen ? "-rotate-180" : "rotate-0"
                      } transition-transform`}
                    />
                    {isOpen && (
                      <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto absolute w-max bg-white p-3 border border-gray-200 shadow rounded-lg  bottom-[115%]">
                        {product.modelsId.map((model, index) => (
                          <ProductModel
                            key={model._id}
                            model={model}
                            isSelected={selectedModelIndex === index}
                            onSelect={() => handleSelectModel(index)}
                          />
                        ))}
                      </div>
                    )}
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
        </div>

        <AddToCartBtn handleAdd={handleAddToCart} />
      </div>
    </div>
  );
};

export default ProductCard;
