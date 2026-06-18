import { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import MyContext from "../Context/MyContext";
import LazyComponentWrapper from "../components/LazyComponentWrapper";
import ProductDetailContent from "../components/ProductDetailContent";
import ProductDetailInfo from "../components/ProductDetailInfo";
import ProductZoom from "../components/ProductZoom";
import useProductStore from "../store/productStore";
import { getSelectedModel, getSelectedModelImages } from "../utils/productImages";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [productStatus, setProductStatus] = useState("loading");
  const { selectedProduct } = useContext(MyContext);
  const { getProductBySlug, getProductsByCategoryIds } = useProductStore();

  useEffect(() => {
    let ignore = false;

    const getProduct = async () => {
      setProductStatus("loading");

      try {
        const fetchProduct = await getProductBySlug(slug);
        if (ignore) return;

        if (!fetchProduct) {
          setProduct(null);
          setProductStatus("not-found");
          return;
        }

        const nextSelectedModelIndex = selectedProduct?.selectedModelIndex || 0;
        setSelectedModelIndex(nextSelectedModelIndex);
        setProduct({
          ...fetchProduct,
          selectedModelIndex: nextSelectedModelIndex,
        });
        setProductStatus("success");
      } catch (error) {
        if (!ignore) {
          console.error(error);
          setProduct(null);
          setProductStatus("not-found");
        }
      }
    };

    getProduct();

    return () => {
      ignore = true;
    };
  }, [slug, getProductBySlug, selectedProduct?.selectedModelIndex]);

  if (productStatus === "loading") {
    return (
      <div className="flex items-center justify-center h-100">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (productStatus === "not-found" || !product || !product._id) {
    return (
      <div className="flex items-center justify-center h-100">
        <p>Sản phẩm không tồn tại</p>
      </div>
    );
  }

  const selectedModel = getSelectedModel(product, selectedModelIndex);
  const selectedImages = getSelectedModelImages(product, selectedModelIndex);

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.productName,
    image: selectedImages,
    description: product.metaDescription,
    sku: product._id,
    mpn: product._id,
    brand: {
      "@type": "Brand",
      name: product.brand?.brandName || "SolarTech",
    },
    offers: {
      "@type": "Offer",
      url: window.location.href,
      priceCurrency: "VND",
      price: selectedModel?.salePrice || 0,
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <Helmet>
        <title>{product.pageTitle || product.productName}</title>
        <meta name="description" content={product.metaDescription} />
        <meta name="keywords" content={product.metaKeywords} />
        <meta property="og:title" content={product.productName} />
        <meta property="og:image" content={selectedImages[0] || ""} />
        <meta property="og:type" content="product" />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div className="bg-white">
        <div className="container">
          <section className="lg:flex gap-5 py-6 sm:py-10">
            <div className="w-full lg:w-auto min-w-0">
              <ProductZoom imageAddress={selectedImages} />
            </div>
            <section className="min-w-0 flex-1">
              <ProductDetailContent
                product={product}
                onSelectedModelChange={setSelectedModelIndex}
              />
            </section>
          </section>
          <section>
            <ProductDetailInfo product={product} />
          </section>
          <h2 className="text-2xl font-bold font-sans mt-2">
            Sản phẩm tương tự
          </h2>
        </div>
        <div className="pt-5 pb-10">
          <LazyComponentWrapper
            importFunc={() => import("../components/ProductSlider")}
            fetchProducts={async () => {
              const cateIds = product.categoryIds.map((cate) => cate._id);
              return getProductsByCategoryIds(cateIds);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
