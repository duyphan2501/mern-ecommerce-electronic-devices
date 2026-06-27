import { useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";

const QuantityCartBtn = ({ quan, onUpdate, disabled = false }) => {

  useEffect(() => {
    if (quan < 1) {
      onUpdate(1);
    }
  }, [quan]);

  const handleChange = (e) => {
    if (disabled) return;
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      const num = Number(val);
      const newValue = num < 1 ? 1 : num;
      onUpdate(newValue);
    }
  };

  return (
    <div className={`flex gap-1 items-center ${disabled ? "opacity-50" : ""}`}>
      <button
        type="button"
        className={`size-9 rounded-full font-black bg-gray-100 border border-gray-200 flex justify-center items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-300"}`}
        onClick={() => !disabled && onUpdate(quan - 1)}
        disabled={disabled}
      >
        <FaMinus />
      </button>
      <input
        className="size-9 text-center outline-0 disabled:bg-gray-100"
        value={quan}
        onChange={handleChange}
        disabled={disabled}
      />
      <button
        type="button"
        className={`size-9 rounded-full font-black bg-gray-100 border border-gray-200 flex justify-center items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-300"}`}
        onClick={() => !disabled && onUpdate(quan + 1)}
        disabled={disabled}
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default QuantityCartBtn;
