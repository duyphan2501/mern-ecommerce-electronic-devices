import { Button, Tooltip } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

const getSectionPath = (link) => {
  const [, section] = link.split("/");
  return section ? `/${section}` : link;
};

const NavItemSmall = ({ icon, label, link = "", navItems = [] }) => {
  const location = useLocation();
  const sectionPath = getSectionPath(link || navItems[0]?.link || "");
  const isActive =
    link === location.pathname ||
    (link !== "/" && location.pathname.startsWith(`${link}/`)) ||
    navItems.some((item) => item.link === location.pathname) ||
    (sectionPath && location.pathname.startsWith(`${sectionPath}/`));
  return (
    <>
      {navItems.length > 0 ? (
        <div
          className="size-12 rounded flex justify-center items-center !relative group transition"
        >
          <Tooltip title={label} arrow placement="right" disableInteractive>
            <Button
              component={Link}
              to={link}
              className={`!size-12 !min-w-12 hover:!bg-gray-200 !flex !p-0 !justify-center !items-center !relative ${
                isActive ? "!text-blue-500" : "!text-gray-700"
              }`}
            >
              {icon}
            </Button>
          </Tooltip>
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
        <Tooltip title={label} arrow placement="right" disableInteractive>
          <Button
            component={Link}
            to={link}
            className={`!size-12 !min-w-12  hover:!bg-gray-200 !flex !p-0 !justify-center !items-center !relative group ${
              isActive ? "!text-blue-500" : "!text-gray-700"
            }`}
          >
            {icon}
          </Button>
        </Tooltip>
      )}
    </>
  );
};

export default NavItemSmall;
