import { useContext, useEffect } from "react";
import useAuthStore from "../store/authStore";
import { Outlet, useNavigate } from "react-router-dom";
import MyContext from "../Context/MyContext";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const PersistentLogin = () => {
  const { getMe } = useAuthStore.getState();
  const navigator = useNavigate();
  const isLoading = useAuthStore((s) => s.isLoading);
  const axiosPrivate = useAxiosPrivate();

  let isGetMeCalled = false;

  useEffect(() => {
    if (isGetMeCalled) return;

    const handleGetMe = async () => {
      isGetMeCalled = true;
      try {
        await getMe(axiosPrivate);
      } catch (error) {
        console.error(error);
        isGetMeCalled = false;
      }
    };

    handleGetMe();
  }, []);

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
