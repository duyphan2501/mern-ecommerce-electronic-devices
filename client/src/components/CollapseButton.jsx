import { Button } from "@mui/material";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const CollapseButton = ({ title, children }) => {
  const [open, setOpen] = useState(true);

  const handleClickCollapse = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className="w-full">
      <Button
        className="!w-full !justify-between items-center !text-gray-800 !bg-gray-100 hover:!bg-gray-200 transition !capitalize"
        onClick={handleClickCollapse}
      >
        <h4 className="font-semibold font-sans text-[17px] text-gray-800 z-10">{title}</h4>
        <div
          className={`text-black transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        >
          <IoIosArrowDown />
        </div>
      </Button>
      <div className=" overflow-y-scroll my-2 scroll pl-2">
        <div
          className={` transition-all duration-300 ease-in-out 
            ${open ? "max-h-[180px] opacity-100" : "max-h-0 opacity-0"}
        `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default CollapseButton;
