import { useState } from "react";
import {
  ListItem,
  Collapse,
  List,
  Checkbox,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import { CgAdd, CgRemove } from "react-icons/cg";

// Component đệ quy để hiển thị một danh mục đơn
const CategoryItem = ({ category, handleChange, listChecked }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (category.children && category.children.length > 0) {
      setOpen(!open);
    }
  };

  return (
    <>
      <ListItem
        // *** ĐIỀU CHỈNH QUAN TRỌNG Ở ĐÂY ***
        // Giảm padding top và bottom xuống 0px (hoặc 4px tùy ý)
        sx={{
          paddingTop: "0px",
          paddingBottom: "0px",
          paddingRight: "0px", // Giảm padding phải để nhường chỗ cho icon
          // Thụt lề dựa trên level
          paddingLeft: `${(category.level || 0) * 20}px`,
        }}
      >
        <div
         className="flex justify-between items-center w-full"
        >
          {/* Checkbox và Label */}
          <FormControlLabel
            control={
              <Checkbox
                onChange={(e) => handleChange(e, "categoryIds", category._id)}
                checked={listChecked.includes(category._id)}
              />
            }
            label={category.name}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Icon Mở Rộng */}
          {category.children && category.children.length > 0 ? (
            <IconButton onClick={handleClick} size="small">
              {open ? <CgRemove /> : <CgAdd />}
            </IconButton>
          ) : (
            <div style={{ width: "40px" }} />
          )}
        </div>
      </ListItem>

      {/* Collapse (Phần ẩn/hiện danh mục con) */}
      {category.children && category.children.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {category.children.map((subCategory) => (
              <CategoryItem
                key={subCategory._id}
                category={{
                  ...subCategory,
                  level: (category.level || 0) + 1,
                }}
                handleChange={handleChange}
                listChecked={listChecked}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export default CategoryItem;
