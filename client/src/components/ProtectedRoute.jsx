import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

const ProtectedRoute = () => {
  const { user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      toast.error("Bạn cần đăng nhập trước", { id: "auth-error" });
    }
  }, []);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
