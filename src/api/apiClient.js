import axios from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/api",
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      // 🔥 SINGLE SOURCE OF TRUTH
      localStorage.removeItem("token");
      toast.error("Session expired ⏳ Please login again");

      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
