import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';

const GoogleCallback = () => {
  const { fetchProfile, setIsAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      fetchProfile().then(() => {
        navigate('/');
      });
    } else {
      navigate('/login');
    }
  }, [location, fetchProfile, setIsAuthenticated, navigate]);

  return <div>Loading...</div>;
};

export default GoogleCallback;