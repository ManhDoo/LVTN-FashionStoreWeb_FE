import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const useProductList = (categoryOrMaDanhMuc) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);

  // Hàm lấy danh sách sản phẩm theo danh mục
  const fetchProductsByCategory = async (category) => {
    setLoading(true);
    try {
      const gender = category === 'FOR MAN' ? 'Nam' : 'Nu';
      const endpoint = `/api/products/phai/${gender}`;
      const response = await axiosInstance.get(endpoint);
      setProducts(response.data);
      if (response.data.length > 0) {
      setCategoryInfo(response.data[0].danhMuc); // <-- Lấy tendm
    }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', err);
      setError('Không thể tải danh sách sản phẩm.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy sản phẩm theo mã danh mục
  const fetchProductsByMaDanhMuc = async (maDanhMuc) => {
    try {
      const endpoint = `/api/products/danhmuc/${maDanhMuc}`;
      const response = await axiosInstance.get(endpoint);
      console.log('Dữ liệu từ API danh mục:', response.data);
      setProducts(response.data);
    } catch (err) {
      console.error('Lỗi khi lấy sản phẩm theo danh mục:', err);
      setError('Không thể tải sản phẩm theo danh mục.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (typeof categoryOrMaDanhMuc === 'string' && categoryOrMaDanhMuc.startsWith('FOR')) {
      fetchProductsByCategory(categoryOrMaDanhMuc);
    } else if (typeof categoryOrMaDanhMuc === 'number' || !isNaN(categoryOrMaDanhMuc)) {
      fetchProductsByMaDanhMuc(Number(categoryOrMaDanhMuc));
    } else {
      setProducts([]);
      setError('Tham số không hợp lệ.');
      setLoading(false);
    }
  }, [categoryOrMaDanhMuc]);

  return { products, loading, error, categoryInfo };
};

export default useProductList;