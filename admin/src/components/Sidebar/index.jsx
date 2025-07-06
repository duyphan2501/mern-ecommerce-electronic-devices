import { RxDashboard } from "react-icons/rx";
import { TbSlideshow, TbBrandProducthunt } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import NavItem from "./NavItem";
import Submenu from "./Submenu";

const Sidebar = () => {
  return (
    <nav className="w-70 h-screen fixed top-0 left-0 shadow bg-white">
      <div className="logo p-3 mb-2">
        <img src="logo.jpg" alt="Logo" className="w-full h-14 object-contain" />
      </div>
      <div className="navlink">
        <ul className="space-y-2">
          <li>
            <NavItem
              icon={<RxDashboard size={20} />}
              label="Dashboard"
              link="/"
            />
          </li>
          <li>
            <Submenu
              icon={<TbSlideshow size={20} />}
              label="Home Slides"
              link="/home-slides"
              navItems={[
                { label: "All Slides", link: "/home-slides/all" },
                { label: "Add Slide", link: "/home-slides/add" },
              ]}
            />
          </li>
          <li>
            <NavItem
              icon={<TbBrandProducthunt size={20} />}
              label="Products"
              link="/products"
            />
          </li>
          <li>
            <NavItem
              icon={<MdOutlineCategory size={20} />}
              label="Categories"
              link="/categories"
            />
          </li>
          <li>
            <NavItem
              icon={<IoBagCheckOutline size={20} />}
              label="Orders"
              link="/orders"
            />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
