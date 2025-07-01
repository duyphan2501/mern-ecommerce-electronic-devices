import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { Autoplay, Navigation, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import "swiper/css/effect-fade";

const slideCaptions = [
  [
    <h3 className="text-2xl" key="line1">
      Lorem ipsum dolor sit.
    </h3>,
    <p key="line2">Lorem ipsum dolor sit amet consectetur.</p>,
    <p key="line2">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>,
    <Button
      key="line3"
      component={Link}
      to="/windows-11"
      variant="contained"
      color="primary"
      className="!font-semibold !font-sans"
    >
      Liên hệ ngay
    </Button>,
  ],
  [
    <p className="text-2xl" key="line1">
      Lorem ipsum dolor sit.
    </p>,
    <p key="line2">Lorem ipsum dolor sit amet consectetur.</p>,
    <p key="line2">Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>,
    <Button
      key="line3"
      component={Link}
      to="/windows-11"
      variant="contained"
      color="primary"
      className="!font-semibold !font-sans"
    >
      Liên hệ ngay
    </Button>,
  ],
];

const AdsSlider = () => {
  return (
    <div className="container md:flex justify-between items-stretch gap-4">
      {/* Slide bên trái */}
      <div className="md:w-2/3 h-[500px] overflow-hidden">
        <Swiper
          loop={true}
          spaceBetween={30}
          effect={'fade'}
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
          {slideCaptions.map((caption, index) => (
            <SwiperSlide key={index}>
              <div className="h-full relative">
                <img
                  src="https://serviceapi.spicezgold.com/download/1750316856852_windows-11-3840x2160-microsoft-4k-24745.jpg"
                  loading="lazy"
                  className="rounded-xl w-full h-full object-cover"
                />
                {/* Caption chữ chạy ra */}
                <div className="absolute z-10 w-1/2 h-full top-0 flex flex-col justify-center font-sans text-white text-shadow-black space-y-5 info pr-8 -right-1/2 opacity-0 transition-all duration-1000">
                  <h4 className="text-lg font-medium relative opacity-0 -right-1/2">
                    Big saving days sale
                  </h4>
                  <h3 className="text-4xl font-[700] opacity-0 -right-1/2 relative">
                    Inverter dye hydrid 3kw 1 pha - SUN - 3k-SFBDH-SDFNND
                  </h3>
                  <p className="font-medium text-lg opacity-0 -right-1/2 relative">
                    Hỗ trợ kỹ thuật
                  </p>
                  <div className="opacity-0 -right-1/2 relative">
                    <Button
                      component={Link}
                      to="/windows-11"
                      variant="contained"
                      color="primary"
                      className="!font-semibold !font-sans "
                    >
                      Liên hệ ngay
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
          src="https://powertech.vn/thumbs/370x230x1/upload/photo/z65433762441366166af20604aa4c2646af39ca585e141-4763.jpg"
          alt=""
          className="w-full h-full object-cover rounded-md overflow-hidden"
        />
        <img
          src="https://powertech.vn/thumbs/370x230x1/upload/photo/z65433762441366166af20604aa4c2646af39ca585e141-4763.jpg"
          alt=""
          className="w-full h-full object-cover rounded-md overflow-hidden"
        />
      </div>
    </div>
  );
};

export default AdsSlider;
