import { useEffect, useMemo, useRef, useState } from "react";
import ProductGridView from "../components/ProductGridView";
import Sidebar from "../components/Sidebar";
import { Button, Pagination, Stack } from "@mui/material";
import useProductStore from "../store/productStore";
import useDebounce from "../hooks/useDebounce";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import useCategoryStore from "../store/categoryStore";
import useBrandStore from "../store/brandStore";
import MetaSEO from "../components/MetaSEO";
const sortOptions = [
  { value: "createdAt_desc", label: "Mới nhất" },
  { value: "name_asc", label: "Tên, A-Z" },
  { value: "name_desc", label: "Tên, Z-A" },
  { value: "price_asc", label: "Giá, thấp đến cao" },
  { value: "price_desc", label: "Giá, cao đến thấp" },
];
const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { fetchProducts, isLoading, setLoading } = useProductStore();
  const { categoryList } = useCategoryStore();
  const { brandList } = useBrandStore();

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [openSort, setOpenSort] = useState(false);
  const sortRef = useRef(null);

  // 1. Lấy params từ URL
  const currentPage = Number(searchParams.get("page")) || 1;
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 20000000;
  const sortValue = searchParams.get("sort") || "createdAt_desc";
  const sortBy =
    sortOptions.find((opt) => opt.value === sortValue) || sortOptions[0];

  // 2. Parse Slug thành ID (Dùng useMemo để tối ưu hiệu năng)
  const filter = useMemo(() => {
    if (!slug)
      return {
        categoryIds: [],
        brandIds: [],
        minPrice,
        maxPrice,
      };

    const decoded = decodeURIComponent(slug);
    const [brandPart, categoryPart] = decoded.split("_");

    const brandSlugs = brandPart === "all" ? [] : brandPart.split("|");
    const categorySlugs = categoryPart === "all" ? [] : categoryPart.split("|");

    const brandIds = brandList
      .filter((b) => brandSlugs.includes(b.slug))
      .map((b) => b._id);

    const findIds = (list, targetSlugs, result = []) => {
      list.forEach((item) => {
        if (targetSlugs.includes(item.slug)) result.push(item._id);
        if (item.children) findIds(item.children, targetSlugs, result);
      });
      return result;
    };

    return {
      categoryIds: findIds(categoryList, categorySlugs),
      brandIds,
      minPrice,
      maxPrice,
    };
  }, [slug, categoryList, brandList, minPrice, maxPrice]);

  const debouncedFilter = useDebounce(filter, 400);

  // 3. Fetch Data
  useEffect(() => {
    const fetchAPI = async () => {
      setLoading(true);
      const res = await fetchProducts(
        currentPage,
        8,
        sortBy.value,
        debouncedFilter,
      );
      if (res) {
        setProducts(res.products);
        setTotalPages(res.totalPages);
      }
      setLoading(false);
    };
    if (categoryList.length > 0) fetchAPI();
  }, [currentPage, sortBy.value, debouncedFilter, categoryList]);

  // 4. Xử lý thay đổi filter từ Sidebar (Chuyển thành thay đổi URL)
  const handleChangeFilter = (field, value) => {
    const params = new URLSearchParams(searchParams);

    // Xử lý giá
    if (field === "priceRange") {
      params.set("minPrice", value.min);
      params.set("maxPrice", value.max);
      params.set("page", "1");
      setSearchParams(params);
      return;
    }

    let brandSlugs = [];
    let categorySlugs = [];

    if (field === "brandIds") {
      brandSlugs = brandList
        .filter((b) => value.includes(b._id))
        .map((b) => b.slug);

      // Giữ nguyên category cũ từ filter state
      categorySlugs = categoryList
        .flatMap((c) => [c, ...(c.children || [])])
        .filter((c) => filter.categoryIds.includes(c._id))
        .map((c) => c.slug);
    }

    if (field === "categoryIds") {
      categorySlugs = categoryList
        .flatMap((c) => [c, ...(c.children || [])])
        .filter((c) => value.includes(c._id))
        .map((c) => c.slug);

      brandSlugs = brandList
        .filter((b) => filter.brandIds.includes(b._id))
        .map((b) => b.slug);
    }

    const brandPart = brandSlugs.length > 0 ? brandSlugs.join("|") : "all";
    const categoryPart =
      categorySlugs.length > 0 ? categorySlugs.join("|") : "all";

    const queryString = params.toString();
    navigate(
      `/products/${brandPart}_${categoryPart}${queryString ? `?${queryString}` : ""}`,
    );
  };

  const findCategoryName = (list, targetSlugs) => {
    let names = [];
    const search = (items) => {
      items.forEach((item) => {
        if (targetSlugs.includes(item.slug)) names.push(item.name);
        if (item.children) search(item.children);
      });
    };
    search(list);
    return names.join(", ");
  };

  const seoInfo = useMemo(() => {
    if (!slug || brandList.length === 0 || categoryList.length === 0)
      return {
        title: "Thiết bị điện & Năng lượng mặt trời",
        desc: "Cung cấp thiết bị điện năng lượng mặt trời chính hãng.",
        h1: "Tất cả sản phẩm",
      };

    const [brandPart, categoryPart] = decodeURIComponent(slug).split("_");
    const brandSlugs = brandPart === "all" ? [] : brandPart.split("|");
    const categorySlugs = categoryPart === "all" ? [] : categoryPart.split("|");

    const brands = brandList
      .filter((b) => brandSlugs.includes(b.slug))
      .map((b) => b.name)
      .join(", ");

    const categories =
      findCategoryName(categoryList, categorySlugs) || "Thiết bị điện mặt trời";

    return {
      title: `${categories} ${brands ? `- ${brands}` : ""} | SolarTech`,
      desc: `Phân phối ${categories} ${brands ? `thương hiệu ${brands}` : ""} chính hãng. Giải pháp năng lượng mặt trời tối ưu, bảo hành dài hạn tại SolarTech.`,
      h1: brands ? `${categories} ${brands}` : categories,
    };
  }, [slug, brandList, categoryList]);

  const isFiltered = searchParams.get("minPrice") || searchParams.get("sort");
  const BASE_URL = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";
  const canonicalUrl = `${BASE_URL}/${slug || "all_all"}`;

  const handlePageChange = (_, v) => {
    const p = new URLSearchParams(searchParams);
    p.set("page", v);
    setSearchParams(p);
  };

  const handleSetSortBy = (opt) => {
    const p = new URLSearchParams(searchParams);
    p.set("sort", opt.value);
    setSearchParams(p);
    setOpenSort(false);
  };

  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setOpenSort(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <main className="bg-white">
      <MetaSEO
        title={seoInfo.title}
        description={seoInfo.desc}
        url={canonicalUrl}
        noIndex={!!isFiltered}
        products={products}
      />
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
                    onClick={() => setOpenSort(!openSort)}
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
