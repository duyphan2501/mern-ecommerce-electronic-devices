import { useEffect, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "./ProductCard";
import "swiper/css";
import "swiper/css/navigation";
import ProductSkeleton from "./Loading/ProductSkeleton";

const PRODUCT_SLIDER_BREAKPOINTS = {
  320: { slidesPerView: 1.15, spaceBetween: 10 },
  420: { slidesPerView: 1.35, spaceBetween: 12 },
  640: { slidesPerView: 2.1 },
  768: { slidesPerView: 3 },
  1024: { slidesPerView: 4 },
  1280: { slidesPerView: 5 },
};

const ProductSliderSkeleton = () => (
  <Swiper
    slidesPerView={5}
    spaceBetween={15}
    breakpoints={PRODUCT_SLIDER_BREAKPOINTS}
    className="ProductSlider"
  >
    {Array.from({ length: 5 }).map((_, index) => (
      <SwiperSlide key={`product-slider-skeleton-${index}`}>
        <ProductSkeleton />
      </SwiperSlide>
    ))}
  </Swiper>
);

const ProductSliderEmpty = ({ message }) => (
  <div className="flex min-h-60 items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50 px-4 text-center text-sm text-gray-500">
    {message}
  </div>
);

const ProductSlider = ({ fetchProducts }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const resData = await fetchProducts();
        if (ignore) return;
        setProducts(Array.isArray(resData) ? resData : []);
      } catch (error) {
        if (ignore) return;
        console.error(error);
        setProducts([]);
        setError("Khong the tai san pham. Vui long thu lai sau.");
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [fetchProducts]);

  return (
    <div>
      <div className="container bg-white">
        {isLoading ? (
          <ProductSliderSkeleton />
        ) : error ? (
          <ProductSliderEmpty message={error} />
        ) : products.length === 0 ? (
          <ProductSliderEmpty message="Chua co san pham nao." />
        ) : (
          <Swiper
            slidesPerView={5}
            spaceBetween={15}
            breakpoints={PRODUCT_SLIDER_BREAKPOINTS}
            modules={[Navigation]}
            className="ProductSlider"
          >
            {products.map((product, index) => (
              <SwiperSlide key={product._id + "idx" + index}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default ProductSlider;
