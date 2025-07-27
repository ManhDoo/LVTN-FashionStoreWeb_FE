import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../user/utils/axios'; // Adjust the import path based on your project structure

const useAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login-admin', {
        email: email,
        matKhau: password,
      });
      await fetchProfile();

      // Store the JWT token and other relevant data in localStorage
      localStorage.setItem('tokenAdmin', response.data.jwt);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('quyen', response.data.quyen);
      localStorage.setItem('maKhachHang', response.data.maKhachHang);

      // Redirect to CategoryPage on successful login
      navigate('/income-page');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    const token = localStorage.getItem('tokenAdmin');
    if (!token) {
      setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      const response = await axios.get('/api/auth/profile');
      if (response.status === 200) {
        // API trả về mảng, lấy phần tử đầu tiên
        const userData = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
        if (userData) {
          setUser(userData);
          localStorage.setItem('admin', JSON.stringify(userData));
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
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    error,
    handleSubmit,
    fetchProfile,
  };
};

export default useAdminLogin;