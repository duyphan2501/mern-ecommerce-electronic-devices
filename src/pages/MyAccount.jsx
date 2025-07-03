import { IoIosCamera } from "react-icons/io";
import {
  MdOutlineLocationOn,
  MdPersonOutline,
  MdOutlineLogout,
} from "react-icons/md";
import { IoBagCheckOutline } from "react-icons/io5";
import { Component, useContext, useState } from "react";
import { Button } from "@mui/material";
import Profile from "../components/MyAccount/Profile";
import Address from "../components/MyAccount/Address";
import MyContext from "../Context/MyContext";
import { Link } from "react-router-dom";
import Order from "../components/MyAccount/Order";
const defaultAvatar = {
  src: "https://frontend.tikicdn.com/_desktop-next/static/img/account/avatar.png",
  class: "size-9 object-contain",
};
const avatar = false;

const tabs = [
  {
    icon: <MdPersonOutline size={25} />,
    label: "Thông tin tài khoản",
  },
  {
    icon: <MdOutlineLocationOn size={25} />,
    label: "Sổ địa chỉ",
  },
  {
    icon: <IoBagCheckOutline size={22} />,
    label: "Đơn hàng của tôi",
  },
];

const MyAccount = () => {
  const {setIsLogin} = useContext(MyContext)
  const [activeTab, setActiveTab] = useState(0);
  const handleActiveTab = (index) => {
    setActiveTab(index);
  };
  return (
    <div>
      <div className="container py-10 lg:px-20 flex gap-5">
        <div className="w-1/4 bg-white rounded-md border border-gray-200 shadow h-fit">
          <div className="flex flex-col justify-center items-center gap-1 p-5">
            <div className="size-25 rounded-full border-5 border-blue-200 relative group flex items-center justify-center">
              <img
                src={`${defaultAvatar.src}`}
                alt=""
                className={
                  !avatar ? `${defaultAvatar.class}` : "size-full object-cover"
                }
              />
              {/* <div className="invisible group-hover:visible">
                <div className="absolute inset-0 bg-black opacity-50 "></div>
                <div className="absolute inset-0 z-10 flex items-center justify-center text-white">
                  <MdUpload size={30} />
                </div>
              </div> */}
              <label className="absolute -bottom-2 -right-2 flex items-center justify-center cursor-pointer">
                <span className="p-1 rounded-full transition hover:bg-gray-300">
                  <IoIosCamera size={30} />
                </span>
                <input type="file" className="hidden" />
              </label>
            </div>
            <p className="font-semibold text-lg">Duy Phan</p>
            <p className="text-sm">duyphan2501@gmail.com</p>
          </div>
          <div className="bg-gray-100 pb-5 rounded-b-md">
            <ul className="">
              {tabs.map((tab, index) => (
                <li key={index}>
                  <Button
                    className={`!rounded-none !items-center !w-full !py-2 !gap-2 !pl-4 !justify-start !normal-case !text-gray-700 ${
                      activeTab === index && "!shadow-[inset_4px_0_0_#dc2626] !bg-gray-200"
                    }`}
                    onClick={() => handleActiveTab(index)}
                  >
                    <span className="w-7">{tab.icon}</span>
                    {tab.label}
                  </Button>
                </li>
              ))}
                <li>
                  <Button
                    className={`!rounded-none !items-center !w-full !py-2 !gap-2 !pl-4 !justify-start !normal-case !text-gray-700`}
                    onClick={() => setIsLogin(false)}
                    component={Link} to={"/"}
                  >
                    <span className="w-7"><MdOutlineLogout size={25} /></span>
                    Đăng xuất
                  </Button>
                </li>
            </ul>
          </div>
        </div>
        <div className="w-3/4 ">
            {activeTab === 0 && <Profile />}
            {activeTab === 1 && <Address />}
            {activeTab === 2 && <Order />}
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
