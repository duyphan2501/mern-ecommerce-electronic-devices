import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const handleRefreshToken = async (setIsLogin, notify) => {
  try {
    const res = await axios.put(
      `${BACKEND_URL}/api/user/refresh-token`,
      {},
      { withCredentials: true }
    );

    if (res?.data?.success) {
      setIsLogin(true);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    return false;
  }
};

const checkAuth = async (setIsLogin, notify) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/user/check-auth`, {
      withCredentials: true,
    });

    if (res?.data?.success) {
      setIsLogin(true);
    } else {
      notify("error", "Not authenticated");
    }
  } catch (error) {
    if (error.response?.status === 401) {
      const refreshed = await handleRefreshToken(setIsLogin, notify);
      if (!refreshed) {
        notify("error", "Session expired, please log in again");
      }
    } else {
      const message =
        error.response?.data?.message || error.message || "Login check failed.";
      notify("error", message);
      console.error("Check auth error:", error);
    }
  }
};

const login = async (email, password, setIsLogin, notify) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/user/login`,
      { email, password },
      { withCredentials: true }
    );

    if (res?.data?.success) {
      const user = res.data.user;
      if (user?.role === "admin") {
        setIsLogin(true);
      } else {
        notify("error", "This account is unauthorized");
      }
    }
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Login failure.";
    notify("error", message);
    console.error("Login error:", error);
  }
};

export { checkAuth, login };
