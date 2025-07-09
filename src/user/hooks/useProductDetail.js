import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const useProductDetail = (maSanPham) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductDetails = async (maSanPham) => {
    try {
      const endpoint = `/api/products/${maSanPham}/details`;
      const response = await axiosInstance.get(endpoint);
      setProducts(response.data);
    } catch (err) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
      setError('Không thể tải chi tiết sản phẩm.'); 
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (typeof maSanPham === 'number' || !isNaN(maSanPham)) {
      fetchProductDetails(Number(maSanPham));
    } else {
      setProducts([]);
      setError('Mã sản phẩm không hợp lệ.');
      setLoading(false);
    }
  }, [maSanPham]);

  return { products, loading, error };
};

export default useProductDetail;