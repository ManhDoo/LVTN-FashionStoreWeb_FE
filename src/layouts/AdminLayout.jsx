import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../admin/components/Sidebar';
import Header from '../admin/components/Header';
import useFirebaseMessaging from '../admin/adminHooks/useFirebaseMessaging';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const { token, unsubscribeFromTopic } = useFirebaseMessaging();

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const tokenAdmin = localStorage.getItem('tokenAdmin');
    const quyen = localStorage.getItem('quyen');

    if (!tokenAdmin || quyen !== 'ADMIN') {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/product') setPageTitle('Danh sách sản phẩm');
    else if (path === '/product-edit') setPageTitle('Chi tiết sản phẩm');
    else if (path === '/category') setPageTitle('Danh sách danh mục');
    else if (path === '/promotion-page') setPageTitle('Danh sách khuyến mãi');
    else if (path === '/order') setPageTitle('Đơn hàng');
    else if (path === '/return-request-page') setPageTitle('Đơn hoàn trả');
    else if (path === '/bills') setPageTitle('Hóa đơn');
    else if (path === '/bills-create/:id') setPageTitle('Tạo hóa đơn');
    else if (path === '/income-page') setPageTitle('Thống kê doanh thu');
    else setPageTitle('Dashboard');
  }, [location.pathname]);

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    if (token) {
      await unsubscribeFromTopic(token); // Hủy đăng ký topic
    }
    localStorage.removeItem('tokenAdmin');
    localStorage.removeItem('quyen');
    navigate('/admin');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="fixed w-full bg-white shadow pl-63">
        <Header pageTitle={pageTitle} onLogout={handleLogout} />
      </header>
      <div className="flex flex-1">
        <div className="w-64 bg-white border-r shadow">
          <Sidebar setPageTitle={setPageTitle} />
        </div>
        <div className="flex-1 p-6 overflow-auto mt-10">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;