import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axios';

const useProductList = (categoryOrMaDanhMuc) => {
  // Hàm fetch dữ liệu
  const fetchProducts = async ({ queryKey }) => {
    const [key, categoryOrMaDanhMuc] = queryKey;
    if (key === 'category') {
      const gender = categoryOrMaDanhMuc === 'FOR MAN' ? 'Nam' : 'Nu';
      const response = await axiosInstance.get(`/api/products/phai/${gender}`);
      return response.data.filter((product) => !product.deleted);
    } else {
      const response = await axiosInstance.get(`/api/products/danhmuc/${categoryOrMaDanhMuc}`);
      return response.data;
    }
  };

  // Sử dụng useQuery để fetch và cache dữ liệu
  const { data, isLoading, error } = useQuery({
    queryKey: [
      typeof categoryOrMaDanhMuc === 'string' && categoryOrMaDanhMuc.startsWith('FOR')
        ? 'category'
        : 'maDanhMuc',
      categoryOrMaDanhMuc,
    ],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // Cache dữ liệu trong 5 phút
    cacheTime: 30 * 60 * 1000, // Lưu cache trong 30 phút
    keepPreviousData: true, // Giữ dữ liệu cũ khi chuyển trang
  });

  // Xử lý categoryInfo
  const categoryInfo = data && data.length > 0 ? data[0].danhMuc : null;

  return {
    products: data || [],
    loading: isLoading,
    error: error ? 'Không thể tải danh sách sản phẩm.' : null,
    categoryInfo,
  };
};

export default useProductList;
