import { MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

const HeadingSelect = ({ selectItems, editor }) => {
  const getCurrentLevel = () => {
    if (editor.isActive("heading", { level: 1 })) return 1;
    if (editor.isActive("heading", { level: 2 })) return 2;
    if (editor.isActive("heading", { level: 3 })) return 3;
    if (editor.isActive("heading", { level: 4 })) return 4;
    if (editor.isActive("heading", { level: 5 })) return 5;
    if (editor.isActive("heading", { level: 6 })) return 6;
    return 0; // Paragraph
  };

  const [value, setValue] = useState(getCurrentLevel());
  
  return (
    <Select
      size="small"
      onChange={(e) => {
        const level = parseInt(e.target.value);
        if (level === 0) {
          editor.chain().focus().setParagraph().run();
        } else {
          editor.chain().focus().toggleHeading({ level }).run();
        }
        setValue(level);
      }}
      className="!rounded !bg-gray-100"
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
      }}
    >
      {selectItems.map((item) => (
        <MenuItem
          value={item.value}
          key={item.value}
          sx={{ fontFamily: "Outfit, sans-serif" }}
        >
          {item.key}
        </MenuItem>
      ))}
    </Select>
  );
};

export default HeadingSelect;
