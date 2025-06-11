// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://backend-crud-ltwb.onrender.com/api",
  withCredentials: true,
});

export default instance;
