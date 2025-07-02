import { IoSearch, IoBagCheckOutline, IoCartOutline } from "react-icons/io5";
import { MdOutlineRocketLaunch } from "react-icons/md";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useContext, useState } from "react";
import CategoryDrawer from "./CategoryDrawer";
import MyContext from "../Context/MyContext";
import NavLinkHeader from "./NavLinkHeader";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const isLogin = true;

const Header = () => {
  const [open, setOpen] = useState(false);
  const {openCart} = useContext(MyContext)
  return (
    <header className="sticky top-0 z-50 !bg-white shadow-sm h-32">
      <div className="!py-2 border-b-[1px] border-[#e5e7eb]">
        <div className="container flex justify-between gap-3 ">
          <div className="col1 w-[15%]">
            <a className="logo" href="/">
              <img
                src="/image/logo.jpg"
                alt="Logo"
                loading="lazy"
                className="w-[130px] h-auto"
              />
            </a>
          </div>
          <div className="col2 w-[60%] flex items-center">
            <div className="border-[1px] border-gray-300 rounded-xl h-[80%] w-full flex items-center px-3 overflow-hidden">
              <IoSearch size={25} className="text-gray-400" />
              <input
                type="text"
                name=""
                id=""
                className="ms-2 search-input w-full border-r-[1px] border-r-gray-300 text-gray-500"
                placeholder="Mô-đun NXH350N100H4Q2F2P1G"
              />
              <Button
                variant="text"
                className="h-full !mr-[-13px] !ml-[-1px] !px-5 text-nowrap !rounded-[0]"
              >
                Tìm kiếm
              </Button>
            </div>
          </div>
          <div className="col3 w-[25%] flex items-center justify-end">
            <ul className="flex items-center justify-end lg:gap-5 w-full">
              {isLogin? <li>
                
              </li>:
              <li>
                <Link className="text-gray-500 text-[15px] link" to={"/login"}>
                  Đăng nhập
                </Link>
                <span className="text-gray-300 mx-2">|</span>
                <Link
                  className="text-gray-500 text-[15px] link"
                  to={"/register"}
                >
                  Đăng ký
                </Link>
              </li>}
              
              <li>
                <Link to={"/wishlist"}>
                  <Tooltip title="Đơn hàng" arrow>
                    <IconButton aria-label="wishlist">
                      <StyledBadge badgeContent={4} color="secondary">
                        <IoBagCheckOutline className="text-[#0d68f3]" />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </Link>
              </li>
              <li>
                <Tooltip title="Giỏ hàng" arrow>
                  <IconButton aria-label="cart" onClick={openCart}>
                    <StyledBadge badgeContent={4} color="secondary">
                      <IoCartOutline className="text-[#0d68f3]" />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <nav>
        <div className="container">
          <div className="flex items-center gap-7">
            <div className="col1 w-[20%]">
              <CategoryDrawer isOpenDrawer={open} setOpenDrawer={setOpen}/>
            </div>
            <div className="col2 xl:w-[50%]">
              <NavLinkHeader />
            </div>
            <div className="col3 xl:flex items-center gap-2 hidden text-content">
              <MdOutlineRocketLaunch size={20} />
              Free Ship đơn hàng từ 500.000đ
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
