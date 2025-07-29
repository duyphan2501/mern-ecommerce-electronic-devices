import PriceInput from "./PriceInput";

const Pricing = ({ product, handleChangeValue, index = 0 }) => {
  return (
    <div>
      <div className="flex flex-col gap-5 mt-5">
        <div className="flex justify-between items-center gap-5">
          <div className="flex-1">
            <p className="font-semibold mb-1">Sale Price</p>
            <div className="">
              <PriceInput
                label={"VNĐ"}
                productValue={product?.models?.[index]?.salePrice}
                setProductValue={(val) => handleChangeValue("salePrice", index, val)}
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1">Cost Price</p>
            <div className="">
              <PriceInput
                label={"VNĐ"}
                productValue={product?.models?.[index]?.costPrice}
                setProductValue={(val) => handleChangeValue("costPrice", index, val)}
              />
            </div>
          </div>
        </div>
        <div className=" flex justify-between items-center gap-5">
          <div className="flex-1">
            <p className="font-semibold mb-1">Discount</p>
            <div className="">
              <PriceInput
                label={"%"}
                productValue={product?.models?.[index]?.discount}
                setProductValue={(val) => handleChangeValue("discount", index, val)}
                maxValue={100}
              />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1">Tax</p>
            <div className="">
              <PriceInput
                label={"%"}
                productValue={product?.models?.[index]?.tax}
                setProductValue={(val) => handleChangeValue("tax", index, val)}
                maxValue={100}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
