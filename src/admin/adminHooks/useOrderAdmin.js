import { useEffect, useState } from 'react';
import axiosAdmin from '../utils/axiosAdmin';
import { useLocation } from 'react-router-dom';

const useOrderAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Get status from URL query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status') || '';

  useEffect(() => {
    fetchOrders(page, status);
  }, [page, status]);

  const fetchOrders = async (currentPage, statusFilter) => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        size: pageSize,
      };
      if (statusFilter) {
        params.status = statusFilter;
      }

      const res = await axiosAdmin.get('/api/order/filter', { params });

      // Group by maDonHang
      const grouped = res.data.content.reduce((acc, order) => {
        const key = order.maDonHang;
        if (!acc[key]) {
          acc[key] = {
            maDonHang: order.maDonHang,
            tenNguoiNhan: order.tenNguoiNhan,
            diaChi: order.diaChi,
            soDienThoai: order.soDienThoai,
            ngayTao: order.ngayTao,
            trangThai: order.trangThai,
            mauSac: order.mauSac,
            kichCo: order.kichCo,
            coThanhToan: order.coThanhToan,
            tongGia: order.tongGia,
            items: [],
          };
        }
        acc[key].items.push({
          tenSanPham: order.tenSanPham,
          hinhAnh: order.hinhAnh,
          donGia: order.donGia,
          soLuong: order.soLuong,
          mauSac: order.mauSac,
          kichCo: order.kichCo,
          coThanhToan: order.coThanhToan,
          tongGia: order.tongGia,
        });
        return acc;
      }, {});

      setOrders(Object.values(grouped));
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError('Không thể tải danh sách đơn hàng');
      setLoading(false);
    }
  };

  const goToPage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const updateOrderStatus = async (maDonHang, newStatus) => {
    if (!newStatus) return { success: false };

    try {
      await axiosAdmin.put(`/api/order/${maDonHang}/status`, null, {
        params: { status: newStatus },
      });
      await fetchOrders(page, status); // Reload orders with current status filter
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };


  return { orders, loading, error, page, totalPages, goToPage, updateOrderStatus };
};

export default useOrderAdmin;