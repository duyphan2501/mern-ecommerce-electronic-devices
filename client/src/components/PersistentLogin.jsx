import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import { Outlet } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const PersistentLogin = () => {
  const { getMe } = useAuthStore.getState();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const handleGetMe = async () => {
      try {
        await getMe(axiosPrivate);
      } catch (error) {
        console.error("Silent persistent login failed:", error);
      }
    };

    handleGetMe();
  }, []);

  return <Outlet />;
};

export default PersistentLogin;
