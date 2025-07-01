import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ProductCard from "./ProductCard";

const ProductSlider = () => {

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
          <SwiperSlide>
            <ProductCard
              image1={
                "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png"
              }
              image2={
                "https://powertech.vn/thumbs/540x540x2/upload/product/thiet-ke-chua-co-ten-3496.png"
              }
              name={"Inverter Dye Hydrid 3kw"}
              price={1000000}
              discount={20}
              isNew={true}
              rating={4.5}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard
              image1={
                "https://powertech.vn/thumbs/540x540x2/upload/product/2-1179.png"
              }
              image2={
                "https://powertech.vn/thumbs/540x540x2/upload/product/thiet-ke-chua-co-ten-3496.png"
              }
              name={
                "Inverter Dye Hydrid 3kw asdf asf as fas fa sdfasdfasdf afasdf "
              }
              price={1000000}
              discount={20}
              isNew={false}
              rating={4.5}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard
              image1={
                "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png"
              }
              image2={
                "https://powertech.vn/thumbs/540x540x2/upload/product/thiet-ke-chua-co-ten-3496.png"
              }
              name={"Inverter Dye Hydrid 3kw"}
              price={1000000}
              discount={20}
              isNew={true}
              rating={4.5}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard
              image1={
                "https://powertech.vn/thumbs/540x540x2/upload/product/2-1179.png"
              }
              image2={
                "https://powertech.vn/thumbs/540x540x2/upload/product/thiet-ke-chua-co-ten-3496.png"
              }
              name={"Inverter Dye Hydrid 3kw"}
              price={1000000}
              discount={0}
              isNew={false}
              rating={4.5}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard
              image1={
                "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png"
              }
              image2={
                "https://powertech.vn/thumbs/540x540x2/upload/product/thiet-ke-chua-co-ten-3496.png"
              }
              name={"Inverter Dye Hydrid 3kw"}
              price={1000000}
              discount={20}
              isNew={true}
              rating={4.5}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard
              image1={
                "https://powertech.vn/thumbs/540x540x2/upload/product/2-1179.png"
              }
              image2={
                "https://powertech.vn/thumbs/540x540x2/upload/product/thiet-ke-chua-co-ten-3496.png"
              }
              name={"Inverter Dye Hydrid 3kw"}
              price={1000000}
              discount={20}
              isNew={false}
              rating={4.5}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard
              image1={
                "https://powertech.vn/thumbs/540x540x2/upload/product/capture-4067.png"
              }
              image2={
                "https://powertech.vn/thumbs/540x540x2/upload/product/thiet-ke-chua-co-ten-3496.png"
              }
              name={"Inverter Dye Hydrid 3kw"}
              price={1000000}
              discount={20}
              isNew={true}
              rating={4.5}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ProductCard
              image1={
                "https://powertech.vn/thumbs/540x540x2/upload/product/2-1179.png"
              }
              image2={
                "https://powertech.vn/thumbs/540x540x2/upload/product/thiet-ke-chua-co-ten-3496.png"
              }
              name={"Inverter Dye Hydrid 3kw"}
              price={1000000}
              discount={20}
              isNew={false}
              rating={4.5}
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default ProductSlider;
