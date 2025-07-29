import { FormControlLabel, Switch } from "@mui/material";
import PriceInput from "../Pricing/PriceInput";
import AttributeSelect from "./AttributeSelect";
import { useState } from "react";

const Attribute = ({ product, handleChangeValue }) => {
  const categories = [
    { id: 1, name: "Color" },
    { id: 2, name: "Size" },
    { id: 3, name: "Material" },
    { id: 4, name: "Brand" },
    { id: 5, name: "Style" },
    { id: 6, name: "Pattern" },
    { id: 7, name: "Fit" },
    { id: 8, name: "Occasion" },
    { id: 9, name: "Season" },
  ];

  const brands = [
    { id: 1, name: "Nike" },
    { id: 2, name: "Adidas" },
    { id: 3, name: "Puma" },
    { id: 4, name: "Reebok" },
  ];

  const status = [
    { id: 1, name: "Draft" },
    { id: 2, name: "Active" },
    { id: 3, name: "Archived" },
  ];

  const handleChangeSwitch = () => {
    setIsFreeShipping(!isFreeShipping);
    if (isFreeShipping) handleChangeValue("shippingCost", 0);
  };

  const [isFreeShipping, setIsFreeShipping] = useState(
    product?.shippingCost === 0 ? true : false
  );

  return (
    <div>
      <h3 className="font-bold text-xl">Attribute Information</h3>
      <div className="flex flex-col gap-5 mt-5">
        <div className="">
          <p className="font-semibold">Category</p>
          <div className="mt-1">
            <AttributeSelect
              selectItems={categories}
              onChange={(val) => handleChangeValue("categoryId", val)}
              selectedItem={product?.categoryId}
            />
          </div>
        </div>
        <div className="">
          <p className="font-semibold">Brand</p>
          <div className="mt-1">
            <AttributeSelect
              selectItems={brands}
              onChange={(val) => handleChangeValue("brandId", val)}
              selectedItem={product?.brandId}
            />
          </div>
        </div>
        <div className="">
          <p className="font-semibold">Status</p>
          <div className="mt-1">
            <AttributeSelect
              selectItems={status}
              onChange={(val) => handleChangeValue("status", val)}
              selectedItem={product?.status}
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
