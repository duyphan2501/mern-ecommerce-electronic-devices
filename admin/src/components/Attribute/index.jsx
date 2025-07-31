import { FormControlLabel, Switch } from "@mui/material";
import PriceInput from "../Pricing/PriceInput";
import AttributeSelect from "./AttributeSelect";
import { useState } from "react";

const Attribute = ({ product, handleChangeValue }) => {
  const categories = [
    { id: "660ef98c8b0f2e23d8ccfe71", name: "Color" },
    { id: "660ef98c8b0f2e23d8ccfe72", name: "Size" },
    { id: "660ef98c8b0f2e23d8ccfe73", name: "Material" },
    { id: "660ef98c8b0f2e23d8ccfe74", name: "Brand" },
    { id: "660ef98c8b0f2e23d8ccfe75", name: "Style" },
    { id: "660ef98c8b0f2e23d8ccfe76", name: "Pattern" },
    { id: "660ef98c8b0f2e23d8ccfe77", name: "Fit" },
    { id: "660ef98c8b0f2e23d8ccfe78", name: "Occasion" },
    { id: "660ef98c8b0f2e23d8ccfe79", name: "Season" },
  ];

  const brands = [
    { id: "660ef98c8b0f2e23d8ccfe71", name: "Nike" },
    { id: "660ef98c8b0f2e23d8ccfe72", name: "Adidas" },
    { id: "660ef98c8b0f2e23d8ccfe73", name: "Puma" },
    { id: "660ef98c8b0f2e23d8ccfe74", name: "Reebok" },
  ];

  const status = [
    { id: "draft", name: "Draft" },
    { id: "active", name: "Active" },
    { id: "archived", name: "Archived" },
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
              selectedItemId={product?.categoryId}
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
