import { MenuItem, Select } from "@mui/material";

const AttributeSelect = ({ selectItems, onChange, selectedItemId, allowedNone=false }) => {
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    onChange(selectedValue);
  };

  return (
    <Select
      size="small"
      onChange={handleChange}
      className="!rounded-lg !bg-gray-100 !w-full"
      value={selectedItemId}
      displayEmpty
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
      {allowedNone && <MenuItem value={""} key={""} sx={{ fontFamily: "Outfit, sans-serif" }}>
        <em>None</em>
      </MenuItem>}
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
