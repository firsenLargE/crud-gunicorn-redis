import axios from "axios";

// Access API_URL from environment variable
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // <-- now works
  headers: { "Content-Type": "application/json" },
});

// Optional: Add token interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Token ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
