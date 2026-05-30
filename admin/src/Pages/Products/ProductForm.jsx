import { Alert, CircularProgress, Paper } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Attribute from "../../components/Attribute";
import BasicInfo from "../../components/BasicInfoProduct";
import CreateFooter from "../../components/CreateFooter";
import ProductImage from "../../components/ProductImage";
import ProductModels from "../../components/ProductModels";
import SEO_Information from "../../components/SEO_Information";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useProductStore from "../../store/productStore";

const defaultModel = {
  modelName: "",
  salePrice: 0,
  costPrice: 0,
  discount: 0,
  tax: 0,
  stockQuantity: 0,
  soldQuantity: 0,
  expectedQuantity: 0,
  minimumQuantity: 0,
  documents: [],
  specifications: "<p></p>",
};

const defaultProduct = {
  productName: "",
  description: "",
  models: [{ ...defaultModel }],
  images: [],
  categoryIds: [],
  brandId: "",
  shippingCost: 0,
  pageTitle: "",
  metaKeywords: "",
  metaDescription: "",
  productUrl: "",
  status: "draft",
  hasModels: true,
};

const normalizeProductForForm = (product) => ({
  _id: product._id,
  productName: product.productName || "",
  description: product.description || "",
  models: (product.modelsId || []).map((model) => ({
    ...defaultModel,
    ...model,
    documents: model.documents || [],
  })),
  images: product.images || [],
  categoryIds: (product.categoryIds || []).map((category) =>
    typeof category === "string" ? category : category._id,
  ),
  brandId:
    typeof product.brandId === "string" ? product.brandId : product.brandId?._id || "",
  shippingCost: Number(product.shippingCost || 0),
  pageTitle: product.pageTitle || "",
  metaKeywords: product.metaKeywords || "",
  metaDescription: product.metaDescription || "",
  productUrl: product.productUrl || "",
  status: product.status || "draft",
  hasModels: true,
});

const ProductForm = ({ mode = "create" }) => {
  const { id } = useParams();
  const isEdit = mode === "edit";
  const [product, setProduct] = useState(defaultProduct);
  const [notFound, setNotFound] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const {
    createProduct,
    updateProduct,
    fetchAdminProductById,
    isLoading,
  } = useProductStore();

  const title = useMemo(
    () => (isEdit ? "Edit Product" : "Create Product"),
    [isEdit],
  );

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!isEdit || !id) {
        setProduct(defaultProduct);
        return;
      }

      const data = await fetchAdminProductById(id, axiosPrivate);
      if (!isMounted) return;

      if (!data) {
        setNotFound(true);
        return;
      }

      const normalizedProduct = normalizeProductForForm(data);
      if (normalizedProduct.models.length === 0) {
        normalizedProduct.models = [{ ...defaultModel }];
      }
      setProduct(normalizedProduct);
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [axiosPrivate, fetchAdminProductById, id, isEdit]);

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

    const payload = { ...product, hasModels: product.models.length > 1 };

    try {
      if (isEdit) {
        await updateProduct(payload, axiosPrivate);
      } else {
        await createProduct(payload, axiosPrivate);
      }

      navigate("/products/list");
    } catch (error) {
      console.error(error);
    }
  };

  if (notFound) {
    return (
      <div className="m-5">
        <Alert severity="error">Product not found.</Alert>
      </div>
    );
  }

  if (isEdit && isLoading && !product?._id) {
    return (
      <div className="m-5 flex justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="m-5 pb-20">
      <h3 className="font-bold text-2xl">{title}</h3>
      <div className="lg:flex gap-5 mt-5">
        <div className="flex-1">
          <Paper sx={{ padding: "20px" }} elevation={2} className="!rounded-xl">
            <BasicInfo
              product={product}
              handleChangeProduct={handleChangeProduct}
            />
          </Paper>

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
        </div>

        <div className="lg:w-[430px] xl:w-[523px] h-fit mt-5 lg:mt-0">
          <Paper sx={{ padding: "20px" }} elevation={2} className="!rounded-xl">
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
            <SEO_Information product={product} handleChange={handleChangeProduct} />
          </Paper>
        </div>
      </div>

      <CreateFooter onSubmit={handleSubmit} />
    </div>
  );
};

export default ProductForm;
