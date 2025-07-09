import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';

const RegisterPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
    isLoading,
    register,
  } = useAuthStore();

  const [hoTen, setHoTen] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSliding, setIsSliding] = useState(true);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      const response = await register(hoTen, email, password);
      if (response.success) {
        alert("Đăng ký thành công");
        window.location.href = '/login';
      } else {
        setError(response.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    setIsSliding(false);
    setTimeout(() => {
      window.location.href = '/login';
    }, 500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden relative">
      <div className="relative w-full max-w-2xl h-[500px] bg-white shadow-md rounded-lg overflow-hidden">
        {/* Background image on the right */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full bg-cover bg-center transform transition-transform duration-500 ${
            isSliding ? '' : '-translate-x-full'
          }`}
        >
          <img
            className="w-full h-full object-cover"
            src="src/assets/images/back.jpg"
            alt="Background"
          />
        </div>

        {/* Registration form on the left */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-white p-6 z-10 transform transition-transform duration-500 ${
            isSliding ? '' : 'translate-x-full'
          }`}
        >
          <div className="text-center mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Đăng ký</h2>

            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <input
                  type="text"
                  placeholder="Họ và tên"
                  className="w-full p-3 border-b border-gray-300 bg-transparent focus:outline-none focus:border-red-500 text-gray-700 placeholder-gray-400"
                  value={hoTen}
                  onChange={(e) => setHoTen(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border-b border-gray-300 bg-transparent focus:outline-none focus:border-red-500 text-gray-700 placeholder-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className="w-full p-3 border-b border-gray-300 bg-transparent focus:outline-none focus:border-red-500 text-gray-700 placeholder-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  className="w-full p-3 border-b border-gray-300 bg-transparent focus:outline-none focus:border-red-500 text-gray-700 placeholder-gray-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-red-400 text-white py-3 rounded hover:bg-red-500 transition duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
              </button>
            </form>

            <p className="mt-6 text-gray-600 text-sm">
              Nếu bạn đã có tài khoản, vui lòng{' '}
              <Link
                to="#"
                onClick={handleLoginClick}
                className="text-red-400 hover:underline"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;