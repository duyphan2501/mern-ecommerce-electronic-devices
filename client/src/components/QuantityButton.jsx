import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { IoMdArrowDropup } from "react-icons/io";

const QuantityButton = ({ setNumberValue }) => {
  const [quantity, setQuantity] = useState("1");

  const handleChangeQuantity = (event) => {
    setQuantity(event.target.value);
  };

  useEffect(() => {
    if (isNaN(parseInt(quantity))) {
      setQuantity("1");
      setNumberValue(1);
    } else {
      setNumberValue(Number(quantity));
    }
  }, [quantity]);

  const handleKeyPress = (event) => {
    // Cho phép các phím điều khiển
    const controlKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];

    if (!/[0-9]/.test(event.key) && !controlKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  const increaseQuantity = () => {
    let newQuan = parseInt(quantity) + 1 || 0;
    setQuantity(newQuan.toString());
  };

  const descreaseQuantity = () => {
    let newQuan = (parseInt(quantity) || 0) - 1;
    if (newQuan < 1) newQuan = 1;
    setQuantity(newQuan.toString());
  };

  return (
    <div className="flex border-2 rounded-md w-20 h-10 overflow-hidden">
      <input
        type="text"
        className=" w-13 p-3 h-full outline-0"
        value={quantity}
        onChange={handleChangeQuantity}
        onKeyDown={handleKeyPress}
        title={quantity}
      />
      <div className="flex flex-col item-center h-full">
        <Button
          className="!p-0 !min-w-[30px] !w-[30px] !rounded-none"
          onClick={increaseQuantity}
        >
          <IoMdArrowDropup size={20} className="text-black" />
        </Button>
        <Button
          className="!p-0 !min-w-[30px] !w-[30px] !rounded-none"
          onClick={descreaseQuantity}
        >
          <IoMdArrowDropup size={20} className="rotate-180 text-black" />
        </Button>
      </div>
    </div>
  );
};

export default QuantityButton;
