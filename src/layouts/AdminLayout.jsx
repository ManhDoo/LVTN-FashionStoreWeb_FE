import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../admin/components/Sidebar";
import Header from "../admin/components/Header"; // Điều chỉnh đường dẫn theo cấu trúc dự án của bạn

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState('Dashboard');

  // Kiểm tra trạng thái đăng nhập khi component được mount
  useEffect(() => {
    const token = localStorage.getItem('tokenAdmin');
    const quyen = localStorage.getItem('quyen');

    // Nếu không có token hoặc không phải admin, chuyển hướng về trang đăng nhập
    if (!token || quyen !== 'ADMIN') {
      navigate('/admin');
    }
  }, [navigate]); 

  useEffect(() => {
    const path = location.pathname;

    // Bạn có thể ánh xạ đường dẫn sang tiêu đề
    if (path === '/product') setPageTitle('Danh sách sản phẩm');
    else if (path === '/category') setPageTitle('Danh sách danh mục');
    else if (path === '/order') setPageTitle('Đơn hàng');
    else setPageTitle('Dashboard'); // fallback
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="fixed w-full bg-white shadow pl-63">
        <Header pageTitle={pageTitle} />
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r shadow">
          <Sidebar setPageTitle={setPageTitle} />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto mt-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;