import { Paper } from "@mui/material";
import BasicInfo from "../../components/BasicInfoProduct";
import ProductImage from "../../components/ProductImage";
import Pricing from "../../components/Pricing";
import Attribute from "../../components/Attribute";
import StockTracking from "../../components/StockTracking";
import SEO_Information from "../../components/SEO_Information";
import CreateFooter from "../../components/CreateFooter";
import ProductModels from "../../components/ProductModels";
import { useContext, useEffect } from "react";
import MyContext from "../../Context/MyContext";
import TypeProductQuesBox from "../../components/TypeProductQuesBox";

const CreateProduct = ({ hasModels }) => {
  const { isOpenQuesBox, setIsOpenQuesBox } = useContext(MyContext);
  useEffect(() => {
    setIsOpenQuesBox(true);
  }, []);

  return (
    <>
      {!isOpenQuesBox && (
        <div className="m-5">
          <h3 className="font-bold text-2xl">Create Product</h3>
          <div className="lg:flex gap-5 mt-5">
            <div className="flex-1">
              <Paper
                sx={{ padding: "20px" }}
                elevation={2}
                className="!rounded-xl"
              >
                <BasicInfo />
              </Paper>
              {hasModels ? (
                <Paper
                  sx={{ padding: "20px" }}
                  elevation={2}
                  className="!rounded-xl mt-5"
                >
                  <ProductModels />
                </Paper>
              ) : (
                <>
                  <Paper
                    sx={{ padding: "20px" }}
                    elevation={2}
                    className="!rounded-xl mt-5"
                  >
                    <h3 className="font-bold text-xl mb-5">
                      Pricing Information
                    </h3>
                    <Pricing />
                  </Paper>
                  <Paper
                    sx={{ padding: "20px" }}
                    elevation={2}
                    className="!rounded-xl mt-5"
                  >
                    <h3 className="font-bold text-xl mb-5">Stock Tracking</h3>

                    <StockTracking />
                  </Paper>
                </>
              )}
            </div>
            <div className="lg:w-[430px] xl:w-[523px] h-fit mt-5 lg:mt-0">
              <Paper
                sx={{ padding: "20px" }}
                elevation={2}
                className="!rounded-xl"
              >
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
      )}
      {isOpenQuesBox && <TypeProductQuesBox />}
    </> 
  );
};

export default CreateProduct;
