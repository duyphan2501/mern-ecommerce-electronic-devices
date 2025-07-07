import { Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";
import { RxDotFilled } from "react-icons/rx";
import { useEffect, useState } from "react";
const Submenu = ({ icon, label, navItems = [] }) => {
  const location = useLocation();
  const isActive = navItems.some(
    (item) => item.link === location.pathname
  );
  const [isOpenSubmenu, setIsOpenSubmenu] = useState(false);
  useEffect(() => {
    if (isActive) setIsOpenSubmenu(true);
  }, []);

  return (
    <div className="">
      <div className="relative px-5">
        <Button
          className={`!w-full  !capitalize !justify-between !items-center hover:!bg-gray-200 !transition-none ${
            isActive ? "!text-blue-500" : "!text-gray-700"
          }`}
          sx={{ fontFamily: "Outfit, sans-serif" }}
          onClick={() => setIsOpenSubmenu(!isOpenSubmenu)}
        >
          <div className="flex items-center gap-2">
            {icon} {label}
          </div>
          <div className="">
            <IoIosArrowForward
              className={`duration-100 ease-in ${
                isOpenSubmenu ? "rotate-90" : "rotate-0"
              }`}
            />
          </div>
        </Button>
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-[5px] bg-blue-500 rounded-r"></div>
        )}
      </div>
      {/* Hiển thị các mục con nếu có */}
      <div className={`px-8 mt-1 overflow-hidden ${isOpenSubmenu? "max-h-130 ":"max-h-0 "}`}>
          <ul className="space-y-1 ">
            {navItems.map((item, index) => {
              const isSubActive = location.pathname === item.link;
              return (
                <li key={index}>
                  <Button
                    component={Link}
                    to={item.link}
                    className={`!w-full !justify-start !gap-2 !text-sm !capitalize !transition-none ${
                      isSubActive
                        ? "!text-blue-600 !bg-gray-100"
                        : "!text-gray-600 hover:!bg-gray-100"
                    }`}
                    sx={{ fontFamily: "Outfit, sans-serif" }}
                    startIcon={<RxDotFilled size={18} />}
                  >
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
      </div>
    </div>
  );
};

export default Submenu;
