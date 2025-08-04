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
        // Lọc sản phẩm không bị xóa và không bị ẩn
        const filteredProducts = res.data.filter(
          (product) => !product.deleted
        );
        setProducts(filteredProducts);
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
