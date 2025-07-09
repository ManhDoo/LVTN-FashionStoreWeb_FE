import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ pageTitle }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Giả lập dữ liệu người dùng
  const userName = 'Admin User';
  const userRole = 'Admin';
  

  const navigate = useNavigate();

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xóa token và thông tin liên quan khỏi localStorage
    localStorage.removeItem('tokenAdmin');
    localStorage.removeItem('email');
    localStorage.removeItem('quyen');
    localStorage.removeItem('maKhachHang');

    // Chuyển hướng về trang đăng nhập
    navigate('/admin');
  };

  const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};


  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex justify-between items-center h-16">
          {/* Header Left */}
          <div className="flex items-center">
            <h3 className="text-xl font-semibold text-gray-800">{pageTitle}</h3>
          </div>

          {/* Header Right */}
          <ul className="flex items-center space-x-4">
            {/* Home Icon */}
            <li>
              <Link to="/login" className="text-gray-600 hover:text-gray-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
              </Link>
            </li>

            {/* Theme Toggle Icon */}
            <li>
              <button className="text-gray-600 hover:text-gray-800">
                <svg className="w-5 h-5 block" id="icon-light" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <svg className="w-5 h-5 hidden" id="icon-dark" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
            </li>

            {/* Fullscreen Icon */}
            <li>
              <button className="text-gray-600 hover:text-gray-800" onClick={toggleFullScreen}>
                <svg className="w-5 h-5 block" id="icon-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
                <svg className="w-5 h-5 hidden" id="icon-minimize" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              </button>
            </li>

            {/* User Profile Dropdown */}
            <li className="relative">
              <button
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="text-left">
                  <span className="block font-medium">{userName}</span>
                  <small className="block text-sm text-gray-500">{userRole}</small>
                </div>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2 z-10">
                  <Link
                    to="/admin/users/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Thông tin</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Thoát</span>
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;