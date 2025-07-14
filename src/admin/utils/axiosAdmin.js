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
axiosAdmin.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('tokenAdmin');

      // Chuyển hướng đến trang đăng nhập admin
      window.location.href = '/admin';

      // Optional: thông báo
      alert('Phiên đăng nhập admin đã hết hạn. Vui lòng đăng nhập lại.');
    }
    return Promise.reject(error);
  }
);


export default axiosAdmin;
