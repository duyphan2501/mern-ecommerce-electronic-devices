import { Paper } from "@mui/material";
import BasicInfo from "../../components/BasicInfoProduct";
import ProductImage from "../../components/ProductImage";
import Pricing from "../../components/Pricing";
import Attribute from "../../components/Attribute";
import StockTracking from "../../components/StockTracking";
import SEO_Information from "../../components/SEO_Information";
import CreateFooter from "../../components/CreateFooter";
import ProductModels from "../../components/ProductModels";
import { useContext, useEffect, useState } from "react";
import MyContext from "../../Context/MyContext";
import TypeProductQuesBox from "../../components/TypeProductQuesBox";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProductStore from "../../store/productStore";
import { useNavigate } from "react-router";

const defaultModel = {
  modelName: "",
  salePrice: 12323,
  costPrice: 123123,
  discount: 10,
  tax: 10,
  stockQuantity: 100,
  unit: "",
  expectedQuantity: 120,
  minimumQuantity: 20,
  documents: [],
  specifications: "",
};

const CreateProduct = () => {
  const { isOpenQuesBox, setIsOpenQuesBox, hasModels } = useContext(MyContext);

  const defaultProduct = {
    productName: "",
    description: "",
    models: [defaultModel],
    images: [],
    categoryIds: [],
    brandId: "",
    shippingCost: 0,
    pageTitle: "",
    metaKeywords: "",
    metaDescription: "",
    productUrl: "",
    status: "draft",
  };
  useEffect(() => {
    setIsOpenQuesBox(true);
  }, []);

  // Gộp các state liên quan thành 1 object
  const [product, setProduct] = useState(defaultProduct);

  const { createProduct, isLoading } = useProductStore();
  const axiosPrivate = useAxiosPrivate();
  const navigator = useNavigate();

  const handleChangeModel = (field, index, value) => {
    setProduct((prev) => {
      const updatedModels = [...prev.models];
      updatedModels[index] = { ...updatedModels[index], [field]: value };
      return { ...prev, models: updatedModels };
    });
  };

  const handleChangeProduct = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (isLoading) return;
    try {
      const productData = {...product, hasModels}
      await createProduct(productData, axiosPrivate);
      navigator("/products/list");
    } catch (error) {
      console.log(error);
    }
  };

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
                <BasicInfo
                  product={product}
                  handleChangeModel={handleChangeModel}
                  handleChangeProduct={handleChangeProduct}
                />
              </Paper>

              {hasModels ? (
                <Paper
                  sx={{ padding: "20px" }}
                  elevation={2}
                  className="!rounded-xl mt-5"
                >
                  <ProductModels
                    product={product}
                    setProduct={setProduct}
                    handleChangeValue={handleChangeModel}
                    defaultModel={defaultModel}
                  />
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
                    <Pricing
                      product={product}
                      handleChangeValue={handleChangeModel}
                    />
                  </Paper>

                  <Paper
                    sx={{ padding: "20px" }}
                    elevation={2}
                    className="!rounded-xl mt-5"
                  >
                    <h3 className="font-bold text-xl mb-5">Stock Tracking</h3>
                    <StockTracking
                      product={product}
                      handleChangeValue={handleChangeModel}
                    />
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
                <ProductImage
                  product={product}
                  handleChangeValue={handleChangeProduct}
                />
              </Paper>

              <Paper
                sx={{ padding: "20px" }}
                elevation={2}
                className="!rounded-xl mt-5"
              >
                <Attribute
                  product={product}
                  handleChangeValue={handleChangeProduct}
                />
              </Paper>

              <Paper
                sx={{ padding: "20px" }}
                elevation={2}
                className="!rounded-xl mt-5"
              >
                <SEO_Information
                  product={product}
                  handleChange={handleChangeProduct}
                />
              </Paper>
            </div>
          </div>
          <div className="py-10">
            <CreateFooter product={product} onSubmit={handleSubmit} />
          </div>
        </div>
      )}

      {isOpenQuesBox && <TypeProductQuesBox />}
    </>
  );
};

export default CreateProduct;
