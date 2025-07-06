import { Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const NavItem = ({ icon, label, link }) => {
  const location = useLocation();
  const isActive = link === location.pathname;
  return (
    <div className="relative px-5">
      <Button
        component={Link}
        className={`!w-full  !capitalize !justify-start !items-center gap-2 hover:!bg-gray-200 !transition-none ${
          isActive ? "!text-blue-500" : "!text-gray-700"
        }`}
        to={link}
        sx={{ fontFamily: "Outfit, sans-serif" }}
      >
          {icon} {label}
      </Button>
      {isActive && (
        <div className="absolute left-0 top-0 h-full w-[5px] bg-blue-500 rounded-r"></div>
      )}
    </div>
  );
};

export default NavItem;
