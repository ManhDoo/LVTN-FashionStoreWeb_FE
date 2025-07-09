// src/api/axiosAdmin.js
import axios from 'axios';

const axiosAdmin = axios.create({
  baseURL: 'http://localhost:8080', // Có thể thay đổi nếu cần
});

axiosAdmin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tokenAdmin');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosAdmin;
