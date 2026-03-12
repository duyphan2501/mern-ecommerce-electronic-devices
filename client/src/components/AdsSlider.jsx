import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import "swiper/css/effect-fade";

const advertisements = [
  {
    _id: 1,
    image:
      "https://img.pikbest.com/templates/20240726/clean-solar-energy-social-media-post_10683100.jpg!bwr800",
    title: "Big saving days sale",
    content: "Inverter dye hydrid 3kw 1 pha - SUN - 3k-SFBDH-SDFNND",
    footer: "Hỗ trợ kỹ thuật",
    link: "/contact",
    linkContent: "Liên hệ ngay",
  },
  {
    _id: 2,
    image:
      "https://img.pikbest.com/origin/08/96/92/20JpIkbEsTXEx.jpg!bwr800",
    title: "Big saving days sale",
    content: "Inverter dye hydrid 3kw 1 pha - SUN - 3k-SFBDH-SDFNND",
    footer: "Hỗ trợ kỹ thuật",
    link: "/contact",
    linkContent: "Liên hệ ngay",
  },
];

const AdsSlider = () => {
  return (
    <div className="container md:flex justify-between items-stretch gap-4">
      {/* Slide bên trái */}
      <div className="md:w-2/3 h-[500px] overflow-hidden">
        <Swiper
          loop={true}
          spaceBetween={30}
          effect={"fade"}
          navigation={true}
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            reverseDirection: true,
          }}
          modules={[Navigation, EffectFade, Autoplay]}
          className="AdsSlider h-full"
        >
          {advertisements.map((adv, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-full relative text-blue-900/100"
                style={{
                  textShadow:
                    "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff",
                }}
              >
                <img
                  src={adv.image}
                  loading="lazy"
                  className="rounded-xl w-full h-full object-center"
                />
                {/* Caption chữ chạy ra */}
                <div className="absolute z-10 w-1/2 h-full top-0 flex flex-col justify-center font-sans space-y-5 info pr-8 -right-1/2 opacity-0 transition-all duration-1000">
                  <h4 className="text-lg font-bold relative opacity-0 -right-1/2">
                    {adv.title}
                  </h4>
                  <h3 className="text-4xl font-[700] opacity-0 -right-1/2 relative">
                    {adv.content}
                  </h3>
                  <p className="font-medium text-lg opacity-0 -right-1/2 relative">
                    {adv.footer}
                  </p>
                  <div className="opacity-0 -right-1/2 relative">
                    <Button
                      component={Link}
                      to={adv.link}
                      variant="contained"
                      color="primary"
                      className="!font-semibold !font-sans text-shadow-2xs"
                    >
                      {adv.linkContent}
                    </Button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 2 ảnh bên phải */}
      <div className="md:w-1/3 h-[500px] flex flex-col gap-4 md:mt-0 mt-4">
        <img
          src="https://img.pikbest.com/origin/09/42/89/82upIkbEsTdi9.jpg!bwr800"
          alt=""
          className="w-full h-full object-center rounded-md overflow-hidden"
        />
        <img
          src="https://img.pikbest.com/origin/10/00/76/70kpIkbEsTU7R.jpg!bwr800"
          alt=""
          className="w-full h-full object-center rounded-md overflow-hidden"
        />
      </div>
    </div>
  );
};

export default AdsSlider;
