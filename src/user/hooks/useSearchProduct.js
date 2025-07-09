import axiosInstance from '../utils/axios';

export const searchProducts = async (keyword) => {
  const res = await axiosInstance.get(`/api/products/search?keyword=${encodeURIComponent(keyword)}`);
  return res.data;
};
