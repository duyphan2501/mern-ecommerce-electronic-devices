import { RxDashboard } from "react-icons/rx";
import { BsJournalText } from "react-icons/bs";
import { TbSlideshow, TbBrandProducthunt } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import {
  MdInventory2,
  MdMiscellaneousServices,
  MdOutlineCategory,
} from "react-icons/md";
import NavItem from "./NavItem";
import Submenu from "./Submenu";
import { useContext } from "react";
import MyContext from "../../Context/MyContext";
import NavItemSmall from "./NavItemSmall";

const navItems = [
  {
    icon: <RxDashboard size={20} />,
    smallIcon: <RxDashboard size={25} />,
    label: "Dashboard",
    link: "/",
  },
  {
    icon: <MdMiscellaneousServices size={20} />,
    smallIcon: <MdMiscellaneousServices size={25} />,
    label: "Services",
    link: "/services",
  },
  {
    icon: <BsJournalText size={20} />,
    smallIcon: <BsJournalText size={25} />,
    label: "Blogs",
    link: "/blogs",
    navItems: [
      { label: "All Blogs", link: "/blogs" },
      { label: "Add Blog", link: "/blogs/add" },
    ],
  },
  {
    icon: <TbSlideshow size={20} />,
    smallIcon: <TbSlideshow size={25} />,
    label: "Home Slides",
    link: "/home-slides/all",
    navItems: [
      { label: "All Slides", link: "/home-slides/all" },
      { label: "Add Slide", link: "/home-slides/add" },
    ],
  },
  {
    icon: <TbBrandProducthunt size={20} />,
    smallIcon: <TbBrandProducthunt size={25} />,
    label: "Products",
    link: "/products/list",
    navItems: [
      { label: "Create", link: "/products/create" },
      { label: "List", link: "/products/list" },
    ],
  },
  {
    icon: <MdInventory2 size={20} />,
    smallIcon: <MdInventory2 size={25} />,
    label: "Inventory",
    link: "/inventory",
  },
  {
    icon: <MdOutlineCategory size={20} />,
    smallIcon: <MdOutlineCategory size={25} />,
    label: "Categories",
    link: "/categories",
  },
  {
    icon: <IoBagCheckOutline size={20} />,
    smallIcon: <IoBagCheckOutline size={25} />,
    label: "Orders",
    link: "/orders",
  },
];

const Sidebar = () => {
  const { isOpenSidebar, indexImageView, isOpenQuesBox } =
    useContext(MyContext);
  return (
    <nav
      className={` h-screen sticky top-0 left-0 bg-white border-r-2 border-gray-200 ${
        indexImageView === -1 && !isOpenQuesBox && "z-10"
      }`}
    >
      <div className="logo p-3 mb-2">
        <img src="/logo.jpg" alt="Logo" className="w-full h-14" />
      </div>
      <div className="navlink">
        {isOpenSidebar ? (
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                {item.navItems ? (
                  <Submenu
                    icon={item.icon}
                    label={item.label}
                    link={item.link}
                    navItems={item.navItems}
                  />
                ) : (
                  <NavItem
                    icon={item.icon}
                    label={item.label}
                    link={item.link}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col items-center">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavItemSmall
                  icon={item.smallIcon}
                  label={item.label}
                  link={item.link}
                  navItems={item.navItems}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
