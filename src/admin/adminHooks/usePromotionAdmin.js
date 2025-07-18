import { useState, useEffect } from 'react';
import axiosAdmin from '../utils/axiosAdmin';

const usePromotionAdmin = () => {
  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const res = await axiosAdmin.get('/api/promotion');
        setPromotions(res.data);
      } catch (err) {
        setError('Lỗi khi lấy danh sách khuyến mãi');
      }
    };
    fetchColors();
  }, []);

  const createPromotion = async (data) => {
  try {
    await axiosAdmin.post('/api/promotion', data);
  } catch (error) {
    throw new Error('Tạo khuyến mãi thất bại');
  }
};


  return { promotions, error, createPromotion };
};

export default usePromotionAdmin;