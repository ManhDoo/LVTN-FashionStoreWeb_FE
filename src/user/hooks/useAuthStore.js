import { useState } from 'react';
import axiosInstance from '../utils/axios';

const useAuthStore = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await axiosInstance.get('/api/auth/profile');
      if (response.status === 200) {
        // API trả về mảng, lấy phần tử đầu tiên
        const userData = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
        if (userData) {
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          setError('Dữ liệu người dùng không hợp lệ.');
        }
      } else {
        setError(response.data.message || 'Không thể lấy thông tin người dùng');
      }
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data); // Log chi tiết lỗi
      if (error.response?.status === 400) {
        setError(error.response?.data?.message || 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại.');
      } else {
        setError(error.response?.data?.message || 'Lỗi khi lấy thông tin người dùng');
      }
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        matKhau: password,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        const token = response.data.jwt || 'dummy-token';
        localStorage.setItem('token', token);
        await fetchProfile();
        return true;
      } else {
        setError(response.data.message || 'Đăng nhập thất bại');
        return false;
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Lỗi kết nối server');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (hoTen, email, matKhau) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post('/api/auth/register', {
        hoTen,
        email,
        matKhau,
      });

      if (response.status === 200) {
        setIsAuthenticated(true);
        const token = response.data.jwt || 'dummy-token';
        localStorage.setItem('token', token);
        await fetchProfile();
        return { success: true, message: '' };
      } else {
        setError(response.data.message || 'Đăng ký thất bại');
        return { success: false, message: response.data.message || 'Đăng ký thất bại' };
      }
    } catch (error) {
      return { success: false};
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    window.location.href = '/';
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    isAuthenticated,
    user,
    login,
    register,
    logout,
    fetchProfile,
  };
};

export default useAuthStore;