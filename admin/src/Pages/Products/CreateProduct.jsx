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
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const defaultModel = {
  modelName: "3kw 1pha",
  salePrice: 12323,
  costPrice: 123123,
  discount: 10,
  tax: 10,
  stockQuantity: 100,
  unit: "cái",
  expectedQuantity: 120,
  minimumQuantity: 20,
  documents: [],
  specifications: "sasdfasdcasd",
};

const CreateProduct = ({ hasModels }) => {
  const { isOpenQuesBox, setIsOpenQuesBox, notify } = useContext(MyContext);

  useEffect(() => {
    setIsOpenQuesBox(true);
  }, []);

  // Gộp các state liên quan thành 1 object
  const [product, setProduct] = useState({
    productName: "Inverter Deye",
    description: "lorem adcscsc",
    models: [defaultModel],
    images: [],
    categoryId: "660ef98c8b0f2e23d8ccfe71",
    brandId: "660ef98c8b0f2e23d8ccfe72",
    shippingCost: 0,
    pageTitle: "Inverter Deye",
    metaKeywords: "Inverter Deye",
    metaDescription: "Inverter Deye",
    productUrl: "/Inverter-Deye",
    status: "draft",
  });

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

  const login = async () => {
    const res = await axios.post(
      "http://localhost:3000/api/user/login",
      {
        email: "duyneon09@gmail.com",
        password: "123456",
      },
      {
        withCredentials: true,
      }
    );
    console.log(res.data);
  };

  const handleSubmit = async () => {
    try {
      // Upload hình ảnh
      const imageFormData = new FormData();
      product.images.forEach((img) => {
        imageFormData.append("productImages", img);
      });
      for (let [key, value] of imageFormData.entries()) {
        console.log(key, value);
      }

      const imageRes = await axios.post(
        `${API_BASE_URL}/api/product/upload-images`,
        imageFormData,
        {
          withCredentials: true, // Gửi cookie kèm theo
        }
      );
      let uploadedImages = [];
      if (imageRes) {
        uploadedImages = imageRes.data?.uploadedImages;
        notify("success", imageRes.data?.message);
      } else notify("error", imageRes.data?.message);

      // Upload tài liệu
      const newModels = [...product.models];

      for (let i = 0; i < newModels.length; i++) {
        const docFormData = new FormData();
        newModels[i].documents.forEach((doc) => {
          docFormData.append("documents", doc);
        });
        for (let [key, value] of docFormData.entries()) {
          console.log(key, value);
        }
        const docRes = await axios.post(
          `${API_BASE_URL}/api/product/upload-documents`,
          docFormData,
          {
            withCredentials: true, // Gửi cookie kèm theo
          }
        );
        if (docRes) {
          newModels[i].documents = docRes.data?.uploadedDocuments;
          notify("success", docRes.data?.message);
        } else notify("error", docRes.data?.message);
      }

      const payload = {
        ...product,
        images: uploadedImages,
        models: newModels,
      };
      const res = await axios.post(
        `${API_BASE_URL}/api/product/create`,
        payload,
        {
          withCredentials: true,
        }
      );

      // 4. Xử lý kết quả
      if (res.data?.success) {
        notify("success", res.data.message || "Tạo sản phẩm thành công!");
      } else {
        notify("error", res.data.message || "Tạo sản phẩm thất bại!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Đã có lỗi xảy ra.";
      notify("error", errorMessage);
      console.error("Chi tiết lỗi:", error);
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
