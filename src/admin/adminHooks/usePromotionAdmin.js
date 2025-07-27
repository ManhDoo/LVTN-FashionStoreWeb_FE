import { useState, useEffect } from 'react';
import axiosAdmin from '../utils/axiosAdmin';

const usePromotionAdmin = () => {
  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchColors = async () => {
      try {
        const res = await axiosAdmin.get('/api/promotion');
        setPromotions(res.data);
      } catch (err) {
        setError('Lỗi khi lấy danh sách khuyến mãi');
      }finally{
        setLoading(false);
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

  const deletePromotion = async (id) => {
    try {
      await axiosAdmin.delete(`/api/promotion/${id}`);
    } catch (err) {
      const message =
        err.response?.data || 'Xóa khuyến mãi thất bại. Vui lòng thử lại.';
      throw new Error(message);
    }
  };

  const deletePromotionProduct = async (productId) => {
  if (!window.confirm("Bạn có chắc muốn xóa sản phẩm khỏi khuyến mãi không?")) return;
  try {
    await axiosAdmin.put(`/api/promotion/go-khuyen-mai/${productId}`);
    alert("Đã xóa sản phẩm khỏi khuyến mãi");
    window.location.reload(); // hoặc gọi hàm refetch() nếu bạn có
  } catch (err) {
    alert("Xóa thất bại: " + err.response?.data?.message || err.message);
  }
};

  return { promotions,loading, error, createPromotion, deletePromotion, deletePromotionProduct };
};

export default usePromotionAdmin;