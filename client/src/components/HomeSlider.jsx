import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useState } from "react";

const HomeSlider = () => {
  const [banners, setBanners] = useState([
    {
      _id: 1,
      image:
        "https://image.cdn2.seaart.me/2026-03-12/d6p7g85e878c73ff6l4g/4ebaa0871babda28a6ed7515c8f1c921_high.webp",
    },
    {
      _id: 2,
      image:
        "https://image.cdn2.seaart.me/2026-03-12/d6p7g8le878c73atfep0/387ee040378244bd7425e2b1c1187302_high.webp",
    },
    {
      _id: 3,
      image:
        "https://image.cdn2.seaart.me/2026-03-12/d6p7g8de878c73ff6nl0/5db7a0b4086866e55c195b00da666e0f_high.webp",
    },
  ]);
  return (
    <div className="container pb-4">
      <Swiper
        navigation={true}
        loop={true}
        spaceBetween={10}
        autoplay={{
          delay: 5000,
          reverseDirection: true,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        modules={[Navigation, Pagination, Autoplay]}
        className="HomeSlider"
      >
        {banners &&
          banners.map((banner) => (
            <SwiperSlide key={banner._id}>
              <div className="pb-4">
                <img
                  src={banner.image}
                  className="rounded-xl w-full h-[500px] object-center"
                />
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;
