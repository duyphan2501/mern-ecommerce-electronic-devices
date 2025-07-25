import { useRef, useState } from "react";

const PriceInput = ({ label, disable=false }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const handleChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      const num = Number(val);
      setValue(num < 1 ? "" : num);
    }
  };

  return ( 
    <div className={`rounded-lg bg-gray-100 p-3 flex items-center ${label && "gap-2"} focus-within:outline-2 focus-within:outline-blue-500 ${disable &&"bg-gray-300 pointer-events-none"}`} onClick={() => inputRef.current.focus()}>
      <span className="text-nowrap text-gray-400">{label}</span>
      <input
        type="text" 
        value={value}
        className="bg-transparent outline-none w-full"
        onChange={handleChange}
        ref={inputRef}
        disabled={disable}
      />
    </div>
  );
};

export default PriceInput;
