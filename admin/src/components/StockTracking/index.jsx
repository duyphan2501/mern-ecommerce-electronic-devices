import TextInput from "../BasicInfoProduct/TextInput";
import PriceInput from "../Pricing/PriceInput";

const StockTracking = () => {
  return (
    <div>
      <h3 className="font-bold text-xl">Stock Tracking</h3>
      <div className="flex flex-col gap-5 mt-5">
        <div className="sm:flex items-center gap-5">
          <div className="flex-1">
            <p className="font-semibold mb-1">SKU</p>
            <TextInput placeholder={"Enter SKU"} />
          </div>
          <div className="flex-1 mt-5 sm:mt-0">
            <p className="font-semibold mb-1">Stock Quantity</p>
            <PriceInput label={""} />
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex-1">
            <p className="font-semibold mb-1">Expected Quantity</p>
            <PriceInput label={""} />
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1">Minimum Quantity</p>
            <PriceInput label={""} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTracking;
