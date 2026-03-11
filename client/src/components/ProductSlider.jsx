import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductCard from "./ProductCard";
import { useEffect } from "react";
import { useState } from "react";

const ProductSlider = ({ fetchProducts }) => {
  const [products, setProducts] = useState([]);
  const fetchData = async () => {
    const resData = await fetchProducts();
    setProducts(resData);
  };
  useEffect(() => {
    fetchData();
  }, [fetchProducts]);
  return (
    <div>
      <div className="container bg-white">
        <Swiper
          slidesPerView={5}
          spaceBetween={15}
          breakpoints={{
            320: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
          modules={[Navigation]}
          className="ProductSlider"
        >
          {products &&
            products.map((product) => (
              <SwiperSlide key={product._id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ProductSlider;
