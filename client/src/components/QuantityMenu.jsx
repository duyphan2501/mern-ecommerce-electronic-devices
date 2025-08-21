import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

const QuantityMenu = ({ quantity, handleChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(quantity);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSelectItem = (value) => {
    const currentValue = selectedQuantity;
    setSelectedQuantity(value);
    try {
      handleChange(value);
    } catch (error) {
      selectedQuantity(currentValue);
      console.error("Failed to update quantity:", error);
    }
    setAnchorEl(null);
  };

  return (
    <div className="">
      <span
        className="px-1 flex items-center gap-1 rounded-md cursor-pointer hover:bg-gray-300 bg-gray-200 "
        onClick={handleClick}
      >
        S.L: {selectedQuantity} <IoMdArrowDropdown />
      </span>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        onChange={handleChange}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <MenuItem
            key={index}
            onClick={() => handleSelectItem(index + 1)}
            className="!text-sm"
          >
            {index + 1}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default QuantityMenu;
