import { MenuItem, Select } from "@mui/material";
import { useState } from "react";

const AttributeSelect = ({
  selectItems,
  onChange,
  selectedItemId = "",
}) => {

  const selectedItem = selectedItemId && selectItems.find(item => item._id === selectedItemId)
  const [value, setValue] = useState(selectedItem?._id || "");
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setValue(selectedValue);
    onChange(selectedValue);
  };

  return (
    <Select
      size="small"
      onChange={handleChange}
      className="!rounded-lg !bg-gray-100 !w-full"
      value={value}
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
        ".MuiSelect-select": {
          paddingTop: "12px",
          paddingBottom: "12px",
        },
        minHeight: "unset",
      }}
    >
      {selectItems.map((item) => (
        <MenuItem
          value={item._id}
          key={item._id}
          sx={{ fontFamily: "Outfit, sans-serif" }}
        >
          {item.name}
        </MenuItem>
      ))}
    </Select>
  );
};

export default AttributeSelect;
