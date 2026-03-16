import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../store/authStore";

const GoogleButton = () => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const navigator = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const { googleLogin } = useAuthStore();

  if (!clientId) {
    console.log("clientId is not existed");
  }

  const handleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;
    try {
      await googleLogin(token);
      toast.success("Đăng nhập thành công!");
      navigator(from, { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId} oneTap={false}>
      <GoogleLogin
        size="large"
        width="100%"
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
        theme="outline"
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleButton;
