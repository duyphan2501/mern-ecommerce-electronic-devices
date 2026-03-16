import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import useCategoryStore from "../store/categoryStore";
import useBrandStore from "../store/brandStore";
import CategoryItem from "./CategoryItem";
import CollapseButton from "./CollapseButton";
import formatMoney from "../utils/MoneyFormat";

const Sidebar = ({ filter, handleChangeFilter }) => {
  const { brandList, getAllBrands } = useBrandStore();
  const { categoryList, getListOfCategories } = useCategoryStore();

  // Local state cho Slider để kéo mượt hơn (chỉ submit khi dừng - dùng debounce ở cha)
  const [priceRange, setPriceRange] = useState([
    filter.minPrice,
    filter.maxPrice,
  ]);

  useEffect(() => {
    if (categoryList.length === 0) getListOfCategories();
    if (brandList.length === 0) getAllBrands();
  }, []);

  // Đồng bộ slider khi filter từ URL thay đổi
  useEffect(() => {
    if (
      filter.minPrice !== priceRange[0] ||
      filter.maxPrice !== priceRange[1]
    ) {
      setPriceRange([filter.minPrice, filter.maxPrice]);
    }
  }, [filter.minPrice, filter.maxPrice]);

  const handleSliderChangeLocal = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleSliderChangeCommitted = (event, newValue) => {
  handleChangeFilter("priceRange", { min: newValue[0], max: newValue[1] });
};

  const handleCheckbox = (event, field, id) => {
    const currentIds = filter[field] || [];
    const updatedIds = event.target.checked
      ? [...currentIds, id]
      : currentIds.filter((i) => i !== id);
    handleChangeFilter(field, updatedIds);
  };

  return (
    <div className="">
      <div className="sidebar flex lg:flex-col justify-center lg:gap-2 gap-5 lg:sticky">
        <CollapseButton title={"Danh mục"}>
          <FormGroup>
            {/* Duyệt qua các danh mục cấp cha (parent level) */}
            {categoryList?.map((category) => (
              <CategoryItem
                key={category._id}
                category={category}
                handleChange={handleCheckbox}
                listChecked={filter.categoryIds || []}
              />
            ))}
          </FormGroup>
        </CollapseButton>
        <CollapseButton title={"Thương hiệu"}>
          <FormGroup>
            {brandList.map((item) => {
              return (
                <FormControlLabel
                  key={item._id}
                  control={
                    <Checkbox
                      onChange={(e) => handleCheckbox(e, "brandIds", item._id)}
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
            value={priceRange}
            onChange={handleSliderChangeLocal}
            onChangeCommitted={handleSliderChangeCommitted}
            min={0}
            max={10000000}
            step={10000}
          />
          <div className="flex font-sans">
            <div className="text-sm">
              Từ
              <span className="text-black font-semibold money">
                {" "}
                {formatMoney(priceRange[0])}
              </span>
            </div>
            <div className="text-sm ml-auto">
              Đến
              <span className="text-black font-semibold money">
                {" "}
                {formatMoney(priceRange[1])}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
