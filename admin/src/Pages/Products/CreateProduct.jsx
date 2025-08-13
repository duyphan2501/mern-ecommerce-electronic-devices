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

const defaultModel = {
  modelName: "SUN-3K-SG04LP1-EU-SM1",
  salePrice: 12323,
  costPrice: 123123,
  discount: 10,
  tax: 10,
  stockQuantity: 100,
  unit: "cái",
  expectedQuantity: 120,
  minimumQuantity: 20,
  documents: [],
  specifications: "Công suất PV lắp đặt tối đa: 6000W",
};

const CreateProduct = ({ hasModels }) => {
  const { isOpenQuesBox, setIsOpenQuesBox } = useContext(MyContext);

  useEffect(() => {
    setIsOpenQuesBox(true);
  }, []);

  // Gộp các state liên quan thành 1 object
  const [product, setProduct] = useState({
    productName: "Inverter Hybrid Deye 3kw 1 pha",
    description: "Ningbo Deye Inverter Technology Co., Ltd, được thành lập vào năm 2007 với vốn đăng ký 205 triệu RMB, là một trong những doanh nghiệp công nghệ cao của Trung Quốc và là công ty con của Deye Group. Với diện tích nhà máy trên 15.000㎡ và thiết bị sản xuất và thử nghiệm hoàn chỉnh, Deye đã trở thành một công ty lớn trong thị trường biến tần năng lượng mặt trời toàn cầu. Ningbo Deye Inverter Technology Co., Ltd chuyên cung cấp các giải pháp hệ thống điện quang điện hoàn chỉnh, bao gồm các giải pháp nhà máy điện dân dụng và thương mại. Ngoài ra, Deye cung cấp thiết bị phù hợp cho từng ứng dụng: cho tất cả các loại mô-đun, cho kết nối lưới điện và lưới điện độc lập cũng như hệ thống biến tần hỗn hợp, cho hệ thống nhà nhỏ và hệ thống thương mại trong phạm vi hàng Megawwat. Trong đó, công suất biến tần nối lưới PV từ 1-100kW, biến tần Hybrid 3.6kW-12kW, và bộ chuyển đổi micro inverter 300W-2000W. Là một công ty định hướng về công nghệ, Deye luôn cam kết nghiên cứu và phát triển các công nghệ tiên tiến mới để cung cấp các sản phẩm hiệu quả và đáng tin cậy. Ví dụ: Deye áp dụng cấu trúc liên kết ba cấp kiểu T và thuật toán SVPWM nâng cao để cải thiện hơn nữa hiệu quả chuyển đổi thêm 0,7% so với SPWM thông thường.",
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

  const {createProduct, isLoading} = useProductStore()
  const axiosPrivate = useAxiosPrivate()

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
      await createProduct(product, axiosPrivate)
    } catch (error) {
      console.log(error)
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
            <CreateFooter product={product} onSubmit={handleSubmit}/>
          </div>
        </div>
      )}

      {isOpenQuesBox && <TypeProductQuesBox />}
    </>
  );
};

export default CreateProduct;
