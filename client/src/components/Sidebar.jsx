import { useState } from "react";
import Slider from "@mui/material/Slider";
import CollapseButton from "./CollapseButton";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useEffect } from "react";
import useCategoryStore from "../store/categoryStore";
import useBrandStore from "../store/brandStore";
import CategoryItem from "./CategoryItem";
import formatMoney from "../utils/MoneyFormat";
import { useParams } from "react-router-dom";
import useProductStore from "../store/productStore";

const Sidebar = ({ filter, handleChangeFilter }) => {
  const { getAllBrands } = useBrandStore();
  const { getListOfCategories } = useCategoryStore();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [value, setValue] = useState([filter.minPrice, filter.maxPrice]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    handleChangeFilter("minPrice", newValue[0]);
    handleChangeFilter("maxPrice", newValue[1]);
  };

  const handleCheckBoxChange = (event, field, value) => {
    const isChecked = event.target.checked;
    const current = filter[field] || [];

    let updated;
    if (isChecked) {
      updated = [...current, value];
    } else {
      updated = current.filter((id) => id !== value);
    }

    handleChangeFilter(field, updated);
  };

  const fetchData = async () => {
    const [categoriesList, brands] = await Promise.allSettled([
      getListOfCategories(),
      getAllBrands(),
    ]);
    setCategories(categoriesList.value);
    setBrands(brands.value);
  };

  const { categorySlug, brandSlug } = useParams();
  const findCategoryIdBySlug = (categories, slug) => {
    for (const cate of categories) {
      if (cate.slug === slug) return cate._id;

      if (cate.children?.length) {
        const found = findCategoryIdBySlug(cate.children, slug);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    const setLoading = useProductStore.getState().setLoading;
    if (categorySlug) {
      setLoading(true);
      const cateId = findCategoryIdBySlug(categories, categorySlug);
      if (cateId) handleChangeFilter("categoryIds", [cateId]);
    } else if (brandSlug) {
      setLoading(true);
      const brandId = brands.find((brand) => brand.slug === brandSlug)?._id;
      if (brandId) handleChangeFilter("brandIds", [brandId]);
    }
  }, [categorySlug, brandSlug, categories, brands]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="">
      <div className="sidebar flex lg:flex-col justify-center lg:gap-2 gap-5 lg:sticky">
        <CollapseButton title={"Danh mục"}>
          <FormGroup>
            {/* Duyệt qua các danh mục cấp cha (parent level) */}
            {categories?.map((category) => (
              <CategoryItem
                key={category._id}
                category={category}
                handleChange={handleCheckBoxChange}
                listChecked={filter.categoryIds || []}
              />
            ))}
          </FormGroup>
        </CollapseButton>
        <CollapseButton title={"Thương hiệu"}>
          <FormGroup>
            {brands.map((item) => {
              return (
                <FormControlLabel
                  key={item._id}
                  control={
                    <Checkbox
                      onChange={(e) =>
                        handleCheckBoxChange(e, "brandIds", item._id)
                      }
                      checked={filter.brandIds?.includes(item._id) || false}
                    />
                  }
                  label={item.name}
                />
              );
            })}
          </FormGroup>
        </CollapseButton>
      </div>
      <div className="">
        <h4 className="font-semibold font-sans text-[17px] text-gray-800 ml-2">
          Khoảng giá
        </h4>
        <div className="px-3">
          <Slider
            value={value}
            onChange={handleChange}
            min={0}
            max={10000000}
            step={10000}
          />
          <div className="flex font-sans">
            <div className="text-sm">
              Từ
              <span className="text-black font-semibold money">
                {" "}
                {formatMoney(value[0])}
              </span>
            </div>
            <div className="text-sm ml-auto">
              Đến
              <span className="text-black font-semibold money">
                {" "}
                {formatMoney(value[1])}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
