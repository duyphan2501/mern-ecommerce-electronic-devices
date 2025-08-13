import { useContext } from "react";
import MyContext from "../Context/MyContext";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = () => {
  const { isOpenSidebar } = useContext(MyContext);
  return (
    <>
      <div className="flex h-full">
        <div
          className={`transition-all ${
            isOpenSidebar ? "w-[18%] min-w-[270px]" : "w-[6%]"
          } min-w-[80px]`}
        >
          <Sidebar />
        </div>
        <main
          className={`${isOpenSidebar ? "w-[82%]" : "w-[94%]"} relative z-0`}
        >
          <Header />
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
