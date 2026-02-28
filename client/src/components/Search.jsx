import { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";
import SearchItem from "./SearchItem";
import SearchItemLoading from "./Loading/SearchItemLoading";

import useProductStore from "../store/productStore";
import useCategoryStore from "../store/categoryStore";
import useDebounce from "../hooks/useDebounce";

const Search = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [term, setTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const debouncedSearch = useDebounce(term, 500);

  // product store
  const { searchProducts, getNewProducts, newProducts } = useProductStore();

  // category store
  const { categoryList, getListOfCategories } = useCategoryStore();

  const handleInputChange = (e) => setTerm(e.target.value);

  // 🔥 đảm bảo categories luôn có dữ liệu
  useEffect(() => {
    if (!categoryList || categoryList.length === 0) {
      getListOfCategories();
      return;
    }
    setCategories(categoryList);
  }, [categoryList, getListOfCategories]);

  const fetchNewProducts = async () => {
    setLoading(true);
    const data = await getNewProducts();
    setProducts(data || []);
    setLoading(false);
  };

  const filterCategoriesByName = (categories, keyword) => {
    const result = [];

    for (const cate of categories) {
      const isMatch = cate.name.toLowerCase().includes(keyword.toLowerCase());

      if (isMatch) result.push(cate);

      if (cate.children?.length) {
        result.push(...filterCategoriesByName(cate.children, keyword));
      }
    }

    return result;
  };

  useEffect(() => {
    const run = async () => {
      if (debouncedSearch.trim() === "") {
        setCategories(categoryList || []);

        if (!newProducts || newProducts.length === 0) {
          await fetchNewProducts();
        } else {
          setProducts(newProducts);
        }
        return;
      }

      setLoading(true);

      const res = await searchProducts(debouncedSearch);

      const matchedCategories = filterCategoriesByName(
        categoryList || [],
        debouncedSearch,
      );

      setCategories(
        matchedCategories.length > 0 ? matchedCategories : categoryList,
      );
      setProducts(res || []);
      setLoading(false);
    };

    run();
  }, [debouncedSearch, categoryList, newProducts]);

  return (
    <div className="relative w-full">
      <div className="border border-gray-300 rounded-xl h-12 w-full flex items-center px-3 bg-white focus-within:border-blue-500">
        <IoSearch size={25} className="text-gray-400" />

        <input
          type="text"
          value={term}
          className="ms-2 w-full outline-none text-gray-500"
          onChange={handleInputChange}
          placeholder="Tìm kiếm sản phẩm"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        />

        {term && (
          <div onClick={() => setTerm("")} className="cursor-pointer">
            <TiDelete size={30} className="text-blue-500" />
          </div>
        )}
      </div>

      {isFocused && (
        <div className="absolute top-[110%] left-0 w-full bg-white shadow-xl rounded-b-xl p-5 z-50 flex">
          <div className="w-2/6 hidden lg:block">
            <h4 className="font-semibold mb-2">Gợi ý tìm kiếm</h4>
            <ul className="text-sm text-gray-600">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <li key={i}>
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </li>
                  ))
                : categories.map((c) => (
                    <li key={c._id}>
                      <a href={`/product/category/${c.slug}`}>
                        <div className="p-2 hover:bg-gray-100 cursor-pointer">
                          {c.name}
                        </div>
                      </a>
                    </li>
                  ))}
            </ul>
          </div>

          <div className="lg:w-4/6 w-full">
            <h4 className="font-semibold mb-2">Sản phẩm</h4>
            <ul className="text-sm text-gray-600">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <li key={i}>
                      <SearchItemLoading />
                    </li>
                  ))
                : products.map((p) => (
                    <li key={p._id}>
                      <SearchItem product={p} />
                    </li>
                  ))}

              {!loading && products.length === 0 && (
                <div className="text-gray-400 text-sm">
                  Không tìm thấy sản phẩm
                </div>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
