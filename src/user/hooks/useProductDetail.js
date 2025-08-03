import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import axiosInstance from '../utils/axios';

const useProductDetail = (maSanPham) => {
  // Hàm fetch chi tiết sản phẩm
  const fetchProductDetails = async ({ queryKey }) => {
    const [, maSanPham] = queryKey;
    const endpoint = `/api/products/${maSanPham}/details`;
    const response = await axiosInstance.get(endpoint);
    return response.data;
  };

  // Hàm fetch đánh giá
  const fetchReviews = async ({ queryKey }) => {
    const [, maSanPham] = queryKey;
    const response = await axiosInstance.get(`/api/comment/${maSanPham}`);
    return response.data;
  };

  // Query cho chi tiết sản phẩm
  const { data: products, isLoading: loadingProducts, error: errorProducts, refetch: refetchProducts } = useQuery({
    queryKey: ['productDetail', maSanPham],
    queryFn: fetchProductDetails,
    staleTime: 60 * 1000, // Cache 1 phút
    cacheTime: 30 * 60 * 1000, // Giữ cache 30 phút
    keepPreviousData: true,
    enabled: !!maSanPham && !isNaN(maSanPham), // Chỉ chạy khi maSanPham hợp lệ
  });

  // Query cho đánh giá
  const { data: reviews, isLoading: loadingReviews, error: errorReviews, refetch: refetchReviews } = useQuery({
    queryKey: ['productReviews', maSanPham],
    queryFn: fetchReviews,
    staleTime: 60 * 1000, // Cache 1 phút
    cacheTime: 30 * 60 * 1000, // Giữ cache 30 phút
    keepPreviousData: true,
    enabled: !!maSanPham && !isNaN(maSanPham),
  });

  // Tự động refetch mỗi 5 phút để kiểm tra dữ liệu mới
  useEffect(() => {
    const interval = setInterval(() => {
      refetchProducts();
      refetchReviews();
    }, 5 * 60 * 1000); // 5 phút

    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, [refetchProducts, refetchReviews]);

  return {
    products: products || [],
    reviews: reviews || null,
    loading: loadingProducts || loadingReviews,
    error: errorProducts || errorReviews ? 'Không thể tải chi tiết sản phẩm hoặc đánh giá.' : null,
    refetch: () => {
      refetchProducts();
      refetchReviews();
    },
  };
};

export default useProductDetail;
