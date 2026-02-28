import { IoBagCheckOutline, IoCartOutline } from "react-icons/io5";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { useContext, useState } from "react";
import MyContext from "../Context/MyContext";
import NavLinkHeader from "./NavLinkHeader";
import { Menu, MenuItem } from "@mui/material";
import { FaRegSmileWink } from "react-icons/fa";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import useCartStore from "../store/cartStore.js";
import Search from "./Search.jsx";

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
  const navigator = useNavigate();

  const openProfile = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

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
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* ===== TOP HEADER ===== */}
      <div className="border-b border-gray-200">
        <div className="container flex items-center justify-between gap-3 flex-wrap py-2">

          {/* LOGO */}
          <div className="w-auto">
            <Link to="/" className="logo">
              <img
                src="/image/logo.jpg"
                alt="Logo"
                className="w-[110px] md:w-[130px]"
              />
            </Link>
          </div>

          {/* ICONS */}
          <div className="flex items-center gap-2 order-2 md:order-3">

            {user ? (
              <>
                <Button
                  className="!bg-gray-100 hover:!bg-gray-300 !text-gray-600 !normal-case !gap-1"
                  onClick={handleClick}
                >
                  <FaRegSmileWink size={20} />
                  <span className="sm:inline">Tài khoản</span>
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={openProfile}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <MenuItem component={Link} to="/my-account/profile" className="!text-sm">
                    Hồ sơ cá nhân
                  </MenuItem>
                  <MenuItem component={Link} to="/my-account/address" className="!text-sm">
                    Sổ địa chỉ
                  </MenuItem>
                  <MenuItem component={Link} to="/my-account/orders" className="!text-sm">
                    Đơn hàng của tôi
                  </MenuItem>
                  <MenuItem className="!text-sm" onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </>
            ) : (
              <div className="text-sm">
                <Link className="text-gray-500" to="/login">Đăng nhập</Link>
                <span className="mx-2 text-gray-300">|</span>
                <Link className="text-gray-500" to="/register">Đăng ký</Link>
              </div>
            )}

            {/* <Tooltip title="Đơn hàng">
              <IconButton component={Link} to="/my-account/orders">
                <IoBagCheckOutline className="text-[#0d68f3]" />
              </IconButton>
            </Tooltip> */}

            <Tooltip title="Giỏ hàng">
              <IconButton onClick={openCart}>
                <StyledBadge
                  badgeContent={cart?.items?.length || 0}
                  color="secondary"
                >
                  <IoCartOutline className="text-[#0d68f3]" />
                </StyledBadge>
              </IconButton>
            </Tooltip>

          </div>

          {/* SEARCH */}
          <div className="w-full md:flex-1 md:order-2 order-3 min-w-[220px] md:mx-10">
            <Search />
          </div>

        </div>
      </div>

      {/* ===== NAVIGATION ===== */}
      <nav className="">
        <div className="container">
          <NavLinkHeader />
        </div>
      </nav>
    </header>
  );
};

export default Header;