import { useContext, useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { Outlet } from "react-router-dom";
import MyContext from "../Context/MyContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const PersistentLogin = () => {
  const { refreshToken, isLoading } = useAuthStore();
  const { persist } = useContext(MyContext);
  const user = useAuthStore((state) => state.user);
  
  const [didCheck, setDidCheck] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        if (!user && persist) {
          await refreshToken();
        }
      } catch (error) {
        console.error("Session expired, please login again.");
      } finally {
        if (isMounted) setDidCheck(true);
      }
    };

    !user && persist ? verifyRefreshToken() : setDidCheck(true);

    return () => {
      isMounted = false;
    };
  }, []); 

  if (!persist) return <Outlet />;

  return (
    <>
      {!didCheck || isLoading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <AiOutlineLoading3Quarters className="animate-spin text-white" size={50} />
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistentLogin;