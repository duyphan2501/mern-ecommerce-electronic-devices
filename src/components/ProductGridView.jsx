import { Button, IconButton, Pagination, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import ProductCard from "./ProductCard";
import ProductListShape from "./ProductListShape";
import { CgMenuGridR } from "react-icons/cg";

const product = {
  image1:
    "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png",
  image2:
    "https://powertech.vn/thumbs/540x540x2/upload/product/thiet-ke-chua-co-ten-3496.png",
  name: "Inverter Dye Hydrid 3kw",
  price: 1000000,
  discount: 20,
  isNew: true,
  rating: 4.5,
};

const ProductGridView = () => {
  const [openSort, setOpenSort] = useState(false);
  const [view, setView] = useState(0); // 0 for grid, 1 for list
  const sortRef = useRef(null);

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
            {Array.from({ length: 10 }).map((_,id) => {
              return (
                <div className="" key={id}>
                  <ProductCard
                    image1={product.image1}
                    image2={product.image2}
                    name={product.name}
                    rating={product.rating}
                    isNew={product.isNew}
                    discount={product.discount}
                    price={product.price}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 10 }).map((_,id) => {
              return (
                <div className="" key={id}>
                  <ProductListShape
                    image1={product.image1}
                    image2={product.image2}
                    name={product.name}
                    rating={product.rating}
                    isNew={product.isNew}
                    discount={product.discount}
                    price={product.price}
                    description={
                      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book."
                    }
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
