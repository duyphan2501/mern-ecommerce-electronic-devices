import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from 'swiper/modules';

import DashboardCard from "./DashboardCard";
import { MdOutlineAttachMoney } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { TbUsersGroup } from "react-icons/tb";
import { BsBarChart } from "react-icons/bs";
import { FcComboChart } from "react-icons/fc";
import { BiBarChart } from "react-icons/bi";

const DashboardCardSlider = () => {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={3}
      breakpoints={{
        320: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      navigation={true}
      modules={[Navigation]} 
    >
      <SwiperSlide>
        <DashboardCard
          icon={<MdOutlineAttachMoney size={30} className="text-green-600" />}
          label="Total Revenue"
          price={123456789}
          chartIcon={<BsBarChart size={50} className="text-green-600"/>}
          gapLastmonth={32.30}
        />
      </SwiperSlide>

      <SwiperSlide>
        <DashboardCard
          icon={<AiOutlineShoppingCart size={30} className="text-blue-500" />}
          label="Total Orders"
          number={2345}
          chartIcon={<FcComboChart size={50}/>}
          gapLastmonth={2.30}
        />
      </SwiperSlide>


      <SwiperSlide>
        <DashboardCard
          icon={<MdOutlineAttachMoney size={30} className="text-orange-400" />}
          label="Refunded"
          price={74321}
          chartIcon={<BsBarChart size={50} className="text-orange-400"/>}
          gapLastmonth={-3.30}
        />
      </SwiperSlide>


      <SwiperSlide>
        <DashboardCard
          icon={<TbUsersGroup size={30} className="text-purple-500" />}
          label="New Users"
          number={865}
          chartIcon={<BiBarChart size={50} className="text-purple-500"/>}
          gapLastmonth={-2.30}
        />
      </SwiperSlide>
    </Swiper>
  );
};

export default DashboardCardSlider;
