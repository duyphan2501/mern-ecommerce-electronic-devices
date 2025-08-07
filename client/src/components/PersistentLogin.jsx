import { useContext, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MyContext from "../Context/MyContext";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const PersistentLogin = () => {
  const { user, refreshToken, isLoading } = useAuthStore();
  const { persist } = useContext(MyContext);
  const navigator = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      try {
        if (!persist) throw new Error();
        if (user) return;
        await refreshToken();
      } catch (error) {
        if (isMounted) {
          console.log(error);
          if (
            location.pathname === "/cart" ||
            location.pathname === "/checkout" ||
            location.pathname === "/my-account"
          ) {
            toast.error("Bạn cần phải đăng nhập trước!");
            navigator("/login");
          }
        }
      }
    };
    refresh();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  return (
    <>
      {isLoading ? (
        <>
          <div className="fixed inset-0 z-50 bg-black opacity-30"></div>
          <div className="fixed inset-0 z-60 flex items-center justify-center">
            <AiOutlineLoading3Quarters
              className="animate-spin text-white"
              size={50}
            />
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistentLogin;
