import { Paper } from "@mui/material";
import BasicInfo from "../../components/BasicInfoProduct";
import ProductImage from "../../components/ProductImage";

const CreateProduct = () => {
  return (
    <div className="m-5">
      <h3 className="font-bold text-2xl">Create Product</h3>
      <div className="flex gap-5 mt-5">
        <div className="w-4/7">
          <Paper sx={{ padding: "20px" }} elevation={2} className="!rounded-xl">
            <BasicInfo />
          </Paper>
          
        </div>
        <Paper
          sx={{ padding: "20px" }}
          elevation={2}
          className="w-3/7 !rounded-xl"
        >
          <ProductImage />
        </Paper>
      </div>
    </div>
  );
};

export default CreateProduct;
