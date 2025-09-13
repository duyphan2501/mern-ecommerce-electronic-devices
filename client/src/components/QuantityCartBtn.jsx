import { useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";

const QuantityCartBtn = ({ quan, onUpdate }) => {

  useEffect(() => {
    if (quan < 1) {
      onUpdate(1);
    }
  }, [quan]);

  const handleChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      const num = Number(val);
      const newValue = num < 1 ? 1 : num;
      onUpdate(newValue);
    }
  };

  return (
    <div className="flex gap-1 items-center">
      <div
        className="size-9 rounded-full font-black bg-gray-100 border border-gray-200 flex justify-center items-center cursor-pointer hover:bg-gray-300"
        onClick={() => onUpdate(quan - 1)}
      >
        <FaMinus />
      </div>
      <input
        className="size-9 text-center outline-0"
        value={quan}
        onChange={(e) => handleChange(e)}
      />
      <div
        className="size-9 rounded-full font-black bg-gray-100 border border-gray-200 flex justify-center items-center cursor-pointer hover:bg-gray-300"
        onClick={() => onUpdate(quan + 1)}
      >
        <FaPlus />
      </div>
    </div>
  );
};

export default QuantityCartBtn;
