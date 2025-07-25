import { MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

const HeadingSelect = ({ selectItems, editor }) => {

  const getCurrentLevel = () => {
    if (!editor) return 0;
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) return i;
    }
    return 0; 
  };

  const [value, setValue] = useState(getCurrentLevel());

  useEffect(() => {
    if (!editor) return;

    const update = () => setValue(getCurrentLevel());

    editor.on("selectionUpdate", update);
    editor.on("transaction", update);

    return () => {
      editor.off("selectionUpdate", update);
      editor.off("transaction", update);
    };
  }, [editor]);

  const handleChange = (e) => {
    const level = parseInt(e.target.value);
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setHeading({ level }).run(); // dùng setHeading thay vì toggle
    }
  };

  return (
    <Select
      size="small"
      onChange={handleChange}
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
        ".MuiSelect-select": {
          paddingTop: "4px",
          paddingBottom: "4px",
        },
        minHeight: "unset",
        height: "32px",
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
