import { FormControlLabel, Switch } from "@mui/material";
import PriceInput from "../Pricing/PriceInput";
import AttributeSelect from "./AttributeSelect";
import { useState } from "react";
import TreeCategorySelect from "../TreeCategorySelect";
import useCategoryStore from "../../store/categoryStore";
import { useEffect } from "react";
import useBrandStore from "../../store/brandStore";

const Attribute = ({ product, handleChangeValue }) => {
  const [categories, setCategories] = useState([]);
  const { getAllBrands } = useBrandStore();
  const brands = useBrandStore(s => s.brandList)

  const status = [
    { _id: "draft", name: "Draft" },
    { _id: "active", name: "Active" },
    { _id: "archived", name: "Archived" },
  ];

  const handleChangeSwitch = () => {
    setIsFreeShipping(!isFreeShipping);
    if (isFreeShipping) handleChangeValue("shippingCost", 0);
  };

  const [isFreeShipping, setIsFreeShipping] = useState(
    product?.shippingCost === 0 ? true : false,
  );

  const { getAllCategories } = useCategoryStore();

  const fetchCatesAndBrands = async () => {
    const data = await getAllCategories();
    setCategories(data);
    if (brands.length === 0)
      await getAllBrands()
  };

  useEffect(() => {
    fetchCatesAndBrands();
  }, []);

  return (
    <div>
      <h3 className="font-bold text-xl">Attribute Information</h3>
      <div className="flex flex-col gap-5 mt-5">
        <div className="">
          <p className="font-semibold">Category</p>
          <div className="mt-1">
            <TreeCategorySelect
              allCategories={categories} // Data từ API trả về (mảng phẳng)
              selectedIds={product?.categoryIds || []}
              onChange={(val) => handleChangeValue("categoryIds", val)}
            />
          </div>
        </div>
        <div className="">
          <p className="font-semibold">Brand</p>
          <div className="mt-1">
            <AttributeSelect
              selectItems={brands}
              onChange={(val) => handleChangeValue("brandId", val)}
              selectedItemId={product?.brandId}
              allowedNone={true}
            />
          </div>
        </div>
        <div className="">
          <p className="font-semibold">Status</p>
          <div className="mt-1">
            <AttributeSelect
              selectItems={status}
              onChange={(val) => handleChangeValue("status", val)}
              selectedItemId={product?.status}
            />
          </div>
        </div>
        <div className="">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Shipping Cost</p>
            <FormControlLabel
              control={
                <Switch
                  checked={isFreeShipping}
                  onChange={handleChangeSwitch}
                />
              }
              label="Free Ship"
            />
          </div>

          <div className="mt-1">
            <PriceInput
              label={"VNĐ"}
              disable={isFreeShipping}
              productValue={product?.shippingCost}
              setProductValue={(val) => handleChangeValue("shippingCost", val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attribute;
