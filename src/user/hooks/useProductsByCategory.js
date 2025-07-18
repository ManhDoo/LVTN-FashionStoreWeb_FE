import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const useProductsByCategory = (maDanhMuc) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/api/products/danhmuc/${maDanhMuc}`)
      .then(res => setProducts(res.data))
      .catch(() => setError("Không thể tải sản phẩm theo danh mục."))
      .finally(() => setLoading(false));
  }, [maDanhMuc]);

  return { products, loading, error };
};

export default useProductsByCategory;
