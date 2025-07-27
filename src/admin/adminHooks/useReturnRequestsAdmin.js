import { useState, useEffect } from 'react';
import axiosAdmin from '../utils/axiosAdmin';

const useReturnRequestsAdmin = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Matches API pageSize from customer API response

  const fetchReturnRequests = async (page = 0) => {
    setLoading(true);
    try {
      const response = await axiosAdmin.get(`/api/returns/all?page=${page}&size=${pageSize}`);
      setReturnRequests(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(response.data.pageable.pageNumber || 0);
    } catch (err) {
      console.error('Error fetching return requests:', err.response?.data || err.message);
      setError(`Không thể tải danh sách yêu cầu hoàn trả: ${err.response?.data?.message || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnRequests(currentPage);
  }, [currentPage]);

  return {
    returnRequests,
    loading,
    error,
    fetchReturnRequests,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};

export default useReturnRequestsAdmin;