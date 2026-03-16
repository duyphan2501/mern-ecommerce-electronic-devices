import ProductZoom from "../components/ProductZoom";
import ProductDetailContent from "../components/ProductDetailContent";
import ProductDetailInfo from "../components/ProductDetailInfo";
import LazyComponentWrapper from "../components/LazyComponentWrapper";
import { useEffect, useState } from "react";
import useProductStore from "../store/productStore";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import MyContext from "../Context/MyContext";
import { Helmet } from "react-helmet-async";

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const { getProductBySlug, isLoading, getProductsByCategoryIds } =
    useProductStore();
  const { selectedProduct } = useContext(MyContext);

  useEffect(() => {
    const getProduct = async () => {
      try {
        let fetchProduct = await getProductBySlug(slug);
        const selectedModelIndex = selectedProduct?.selectedModelIndex || 0;
        fetchProduct = { ...fetchProduct, selectedModelIndex };
        setProduct(fetchProduct);
      } catch (error) {
        console.error(error);
      }
    };
    getProduct();
  }, [slug, getProductBySlug]);

  if (!product || !product._id)
    return (
      <div className="flex items-center  justify-center h-100">
        <p>{isLoading ? "Đang tải..." : "Sản phẩm không tồn tại"}</p>
      </div>
    );

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.productName,
    image: product.images,
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
      price: product.basePrice || 0,
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      {product && (
        <>
          <Helmet>
            <title>{product.pageTitle || product.productName}</title>
            <meta name="description" content={product.metaDescription} />
            <meta name="keywords" content={product.metaKeywords} />
            <meta property="og:title" content={product.productName} />
            <meta property="og:image" content={product.images[0]} />
            <meta property="og:type" content="product" />
            <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
          </Helmet>
          <div className="bg-white">
            <div className="container">
              <section className="lg:flex gap-5 py-10">
                <div className="">
                  <ProductZoom imageAddress={product.images} />
                </div>
                <section>
                  <ProductDetailContent product={product} />
                </section>
              </section>
              <section className="">
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
                  const res = await getProductsByCategoryIds(cateIds);
                  return res;
                }}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ProductDetail;
