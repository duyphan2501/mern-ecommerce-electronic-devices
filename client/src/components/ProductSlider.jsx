import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import useProductStore from "../store/productStore";

const ProductSlider = ({products}) => {
  return (
    <div>
      <div className="container bg-white">
        <Swiper
          slidesPerView={6}
          spaceBetween={10}
          breakpoints={{
            320: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
            1536: { slidesPerView: 6 },
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
