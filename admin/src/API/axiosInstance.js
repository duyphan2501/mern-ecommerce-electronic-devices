// axiosPrivate.js
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const axiosPrivate = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default axiosPrivate;
