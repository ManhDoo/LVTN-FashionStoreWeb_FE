// hooks/useCategoryStore.js
import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const useCategoryStore = (gender) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = async (phai) => {
    setLoading(true);
    try {
      const endpoint = phai
        ? `/api/categories/phai/${phai}`
        : `/api/categories`;
      const response = await axiosInstance.get(endpoint);
      setCategories(response.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh mục:', err);
      setError('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(gender);
  }, [gender]);

  return { categories, loading, error };
};

export default useCategoryStore;
