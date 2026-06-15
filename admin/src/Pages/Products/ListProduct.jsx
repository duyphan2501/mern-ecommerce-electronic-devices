import { Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import ProductTable from "../../components/ProductTable";
import AdminPageHeader from "../../components/AdminPageHeader";
import { primaryActionClass } from "../../styles/adminControls";

const ListProduct = () => {
  return (
    <Paper sx={{ padding: "20px" }} elevation={2} className="!m-5 !rounded-xl">
      <AdminPageHeader
        title="Products"
        description="Manage the product catalog, models, pricing, and visibility."
        actions={
          <Button
            component={Link}
            to={"/products/create"}
            className={primaryActionClass}
          >
            + Add Product
          </Button>
        }
      />
      <div className="mt-2">
        <ProductTable />
      </div>
    </Paper>
  );
};

export default ListProduct;
