import PriceInput from "./PriceInput";

const Pricing = () => {
  return (
    <div>
      <div className="flex flex-col gap-5 mt-5">
        <div className="flex justify-between items-center gap-5">
          <div className="flex-1">
            <p className="font-semibold mb-1">Sale Price</p>
            <div className="">
              <PriceInput label={"VNĐ"} />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1">Cost Price</p>
            <div className="">
              <PriceInput label={"VNĐ"} />
            </div>
          </div>
        </div>
        <div className=" flex justify-between items-center gap-5">
          <div className="flex-1">
            <p className="font-semibold mb-1">Discount</p>
            <div className="">
              <PriceInput label={"%"} />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1">Tax</p>
            <div className="">
              <PriceInput label={"%"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
