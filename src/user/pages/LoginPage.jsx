import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';

const LoginPage = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    login,
  } = useAuthStore();

  const [isSliding, setIsSliding] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {

      // Chuyển hướng sau khi đăng nhập (tuỳ chọn)
      window.location.href = '/';
    }
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    setIsSliding(true);
    setTimeout(() => {
      // Điều hướng đến trang đăng ký
      window.location.href = '/register';
    }, 500); // Delay để hiệu ứng chạy xong
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden relative">
      <div className="relative w-full max-w-2xl h-[500px] bg-white shadow-md rounded-lg overflow-hidden">
        {/* Hình ảnh nền bên trái */}
        <div
          className={`absolute top-0 left-0 w-1/2 h-full bg-cover bg-center transform transition-transform duration-500 ${
            isSliding ? 'translate-x-full' : ''
          }`}
        >
          <img
            className="w-full h-full object-cover"
            src="src/assets/images/back.jpg"
            alt="Background"
          />
        </div>

        {/* Form đăng nhập */}
        <div
          className={`absolute top-0 right-0 w-1/2 h-full bg-white p-6 z-10 transform transition-transform duration-500 ${
            isSliding ? '-translate-x-full' : ''
          }`}
        >
          <div className="text-center mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Đăng nhập</h2>

            <form onSubmit={handleLogin} className="space-y-6">
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
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="w-full bg-red-400 text-white py-3 rounded hover:bg-red-500 transition duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>

            <p className="mt-6 text-gray-600 text-sm">
              Nếu bạn chưa có tài khoản, vui lòng{' '}
              <Link
                to="#"
                onClick={handleRegisterClick}
                className="text-red-400 hover:underline"
              >
                Đăng ký
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;