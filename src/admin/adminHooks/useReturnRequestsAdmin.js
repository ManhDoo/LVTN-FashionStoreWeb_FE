import { useState, useEffect } from 'react';
import axiosAdmin from '../utils/axiosAdmin';

const useReturnRequestsAdmin = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReturnRequests = async () => {
    try {
      const response = await axiosAdmin.get('/api/returns/all');
      setReturnRequests(response.data);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải danh sách yêu cầu hoàn trả.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  return { returnRequests, loading, error };
};

export default useReturnRequestsAdmin;