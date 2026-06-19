import "react-inner-image-zoom/lib/styles.min.css";
import InnerImageZoom from "react-inner-image-zoom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoChevronBack, IoChevronForward, IoClose } from "react-icons/io5";

const ProductZoom = ({ imageAddress }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSmallDevice, setIsSmallDevice] = useState(false);
  const largeSlideRef = useRef();
  const imageCount = imageAddress?.length || 0;
  const hasMultipleImages = imageCount > 1;

  const changeSlideTo = (index) => {
    setSlideIndex(index);
    largeSlideRef.current.swiper.slideTo(index);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  const showPreviousImage = useCallback(() => {
    setLightboxIndex((currentIndex) =>
      currentIndex === 0 ? imageCount - 1 : currentIndex - 1,
    );
  }, [imageCount]);

  const showNextImage = useCallback(() => {
    setLightboxIndex((currentIndex) =>
      currentIndex === imageCount - 1 ? 0 : currentIndex + 1,
    );
  }, [imageCount]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateSize = () => setIsSmallDevice(mediaQuery.matches);

    updateSize();
    mediaQuery.addEventListener("change", updateSize);
    return () => mediaQuery.removeEventListener("change", updateSize);
  }, []);

  useEffect(() => {
    setSlideIndex(0);
    setLightboxIndex(0);
    setIsLightboxOpen(false);
    largeSlideRef.current?.swiper?.slideTo(0);
  }, [imageAddress]);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (!hasMultipleImages) return;

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    closeLightbox,
    hasMultipleImages,
    imageCount,
    isLightboxOpen,
    showNextImage,
    showPreviousImage,
  ]);

  if (!imageAddress || imageCount === 0) return null;

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
                      <button
                        type="button"
                        className="block aspect-square w-full cursor-zoom-in overflow-hidden border-0 bg-white p-0"
                        onClick={() => openLightbox(index)}
                        aria-label="Open product image fullscreen"
                      >
                        {isSmallDevice ? (
                          <img
                            src={image}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <InnerImageZoom
                            src={image}
                            zoomScale={1}
                            zoomType="hover"
                            zoomPreload={true}
                            className="h-full w-full"
                          />
                        )}
                      </button>
                    )}
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </div>
      </div>
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/90 p-3 sm:p-6"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Product image fullscreen gallery"
        >
          <button
            type="button"
            className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:right-5 sm:top-5"
            onClick={closeLightbox}
            aria-label="Close fullscreen image"
          >
            <IoClose size={28} />
          </button>

          {hasMultipleImages && (
            <button
              type="button"
              className="absolute left-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:left-5 sm:size-12"
              onClick={(event) => {
                event.stopPropagation();
                showPreviousImage();
              }}
              aria-label="Show previous product image"
            >
              <IoChevronBack size={30} />
            </button>
          )}

          <img
            src={imageAddress[lightboxIndex]}
            alt=""
            className="max-h-[88vh] max-w-[92vw] object-contain"
            onClick={(event) => event.stopPropagation()}
          />

          {hasMultipleImages && (
            <button
              type="button"
              className="absolute right-3 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 sm:right-5 sm:size-12"
              onClick={(event) => {
                event.stopPropagation();
                showNextImage();
              }}
              aria-label="Show next product image"
            >
              <IoChevronForward size={30} />
            </button>
          )}

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-sm font-medium text-white">
            {lightboxIndex + 1} / {imageCount}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductZoom;
