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

      // Store the JWT token and other relevant data in localStorage
      localStorage.setItem('tokenAdmin', response.data.jwt);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('quyen', response.data.quyen);
      localStorage.setItem('maKhachHang', response.data.maKhachHang);

      // Redirect to CategoryPage on successful login
      navigate('/category');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.');
    } finally {
      setIsLoading(false);
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
  };
};

export default useAdminLogin;