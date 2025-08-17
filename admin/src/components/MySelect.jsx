import { MenuItem, Select } from "@mui/material";
import { useState } from "react";

const MySelect = ({ selectItems }) => {
  const [value, setValue] = useState(selectItems[0]);
  const handleChange = (e) => {
    setValue(e.target.value);
  };
  return (
    <Select
      size="small"
      value={value}
      onChange={handleChange}
      className="!rounded-xl !bg-gray-100 w-full"
      sx={{
        fontFamily: "Outfit, sans-serif",
        ".MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "2px solid #3b82f6",
    },
      }}
    > 
      {selectItems.map((item) => (
        <MenuItem
          value={item}
          key={item}
          sx={{ fontFamily: "Outfit, sans-serif"}}
        >
          {item}
        </MenuItem>
      ))}
    </Select>
  );
};

export default MySelect;
