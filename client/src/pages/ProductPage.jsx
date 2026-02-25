import { useEffect, useRef, useState } from "react";
import ProductGridView from "../components/ProductGridView";
import Sidebar from "../components/Sidebar";
import { Button, Pagination, Stack } from "@mui/material";
import useProductStore from "../store/productStore";
import useDebounce from "../hooks/useDebouce";
const sortOptions = [
  { value: "createdAt_desc", label: "Mới nhất" },
  { value: "name_asc", label: "Tên, A-Z" },
  { value: "name_desc", label: "Tên, Z-A" },
  { value: "price_asc", label: "Giá, thấp đến cao" },
  { value: "price_desc", label: "Giá, cao đến thấp" },
];
const ProductPage = () => {
  const [filter, setFilter] = useState({
    categoryIds: [],
    brandIds: [],
    minPrice: 0,
    maxPrice: 20000000,
  });
  const [openSort, setOpenSort] = useState(false);
  const [totalPages, setTotalPages] = useState(10);
  const [products, setProducts] = useState([]);
  const [limit, setLimit] = useState(8);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(sortOptions[0]);
  const [category, setCategory] = useState("");

  const handleChangeFilter = (field, value) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSetSortBy = (option) => {
    setSortBy(option);
    setOpenSort(false);
  };

  const sortRef = useRef(null);
  const { fetchProducts, isLoading } = useProductStore();

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

  const debouncedFilter = useDebounce(filter, 500);

  const fetchProductsAPI = async (page, limit, sortOption, filterParams) => {
    const { products, totalPages } = await fetchProducts(
      page,
      limit,
      sortOption,
      filterParams,
    );
    setProducts(products);
    setTotalPages(totalPages);
  };

  useEffect(() => {
    fetchProductsAPI(currentPage, limit, sortBy.value, debouncedFilter);
  }, [currentPage, sortBy, limit, debouncedFilter]);

  const handleOpenSort = () => {
    setOpenSort((prev) => !prev);
  };

  const handleChangeView = (newView) => {
    setView(newView);
  };

  return (
    <main className="bg-white">
      <section className="lg:flex container gap-4 py-5">
        <div className="lg:w-1/5 bg-white lg:sticky top-35 self-start mb-5">
          <Sidebar filter={filter} handleChangeFilter={handleChangeFilter} />
        </div>
        <div className="lg:w-4/5 ">
          <div>
            <div className="rounded bg-gray-100 flex justify-between items-center p-2">
              <div className="flex items-center">
                <span className="ml-2 text-[15px]">
                  Có {isLoading ? "0" : products?.length} sản phẩm
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="">Sắp xếp theo:</div>
                <div className="relative " ref={sortRef}>
                  <Button
                    className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans"
                    onClick={handleOpenSort}
                  >
                    {sortBy.label}
                  </Button>
                  <ul
                    className={`absolute p-2 bg-white shadow-lg rounded-lg z-100 text-nowrap w-[150px] ${
                      !openSort
                        ? "top-1/2 opacity-0 invisible -right-2"
                        : "top-[100%] opacity-100 visible right-0"
                    } transition-all`}
                  >
                    {sortOptions.map((opt) => (
                      <li className="" key={opt.value}>
                        <Button
                          className="!capitalize !text-black !font-semibold !bg-white !text-sm !font-sans !w-full !text-left !block hover:!bg-gray-100 transition-none"
                          onClick={() => handleSetSortBy(opt)}
                        >
                          {opt.label}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="my-4">
            <ProductGridView products={products} isLoading={isLoading} />
          </div>
          <div className="flex justify-center items-center my-6">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                page={currentPage}
                showFirstButton
                showLastButton
                onChange={handlePageChange}
              />
            </Stack>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
