import { RxDashboard } from "react-icons/rx";
import { TbSlideshow, TbBrandProducthunt } from "react-icons/tb";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdOutlineCategory } from "react-icons/md";
import NavItem from "./NavItem";
import Submenu from "./Submenu";
import { useContext } from "react";
import MyContext from "../../Context/MyContext";
import NavItemSmall from "./NavItemSmall";

const Sidebar = () => {
  const {isOpenSidebar, indexImageView} = useContext(MyContext)
  return (
    <nav className={` h-screen sticky top-0 left-0 bg-white border-r-2 border-gray-200 ${indexImageView === -1 && "z-10"}`}>
      <div className="logo p-3 mb-2">
        <img src="/logo.jpg" alt="Logo" className="w-full h-14" />
      </div>
      <div className="navlink">
        {isOpenSidebar?
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
              navItems={[
                { label: "All Slides", link: "/home-slides/all" },
                { label: "Add Slide", link: "/home-slides/add" },
              ]}
            />
          </li>
          <li>
            <Submenu
              icon={<TbBrandProducthunt size={20} />}
              label="Products"
              navItems={[
                { label: "Create", link: "/products/create" },
                { label: "List", link: "/products/list" },
              ]}
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
        </ul>:
        <ul className="flex flex-col items-center">
          <li>
            <NavItemSmall
              icon={<RxDashboard size={25} />}
              label="Dashboard"
              link="/"
            />
          </li>
          <li>
            <NavItemSmall
              icon={<TbSlideshow size={25} />}
              label="Home Slides"
              navItems={[
                { label: "All Slides", link: "/home-slides/all" },
                { label: "Add Slide", link: "/home-slides/add" },
              ]}
            />
          </li>
          <li>
            <NavItemSmall
              icon={<TbBrandProducthunt size={25} />}
              label="Products"
              navItems={[
                { label: "Create", link: "/products/create" },
                { label: "List", link: "/products/list" },
              ]}
            />
          </li>
          <li>
            <NavItemSmall
              icon={<MdOutlineCategory size={25} />}
              label="Categories"
              link="/categories"
            />
          </li>
          <li>
            <NavItemSmall
              icon={<IoBagCheckOutline size={25} />}
              label="Orders"
              link="/orders"
            />
          </li>
        </ul>}
      </div>
    </nav>
  );
};

export default Sidebar;
