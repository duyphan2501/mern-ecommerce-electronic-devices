import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const ProtectedRoute = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isLoading = useAuthStore(s => s.isLoading)

  useEffect(() => {
    if (!user) {
      toast.error("Bạn cần đăng nhập trước", { id: "auth-error" });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <AiOutlineLoading3Quarters
          className="animate-spin text-blue-500"
          size={40}
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
