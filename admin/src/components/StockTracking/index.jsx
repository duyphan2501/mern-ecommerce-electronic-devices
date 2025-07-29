import TextInput from "../BasicInfoProduct/TextInput";
import PriceInput from "../Pricing/PriceInput";

const StockTracking = ({ product, handleChangeValue, index = 0 }) => {
  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="sm:flex items-center gap-5">
          <div className="flex-1">
            <p className="font-semibold mb-1">Unit</p>
            <TextInput
              placeholder="Enter Unit"
              value={product?.models?.[index]?.unit || ""}
              onChange={(val) => handleChangeValue("unit", index, val)}
            />
          </div>
          <div className="flex-1 mt-5 sm:mt-0">
            <p className="font-semibold mb-1">Stock Quantity</p>
            <PriceInput
              label=""
              productValue={product?.models?.[index]?.stockQuantity || 0}
              setProductValue={(val) => handleChangeValue("stockQuantity", index, val)}
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex-1">
            <p className="font-semibold mb-1">Expected Quantity</p>
            <PriceInput
              label=""
              productValue={product?.models?.[index]?.expectedQuantity || 0}
              setProductValue={(val) => handleChangeValue("expectedQuantity", index, val)}
            />
             
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1">Minimum Quantity</p>
            <PriceInput
              label=""
              productValue={product?.models?.[index]?.minimumQuantity || 0}
              setProductValue={(val) => handleChangeValue("minimumQuantity", index, val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTracking;
