import "react-inner-image-zoom/lib/styles.min.css";
import InnerImageZoom from "react-inner-image-zoom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useRef, useState } from "react";

const ProductZoom = ({ imageAddress }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const largeSlideRef = useRef();

  const changeSlideTo = (index) => {
    setSlideIndex(index);
    largeSlideRef.current.swiper.slideTo(index);
  };

  if (!imageAddress || imageAddress.length === 0 ) return null;

  return (
    <div>
      <div className="p-2">
        <div className="flex md:flex-row flex-col gap-3">
          <div className="order-2 md:order-1">
            <Swiper className="" slidesPerView={4} direction={"vertical"}>
              {imageAddress.map((image, index) => {
                return (
                  <SwiperSlide
                    className={`!size-[100px] cursor-pointer ${
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
          <div className="order-1">
            <Swiper className="w-[350px]" slidesPerView={1} ref={largeSlideRef}>
              {imageAddress.map((image, index) => {
                return (
                  <SwiperSlide key={index}>
                    {index === slideIndex && (
                      <InnerImageZoom
                        src={image}
                        zoomScale={1}
                        zoomType="hover"
                        zoomPreload={true} 
                      />
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
