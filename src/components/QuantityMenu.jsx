import { Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";

const QuantityMenu = ({ quantity }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="">
      <span
        className="px-1 flex items-center gap-1 rounded-md cursor-pointer hover:bg-gray-300 bg-gray-200 "
        onClick={handleClick}
      >
        S.L: {quantity} <IoMdArrowDropdown />
      </span>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => 
          <MenuItem key={index} onClick={handleClose} className="!text-sm">{index+1}</MenuItem>
        )}
      </Menu>
    </div>
  );
};

export default QuantityMenu;
