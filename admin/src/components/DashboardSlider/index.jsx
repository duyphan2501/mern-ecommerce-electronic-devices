import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { MdOutlineAttachMoney } from "react-icons/md";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { TbUsersGroup } from "react-icons/tb";
import { BsBarChart } from "react-icons/bs";
import { FcComboChart } from "react-icons/fc";
import { BiBarChart } from "react-icons/bi";
import DashboardCard from "./DashboardCard";

const DashboardCardSlider = ({ summary = {} }) => {
  const cards = [
    {
      icon: <MdOutlineAttachMoney size={30} className="text-green-600" />,
      label: "Delivered Revenue",
      price: summary.revenue?.value || 0,
      chartIcon: <BsBarChart size={40} className="text-green-600" />,
      change: summary.revenue?.change || 0,
    },
    {
      icon: <AiOutlineShoppingCart size={30} className="text-blue-500" />,
      label: "Orders",
      number: summary.orders?.value || 0,
      chartIcon: <FcComboChart size={50} />,
      change: summary.orders?.change || 0,
    },
    {
      icon: <TbUsersGroup size={30} className="text-purple-500" />,
      label: "Customers",
      number: summary.customers?.value || 0,
      chartIcon: <BiBarChart size={50} className="text-purple-500" />,
      change: summary.customers?.change || 0,
    },
    {
      icon: <AiOutlineShoppingCart size={30} className="text-orange-500" />,
      label: "Items Sold",
      number: summary.itemsSold?.value || 0,
      chartIcon: <BsBarChart size={40} className="text-orange-500" />,
      change: summary.itemsSold?.change || 0,
    },
  ];

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        500: { slidesPerView: 1.5 },
        670: { slidesPerView: 2.5 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
      navigation
      modules={[Navigation]}
    >
      {cards.map((card) => (
        <SwiperSlide key={card.label}>
          <DashboardCard
            icon={card.icon}
            label={card.label}
            number={card.number}
            price={card.price}
            chartIcon={card.chartIcon}
            gapLastmonth={card.change}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default DashboardCardSlider;
