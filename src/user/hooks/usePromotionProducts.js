// src/hooks/usePromotionProducts.js
import { useEffect, useState } from 'react';
import axios from '../utils/axios'; // dùng instance đã config

const usePromotionProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/promotion/product');
        setProducts(res.data);
      } catch (err) {
        setError('Lỗi khi tải sản phẩm khuyến mãi');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export default usePromotionProducts;
