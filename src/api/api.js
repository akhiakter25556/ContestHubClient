import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response.status === 401) {
      // logout user or redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
