import { useContext, useEffect } from "react";
import useAuthStore from "../store/authStore";
import MyContext from "../Context/MyContext";
import axiosPrivate from "../API/axiosInstance"
// Biến bên ngoài hook để tránh reset khi hook re-render
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const useAxiosPrivate = () => {
  const { refreshToken } = useAuthStore();
  const { persist } = useContext(MyContext);

  useEffect(() => {
    // 1. Request Interceptor
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token && !config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Response Interceptor
    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;

        if ((error.response?.status === 401) && !prevRequest?._retry && persist) {
          
          if (isRefreshing) {
            // Nếu đang refresh, đẩy request này vào hàng đợi chờ token mới
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                prevRequest.headers["Authorization"] = `Bearer ${token}`;
                return axiosPrivate(prevRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          prevRequest._retry = true;
          isRefreshing = true;

          try {
            const refreshed = await refreshToken(); // Hàm này trong Zustand nên update luôn accessToken vào Store
            const newAccessToken = refreshed.accessToken;

            processQueue(null, newAccessToken);
            isRefreshing = false;

            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          } catch (err) {
            processQueue(err, null);
            isRefreshing = false;
            // useAuthStore.getState().logout(); // Logout nếu refresh token hết hạn
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup: Xóa interceptor cũ khi component unmount hoặc dependency thay đổi
    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshToken, persist]);

  return axiosPrivate;
};

export default useAxiosPrivate;
