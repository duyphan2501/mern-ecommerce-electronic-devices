import { useContext } from "react";
import MyContext from "../Context/MyContext";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useAuthStore from "../store/authStore";

const Layout = () => {
  const { isOpenSidebar } = useContext(MyContext);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <>
        <div className="fixed inset-0 z-50 bg-black opacity-30"></div>
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <AiOutlineLoading3Quarters
            className="animate-spin text-white"
            size={50}
          />
        </div>
      </>
    );
  }
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
        <main className={`${isOpenSidebar ? "w-[82%]" : "w-[94%]"} relative`}>
          <Header />
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
