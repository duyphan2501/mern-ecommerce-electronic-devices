import { Paper } from "@mui/material";
import BasicInfo from "../../components/BasicInfoProduct";
import ProductImage from "../../components/ProductImage";
import Pricing from "../../components/Pricing";
import Attribute from "../../components/Attribute";
import StockTracking from "../../components/StockTracking";
import SEO_Information from "../../components/SEO_Information";
import CreateFooter from "../../components/CreateFooter";

const CreateProduct = () => {
  return (
    <div className="m-5">
      <h3 className="font-bold text-2xl">Create Product</h3>
      <div className="lg:flex gap-5 mt-5">
        <div className="flex-1">
          <Paper sx={{ padding: "20px" }} elevation={2} className="!rounded-xl">
            <BasicInfo />
          </Paper>
          <Paper
            sx={{ padding: "20px" }}
            elevation={2}
            className="!rounded-xl mt-5"
          >
            <Pricing />
          </Paper>
          <Paper
            sx={{ padding: "20px" }}
            elevation={2}
            className="!rounded-xl mt-5"
          >
            <StockTracking />
          </Paper>
        </div>
        <div className="lg:w-[430px] xl:w-[523px] h-fit mt-5 lg:mt-0">
          <Paper sx={{ padding: "20px" }} elevation={2} className="!rounded-xl">
            <ProductImage />
          </Paper>
          <Paper
            sx={{ padding: "20px" }}
            elevation={2}
            className="!rounded-xl mt-5"
          >
            <Attribute />
          </Paper>
          <Paper
            sx={{ padding: "20px" }}
            elevation={2}
            className="!rounded-xl mt-5"
          >
            <SEO_Information />
          </Paper>
        </div>
      </div>
      <div className="py-10">
        <CreateFooter />
      </div>
    </div>
  );
};

export default CreateProduct;
