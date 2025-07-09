import { useState, useEffect } from 'react';
import axiosAdmin from '../utils/axiosAdmin';

const useSizeAdmin = () => {
  const [sizes, setSizes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const res = await axiosAdmin.get('/api/size');
        setSizes(res.data);
      } catch (err) {
        setError('Lỗi khi lấy danh sách kích cỡ');
      }
    };
    fetchSizes();
  }, []);

  return { sizes, error };
};

export default useSizeAdmin;