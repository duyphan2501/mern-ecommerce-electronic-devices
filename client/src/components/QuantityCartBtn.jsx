import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";

const QuantityCartBtn = ({ quan, onUpdate }) => {
  const [quantity, setQuantity] = useState(quan);

  useEffect(() => {
    if (quantity < 1) {
      setQuantity(1);
      onUpdate(1);
    }
  }, [quantity]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      const num = Number(val);
      const newValue = num < 1 ? 1 : num;
      onUpdateQuantity(newValue);
    }
  };

  const onUpdateQuantity = (newQuantity) => {
    setQuantity(newQuantity);
    onUpdate(newQuantity);
  };

  return (
    <div className="flex gap-1 items-center">
      <div
        className="size-9 rounded-full font-black bg-gray-100 border border-gray-200 flex justify-center items-center cursor-pointer hover:bg-gray-300"
        onClick={() => onUpdateQuantity(quantity - 1)}
      >
        <FaMinus />
      </div>
      <input
        className="size-9 text-center outline-0"
        value={quantity}
        onChange={(e) => handleChange(e)}
      />
      <div
        className="size-9 rounded-full font-black bg-gray-100 border border-gray-200 flex justify-center items-center cursor-pointer hover:bg-gray-300"
        onClick={() => onUpdateQuantity(quantity + 1)}
      >
        <FaPlus />
      </div>
    </div>
  );
};

export default QuantityCartBtn;
