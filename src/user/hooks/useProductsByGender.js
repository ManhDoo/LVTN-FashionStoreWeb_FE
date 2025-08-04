import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const useProductsByGender = (genderLabel) => {
  const [products, setProducts] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const gender = genderLabel === 'FOR MAN' ? 'Nam' : 'Nu';
    axiosInstance.get(`/api/products/phai/${gender}`)
    
      .then(res => {
        // Lọc sản phẩm không bị xóa và không bị ẩn
        const filteredProducts = res.data.filter(
          (product) => !product.deleted
        );
        setProducts(filteredProducts);
        if (res.data.length > 0) {
          setCategoryInfo(res.data[0].danhMuc);
        }
      })
      .catch(() => {
        setError("Không thể tải sản phẩm theo giới tính.");
      })
      .finally(() => setLoading(false));
  }, [genderLabel]);

  return { products, loading, error, categoryInfo };
};

export default useProductsByGender;
