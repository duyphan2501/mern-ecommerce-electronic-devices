import { useRef, useState, useEffect } from "react";

const PriceInput = ({
  label,
  disable = false,
  productValue,
  setProductValue,
  maxValue = 9999999999,
}) => {
  const [value, setValue] = useState(
    typeof productValue === "number" ? productValue.toLocaleString() : ""
  );
  const inputRef = useRef(null);

  // Sync khi productValue từ props thay đổi
  useEffect(() => {
    if (typeof productValue === "number") {
      setValue(productValue.toLocaleString());
    } else {
      setValue("");
    }
  }, [productValue]);

  const handleChange = (e) => {
    const val = e.target.value.replaceAll(",", "");
    if (/^\d*$/.test(val)) {
      const num = Number(val);

      if (num < 0 || num > maxValue) {
        return;
      }
      setValue(num.toLocaleString());
      setProductValue(num);
    }
  };

  return (
    <div
      className={`rounded-lg bg-gray-100 p-3 flex items-center ${
        label && "gap-2"
      } focus-within:outline-2 focus-within:outline-blue-500 ${
        disable && "bg-gray-300 pointer-events-none"
      }`}
      onClick={() => inputRef.current.focus()}
    >
      {label && <span className="text-nowrap text-gray-400">{label}</span>}
      <input
        type="text"
        value={value}
        className={`bg-transparent outline-none w-full ${
          disable && "text-gray-400"
        }`}
        onChange={handleChange}
        ref={inputRef}
        disabled={disable}
      />
    </div>
  );
};

export default PriceInput;
