// src/api/returnApi.js
import axiosInstance from '../utils/axios';

export const getOrderDetailById = (orderId) => {
  return axiosInstance.get(`/api/order/${orderId}`);
};
