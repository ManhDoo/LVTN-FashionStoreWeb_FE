// hooks/useReturnRequests.js
import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const useReturnRequests = () => {
  const [returnRequests, setReturnRequests] = useState([]);
  const [loadingReturns, setLoadingReturns] = useState(true);
  const [errorReturns, setErrorReturns] = useState(null);

  const fetchReturnRequests = async () => {
    try {
      const response = await axiosInstance.get('/api/returns');
      setReturnRequests(response.data);
    } catch (err) {
      setErrorReturns('Không thể tải yêu cầu hoàn trả.');
    } finally {
      setLoadingReturns(false);
    }
  };

  useEffect(() => {
    fetchReturnRequests();
  }, []);

  return { returnRequests, loadingReturns, errorReturns };
};

export default useReturnRequests;
