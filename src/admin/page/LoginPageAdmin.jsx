import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAdminLogin from '../adminHooks/useLoginAdmin';

const LoginPageAdmin = () => {
  const { email, setEmail, password, setPassword, isLoading, error, handleSubmit } = useAdminLogin();
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    const quyen = localStorage.getItem('quyen');
    if (token && quyen === 'ADMIN' && location.pathname === '/admin') {
      navigate('/category'); // Chuyển hướng đến CategoryPage nếu đã đăng nhập
    }
  }, [navigate, location.pathname]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden relative">
      <div className="relative w-full max-w-2xl h-[500px] bg-white shadow-md rounded-lg overflow-hidden">
        {/* Hình ảnh nền bên trái */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full bg-cover bg-center transform transition-transform duration-500"
        >
          <img
            className="w-full h-full object-cover"
            src="src/assets/images/back.jpg"
            alt="Background"
          />
        </div>

        {/* Form đăng nhập */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full bg-white p-6 z-10 transform transition-transform duration-500"
        >
          <div className="text-center mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Admin</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPageAdmin;