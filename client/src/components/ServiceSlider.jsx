import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import ServiceCard from "./ServiceCard";
import serviceImage1 from "/image/8b67d689-58c9-4ae3-b09f-be392f9a9bb7.jpg"
import serviceImage2 from "/image/88c0fb88-77e5-4b51-871b-e130769da504.jpg"

const services = [
  {
    image: serviceImage1,
    name: "Sửa chữa thiết bị điện",
  },
  {
    image: serviceImage2,
    name: "Lắp đặt hệ thống điện mặt trời",
  },
  {
    image: serviceImage1,
    name: "Bảo trì hệ thống điện",
  },
  {
    image: serviceImage2,
    name: "Tư vấn giải pháp điện năng lượng mặt trời",
  },
  {
    image: serviceImage1,
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
              <SwiperSlide className="py-2" key={index}>
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