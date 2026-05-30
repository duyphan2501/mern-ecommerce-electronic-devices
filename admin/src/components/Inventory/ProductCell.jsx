import { Box, Typography } from "@mui/material";

const ProductCell = ({ item, secondary }) => {
  return (
    <Box display="flex" alignItems="center" gap={1.5}>
      <Box className="size-[52px] border border-gray-200 rounded-lg overflow-hidden bg-white">
        {item.image ? (
          <img
            src={item.image}
            alt={item.productName}
            className="size-full object-contain"
          />
        ) : (
          <Box className="size-full bg-gray-100" />
        )}
      </Box>
      <Box minWidth={0}>
        <Typography fontWeight={700} className="line-clamp-1">
          {item.productName}
        </Typography>
        <Typography color="text.secondary" fontSize={14}>
          {secondary}
        </Typography>
      </Box>
    </Box>
  );
};

export default ProductCell;
