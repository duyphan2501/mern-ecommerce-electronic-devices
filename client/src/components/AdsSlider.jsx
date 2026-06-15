import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { API } from "../API/axiosInstance";

const AdsSlider = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [sidePromotions, setSidePromotions] = useState([]);

  useEffect(() => {
    let isMounted = true;

    API.get("/api/slides/public")
      .then((response) => {
        if (!isMounted) return;

        const slides = response.data.slides || [];
        setAdvertisements(slides.filter((slide) => slide.type === "feature"));
        setSidePromotions(slides.filter((slide) => slide.type === "side"));
      })
      .catch(() => {
        if (!isMounted) return;
        setAdvertisements([]);
        setSidePromotions([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (advertisements.length === 0 && sidePromotions.length === 0) return null;

  return (
    <div className="container items-stretch justify-between gap-4 md:flex">
      {advertisements.length > 0 && (
        <div
          className={`h-[500px] overflow-hidden ${
            sidePromotions.length > 0 ? "md:w-2/3" : "w-full"
          }`}
        >
          <Swiper
            loop={advertisements.length > 1}
            spaceBetween={30}
            effect="fade"
            navigation={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              reverseDirection: true,
            }}
            modules={[Navigation, EffectFade, Autoplay]}
            className="AdsSlider h-full"
          >
            {advertisements.map((advertisement) => (
              <SwiperSlide key={advertisement._id}>
                <div
                  className="relative h-full text-blue-900/100"
                  style={{
                    textShadow:
                      "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff",
                  }}
                >
                  <picture className="block h-full">
                    {advertisement.mobileImage && (
                      <source
                        media="(max-width: 640px)"
                        srcSet={advertisement.mobileImage}
                      />
                    )}
                    <img
                      src={advertisement.image}
                      alt={advertisement.name}
                      loading="lazy"
                      className="h-full w-full rounded-xl object-center"
                    />
                  </picture>
                  <div className="info absolute top-0 -right-1/2 z-10 flex h-full w-1/2 flex-col justify-center space-y-5 pr-8 font-sans opacity-0 transition-all duration-1000">
                    <h4 className="relative -right-1/2 text-lg font-bold opacity-0">
                      {advertisement.title}
                    </h4>
                    <h3 className="relative -right-1/2 text-4xl font-[700] opacity-0">
                      {advertisement.content}
                    </h3>
                    <p className="relative -right-1/2 text-lg font-medium opacity-0">
                      {advertisement.footer}
                    </p>
                    <div className="relative -right-1/2 opacity-0">
                      <Button
                        component={Link}
                        to={advertisement.link || "#"}
                        variant="contained"
                        color="primary"
                        className="!font-sans !font-semibold text-shadow-2xs"
                      >
                        {advertisement.linkContent}
                      </Button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {sidePromotions.length > 0 && (
        <div
          className={`mt-4 flex h-[500px] flex-col gap-4 md:mt-0 ${
            advertisements.length > 0 ? "md:w-1/3" : "w-full md:flex-row"
          }`}
        >
          {sidePromotions.map((promotion) => (
            <Link
              key={promotion._id}
              to={promotion.link || "#"}
              className="min-h-0 flex-1 overflow-hidden rounded-md"
            >
              <picture className="block h-full">
                {promotion.mobileImage && (
                  <source
                    media="(max-width: 640px)"
                    srcSet={promotion.mobileImage}
                  />
                )}
                <img
                  src={promotion.image}
                  alt={promotion.name}
                  loading="lazy"
                  className="h-full w-full object-center transition duration-300 hover:scale-105"
                />
              </picture>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdsSlider;
