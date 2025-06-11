// utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://backend-crud-ltwb.onrender.com/api",
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
