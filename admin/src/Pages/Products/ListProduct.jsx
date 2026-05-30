import { Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import ProductTable from "../../components/ProductTable";

const ListProduct = () => {
  return (
    <Paper sx={{ padding: "20px" }} elevation={2} className="!m-5 !rounded-xl">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-2xl">Products</h3>
        <Button
          component={Link}
          to={"/products/create"}
          className="!h-12 !bg-blue-500 !rounded-xl !px-6 !normal-case !text-white !font-semibold hover:!bg-black"
        >
          + Add Product
        </Button>
      </div>
      <div className="mt-2">
        <ProductTable />
      </div>
    </Paper>
  );
};

export default ListProduct;
