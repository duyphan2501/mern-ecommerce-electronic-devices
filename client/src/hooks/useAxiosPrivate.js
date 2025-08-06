import { useEffect } from "react";
import useAuthStore from "../store/authStore";
import axiosPrivate from "../API/axiosInstance.js";

const useAxiosPrivate = () => {
  const { refreshToken } = useAuthStore();

  useEffect(() => {
    const requestInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().accessToken;
        if (!config.headers.Authorization && token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          (error.response?.status === 401 && !prevRequest._retry) ||
          (error.response?.status === 403 && !prevRequest._retry)
        ) {
          prevRequest._retry = true;
          try {
            const refreshed = await refreshToken();
            prevRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
            return axiosPrivate(prevRequest);
          } catch (err) {
            await useAuthStore.getState().logout();
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestInterceptor);
      axiosPrivate.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return axiosPrivate;
};

export default useAxiosPrivate;
