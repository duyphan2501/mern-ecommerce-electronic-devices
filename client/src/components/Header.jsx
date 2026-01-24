import { IoSearch, IoBagCheckOutline, IoCartOutline } from "react-icons/io5";
import { MdOutlineRocketLaunch } from "react-icons/md";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useContext, useState } from "react";
import CategoryDrawer from "./CategoryDrawer";
import MyContext from "../Context/MyContext";
import NavLinkHeader from "./NavLinkHeader";
import { Menu, MenuItem } from "@mui/material";
import { FaRegSmileWink } from "react-icons/fa";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import useCartStore from "../store/cartStore.js";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${(theme.vars ?? theme).palette.background.paper}`,
    padding: "0 4px",
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const navigator = useNavigate();

  const openProfile = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const cart = useCartStore((state) => state.cart);

  const { openCart } = useContext(MyContext);
  const { user, logout } = useAuthStore();
  const axiosPrivate = useAxiosPrivate();

  const handleLogout = async () => {
    try {
      await logout(axiosPrivate);
      toast.success(useAuthStore.getState().message);
      navigator("/");
    } catch (error) {
      toast.error(useAuthStore.getState().message);
      console.log(error);
    }
  };

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
                placeholder="Tìm kiếm sản phẩm"
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
              {user ? (
                <li className="size-10 flex justify-end items-center flex-1">
                  <Button
                    className="!bg-gray-100 hover:!bg-gray-300 !items-center !normal-case !text-gray-500 !gap-1 text-nowrap"
                    aria-controls={openProfile ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openProfile ? "true" : undefined}
                    onClick={handleClick}
                  >
                    <FaRegSmileWink size={25} />
                    Tài khoản
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={openProfile}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                      paper: {
                        elevation: 0,
                        sx: {
                          overflow: "visible",
                          filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                          mt: 1.5,
                          "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                          },
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem
                      component={Link}
                      to={"/my-account/profile"}
                      onClick={handleClose}
                    >
                      Hồ sơ cá nhân
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to={"/my-account/address"}
                      onClick={handleClose}
                    >
                      Sổ địa chỉ
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to={"/my-account/orders"}
                      onClick={handleClose}
                    >
                      Đơn hàng của tôi
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                  </Menu>
                </li>
              ) : (
                <li>
                  <Link
                    className="text-gray-500 text-[15px] link"
                    to={"/login"}
                  >
                    Đăng nhập
                  </Link>
                  <span className="text-gray-300 mx-2">|</span>
                  <Link
                    className="text-gray-500 text-[15px] link"
                    to={"/register"}
                  >
                    Đăng ký
                  </Link>
                </li>
              )}

              <li>
                {/* <Link to={"/wishlist"}> */}
                <Tooltip title="Đơn hàng" arrow>
                  <IconButton
                    aria-label="orders"
                    component={Link}
                    to={"/my-account/orders"}
                  >
                    <IoBagCheckOutline className="text-[#0d68f3]" />
                  </IconButton>
                </Tooltip>
                {/* </Link> */}
              </li>
              <li>
                <Tooltip title="Giỏ hàng" arrow>
                  <IconButton aria-label="cart" onClick={openCart}>
                    <StyledBadge
                      badgeContent={cart?.items.length || 0}
                      color="secondary"
                    >
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
              <CategoryDrawer isOpenDrawer={open} setOpenDrawer={setOpen} />
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
