import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const productList = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Sản phẩm ${i + 1}`,
  link: `/san-pham/${i + 1}`,
  image:
    i % 2 === 0
      ? "https://salt.tikicdn.com/ts/upload/72/8d/23/a810d76829d245ddd87459150cb6bc77.png"
      : "https://salt.tikicdn.com/ts/upload/a2/cf/84/dab5e2a933efdbdb13962282999af39d.png",
}));

const HomeCardSlider = () => {
  return (
    <div className="container">
      <div className="">
        <Swiper
          navigation
          spaceBetween={10}
          breakpoints={{
            320: { slidesPerView: 1.5 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            960: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          modules={[Navigation]}
          className="HomeCardSlider"
        >
          {productList.map((product) => (
            <SwiperSlide key={product.id} className="group">
              <Link
                to={product.link}
                className=""
              >
                <div className="bg-white flex flex-col items-center p-2 rounded-md border border-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="w-[100px] h-[100px] object-contain rounded-md group-hover:shadow-md group-hover:scale-105 transition-transform duration-200"
                  />
                  <p className="text-center text-gray-700 mt-2">
                    {product.name}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCardSlider;
