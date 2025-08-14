import { Button, IconButton, Pagination, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import ProductCard from "./ProductCard";
import ProductListShape from "./ProductListShape";
import { CgMenuGridR } from "react-icons/cg";
import useProductStore from "../store/productStore";

const ProductGridView = () => {
  const [openSort, setOpenSort] = useState(false);
  const [products, setProducts] = useState([]);
  const [view, setView] = useState(0); // 0 for grid, 1 for list
  const sortRef = useRef(null);
  const { getAllProducts } = useProductStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setOpenSort(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProduct = await getAllProducts();
        setProducts(fetchedProduct);
        console.log(fetchedProduct);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const handleOpenSort = () => {
    setOpenSort((prev) => !prev);
  };

  const handleChangeView = (newView) => {
    setView(newView);
  };

  return (
    <div>
      <div className="rounded bg-gray-100 flex justify-between items-center p-2">
        <div className="flex items-center">
          <IconButton
            variant="text"
            className={`!size-[40px] !min-w-[40px] !rounded-full  !text-black hover:!bg-gray-200 !transition ${
              view === 0 ? "!bg-gray-200" : ""
            }`}
            onClick={() => handleChangeView(0)}
          >
            <CgMenuGridR size={15} className="pointer-events-none" />
          </IconButton>
          <IconButton
            variant="text"
            className={`!size-[40px] !min-w-[40px]!rounded-full  !text-black hover:!bg-gray-200 !transition ${
              view === 1 ? "!bg-gray-200" : ""
            }`}
            onClick={() => handleChangeView(1)}
          >
            <GiHamburgerMenu size={15} className="pointer-events-none" />
          </IconButton>

          <span className="ml-2 text-[15px]">Có 35 sản phẩm</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="">Sắp xếp theo:</div>
          <div className="relative " ref={sortRef}>
            <Button
              className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans"
              onClick={handleOpenSort}
            >
              Tên, A-Z
            </Button>
            <ul
              className={`absolute p-2 bg-white shadow-lg rounded-lg z-100 text-nowrap w-[150px] ${
                !openSort
                  ? "top-1/2 opacity-0 invisible -right-2"
                  : "top-[100%] opacity-100 visible right-0"
              } transition-all`}
            >
              <li className="">
                <Button className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans !w-full !text-left !block hover:!bg-gray-100 transition-none">
                  Tên, A-Z
                </Button>
              </li>
              <li className="">
                <Button className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans !w-full !text-left !block hover:!bg-gray-100 transition-none">
                  Tên, Z-A
                </Button>
              </li>
              <li className="">
                <Button className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans !w-full !text-left !block hover:!bg-gray-100 transition-none">
                  Giá, thấp đến cao
                </Button>
              </li>
              <li className="">
                <Button className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans !w-full !text-left !block hover:!bg-gray-100 transition-none">
                  Giá, cao đến thấp
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="my-4">
        {view === 0 ? (
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
            {products && products.map((product) => {
              return (
                <div className="" key={product._id}>
                  <ProductCard
                    product={product}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {products.map((product) => {
              const isNew =
                (Date.now() - product.create_at) / (1000 * 60 * 60 * 24) < 7;
              return (
                <div className="" key={product._id}>
                  <ProductListShape
                    image1={product.images[0]}
                    image2={product.images[1]}
                    name={product.productName}
                    rating={product.rating || 5}
                    isNew={isNew}
                    discount={product.modelsId[0]?.discount}
                    price={product.modelsId[0]?.salePrice}
                    description={product.description}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="flex justify-center items-center my-6">
        <Stack spacing={2}>
          <Pagination count={10} showFirstButton showLastButton />
        </Stack>
      </div>
      <div />
    </div>
  );
};

export default ProductGridView;
