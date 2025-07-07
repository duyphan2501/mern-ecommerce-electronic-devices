import { Button, IconButton, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const NavItemSmall = ({ icon, label, link="", navItems = [] }) => {
  const location = useLocation();
  const isActive =
    link === location.pathname ||
    navItems.some((item) => item.link === location.pathname);
  return (
    <>
      {navItems.length > 0 ? (
        <div
          className={`size-12 rounded hover:bg-gray-200 flex justify-center items-center !relative group transition ${
            isActive && "text-blue-500"
          }`}
        >
          {icon}
          <ul className="absolute left-[100%] border border-gray-200 bg-white rounded-md shadow p-3 z-100 invisible opacity-0 top-5 group-hover:opacity-100 group-hover:top-0 transition-all duration-300 group-hover:visible">
            {navItems.map((item, index) => {
              const isSubActive = item.link === location.pathname;
              return (
                <li key={index}>
                  <Button
                    component={Link}
                    to={item.link}
                    sx={{ fontFamily: "Outfit, sans-serif" }}
                    className={`!w-[140px] !justify-start !text-sm !capitalize !transition-none ${
                      isSubActive
                        ? "!text-blue-600 !bg-gray-100"
                        : "!text-gray-600 hover:!bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <Link to={link}>
          <Tooltip title={label} arrow placement="right" disableInteractive sx={{fontWeight:"700"}}>
            <Button
              className={`!size-12 !min-w-12  hover:!bg-gray-200 !flex !p-0 !justify-center !items-center !relative group ${
                isActive?"!text-blue-500": "!text-gray-700"
              }`}
            >
              {icon}
            </Button>
          </Tooltip>
        </Link>
      )}
    </>
  );
};

export default NavItemSmall;
