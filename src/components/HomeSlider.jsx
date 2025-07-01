import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

const HomeSlider = () => {
  return (
    <div className="container pb-4">
      <Swiper
        navigation={true}
        loop={true}
        spaceBetween={10}
        autoplay={{
          delay: 5000,
        reverseDirection: true,}}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Navigation, Pagination, Autoplay]}
        className="HomeSlider"
      >
        <SwiperSlide>
          <div className="pb-4">
            <img
              src="https://serviceapi.spicezgold.com/download/1748955932914_NewProject(1).jpg"
              className="rounded-xl w-full h-[400px] object-cover"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="pb-4">
            <img
              src="https://serviceapi.spicezgold.com/download/1748955932914_NewProject(1).jpg"
              className="rounded-xl w-full h-[400px] object-cover"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="pb-4">
            <img
              src="https://serviceapi.spicezgold.com/download/1748955932914_NewProject(1).jpg"
              className="rounded-xl w-full h-[400px] object-cover"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="pb-4">
            <img
              src="https://serviceapi.spicezgold.com/download/1748955932914_NewProject(1).jpg"
              className="rounded-xl w-full h-[400px] object-cover"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="pb-4">
            <img
              src="https://serviceapi.spicezgold.com/download/1748955932914_NewProject(1).jpg"
              className="rounded-xl w-full h-[400px] object-cover"
            />
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default HomeSlider;
