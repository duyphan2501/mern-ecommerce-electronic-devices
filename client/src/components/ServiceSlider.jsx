import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ServiceCard from "./ServiceCard";

const services = [
  {
    image: "https://powertech.vn/thumbs/380x280x1/upload/news/powertech-8027.png",
    name: "Sửa chữa thiết bị điện",
  },
  {
    image: "https://powertech.vn/thumbs/380x280x1/upload/news/powertech-8027.png",
    name: "Lắp đặt hệ thống điện mặt trời",
  },
  {
    image: "https://powertech.vn/thumbs/380x280x1/upload/news/powertech-8027.png",
    name: "Bảo trì hệ thống điện",
  },
  {
    image: "https://powertech.vn/thumbs/380x280x1/upload/news/powertech-8027.png",
    name: "Tư vấn giải pháp điện năng lượng mặt trời",
  },
  {
    image: "https://powertech.vn/thumbs/380x280x1/upload/news/powertech-8027.png",
    name: "Cung cấp thiết bị điện",
  },
]

const ServiceSlider = () => {
  return (
    <div>
      <div className="container bg-white">
        <Swiper
          slidesPerView={6}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1.2 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          navigation={true}
          modules={[Navigation]}
          className="ProductSlider"
        >
          {services.map((service, index) => {
            return (
              <SwiperSlide className="py-2">
                <ServiceCard image={service.image} name={service.name}/>
              </SwiperSlide>
            )
          })}
        </Swiper>
    </div>
    </div>
  )
}

export default ServiceSlider