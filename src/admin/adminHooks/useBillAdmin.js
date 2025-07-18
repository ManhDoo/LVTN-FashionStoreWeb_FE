import axiosAdmin from '../utils/axiosAdmin';

export const fetchAllBills = async (page = 0, size = 10) => {
  const response = await axiosAdmin.get(`/api/bill?page=${page}&size=${size}`);
  return response.data;
};

export const fetchBillById = async (id) => {
  const response = await axiosAdmin.get(`/api/bill/${id}`);
  return response.data;
};
