import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { API } from "../API/axiosInstance";

const HomeSlider = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    let isMounted = true;

    API.get("/api/slides/public?type=hero")
      .then((response) => {
        if (isMounted) setBanners(response.data.slides || []);
      })
      .catch(() => {
        if (isMounted) setBanners([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (banners.length === 0) return null;

  return (
    <div className="container pb-4">
      <Swiper
        navigation={true}
        loop={banners.length > 1}
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
        {banners.map((banner) => (
          <SwiperSlide key={banner._id}>
            <div className="pb-4">
              {banner.link ? (
                <Link to={banner.link} className="block">
                  <picture>
                    {banner.mobileImage && (
                      <source
                        media="(max-width: 640px)"
                        srcSet={banner.mobileImage}
                      />
                    )}
                    <img
                      src={banner.image}
                      alt={banner.name}
                      className="h-[260px] w-full rounded-xl object-center sm:h-[380px] lg:h-[500px]"
                    />
                  </picture>
                </Link>
              ) : (
                <picture>
                  {banner.mobileImage && (
                    <source
                      media="(max-width: 640px)"
                      srcSet={banner.mobileImage}
                    />
                  )}
                  <img
                    src={banner.image}
                    alt={banner.name}
                    className="h-[260px] w-full rounded-xl object-center sm:h-[380px] lg:h-[500px]"
                  />
                </picture>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;
