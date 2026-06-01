import "react-inner-image-zoom/lib/styles.min.css";
import InnerImageZoom from "react-inner-image-zoom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useRef, useState } from "react";

const ProductZoom = ({ imageAddress }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const largeSlideRef = useRef();

  const changeSlideTo = (index) => {
    setSlideIndex(index);
    largeSlideRef.current.swiper.slideTo(index);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateSize = () => setIsSmallDevice(mediaQuery.matches);

    updateSize();
    mediaQuery.addEventListener("change", updateSize);
    return () => mediaQuery.removeEventListener("change", updateSize);
  }, []);

  if (!imageAddress || imageAddress.length === 0 ) return null;

  return (
    <div className="w-full max-w-full">
      <div className="p-2">
        <div className="flex md:flex-row flex-col gap-3 w-full max-w-full">
          <div className="order-2 md:order-1 w-full md:w-[100px] max-w-full overflow-x-auto md:overflow-visible">
            <Swiper
              key={isSmallDevice ? "thumbs-horizontal" : "thumbs-vertical"}
              className="w-full"
              slidesPerView={isSmallDevice ? "auto" : 4}
              spaceBetween={8}
              direction={isSmallDevice ? "horizontal" : "vertical"}
            >
              {imageAddress.map((image, index) => {
                return (
                  <SwiperSlide
                    key={image + index}
                    className={`!w-[72px] !h-[72px] sm:!w-[84px] sm:!h-[84px] md:!size-[100px] shrink-0 cursor-pointer rounded border border-gray-200 ${
                      slideIndex !== index && "opacity-40"
                    }`}
                    onClick={() => changeSlideTo(index)}
                  >
                    <img
                      src={image}
                      alt=""
                      className="object-contain h-full w-full"
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
          <div className="order-1 w-full max-w-[420px] mx-auto md:mx-0">
            <Swiper className="w-full" slidesPerView={1} ref={largeSlideRef}>
              {imageAddress.map((image, index) => {
                return (
                  <SwiperSlide key={index}>
                    {index === slideIndex && (
                      <div className="aspect-square w-full overflow-hidden">
                        <InnerImageZoom
                          src={image}
                          zoomScale={1}
                          zoomType="hover"
                          zoomPreload={true}
                          className="h-full w-full"
                        />
                      </div>
                    )}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductZoom;
