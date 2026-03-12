import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import useBrandStore from "../store/brandStore";

const HomeCardSlider = () => {
  const brandList = useBrandStore((s) => s.brandList);
  if (!brandList || brandList.length === 0) {
    return null;
  }
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
          {brandList.map((brand) => (
            <SwiperSlide key={brand._id} className="group">
              <Link to={`/products/${brand.slug}`} className="">
                <div className="bg-white flex flex-col items-center p-2 rounded-md border border-gray-200">
                  <img
                    src={brand.image}
                    alt={brand.name}
                    loading="lazy"
                    className="w-[100px] h-[100px] object-contain rounded-md group-hover:shadow-md group-hover:scale-105 transition-transform duration-200"
                  />
                  <p className="text-center text-gray-700 mt-2">{brand.name}</p>
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
