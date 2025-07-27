// src/pages/OAuth2Success.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';

const OAuth2Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/'; // Hoặc navigate('/')
    } else {
      alert('Đăng nhập Google thất bại!');
      navigate('/login');
    }
  }, []);

  return <div>Đang đăng nhập bằng Google...</div>;
};

export default OAuth2Success;
