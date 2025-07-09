import { useState, useEffect } from 'react';
import axiosAdmin from '../utils/axiosAdmin';

const useColorAdmin = () => {
  const [colors, setColors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await axiosAdmin.get('/api/color');
        setColors(res.data);
      } catch (err) {
        setError('Lỗi khi lấy danh sách màu sắc');
      }
    };
    fetchColors();
  }, []);

  return { colors, error };
};

export default useColorAdmin;