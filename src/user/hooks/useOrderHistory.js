import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const useOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderHistory = async () => {
    try {
      const endpoint = `/api/order`;
      const response = await axiosInstance.get(endpoint);
      if (Array.isArray(response.data)) {
        // Nhóm các dòng chi tiết theo maDonHang
        const groupedOrders = response.data.reduce((acc, item) => {
          const existingOrder = acc.find(order => order.maDonHang === item.maDonHang);
          if (existingOrder) {
            existingOrder.items.push({
              maSanPham: item.maSanPham,
              tenSanPham: item.tenSanPham,
              hinhAnh: item.hinhAnh,
              donGia: item.donGia,
              soLuong: item.soLuong,
              ngayTao: item.ngayTao,
              trangThai: item.trangThai
            });
            existingOrder.tongGia = (existingOrder.tongGia || 0) + (item.donGia * item.soLuong);
            existingOrder.tongSoLuong = (existingOrder.tongSoLuong || 0) + item.soLuong;
          } else {
            acc.push({
              maDonHang: item.maDonHang,
              tenNguoiNhan: item.tenNguoiNhan,
              diaChi: item.diaChi,
              soDienThoai: item.soDienThoai,
              tongGia: item.donGia * item.soLuong,
              tongSoLuong: item.soLuong,
              ngayTao: item.ngayTao,
              trangThai: item.trangThai, // Giả định trạng thái mặc định, cần lấy từ API nếu có
              items: [{
                maSanPham: item.maSanPham,
                tenSanPham: item.tenSanPham,
                hinhAnh: item.hinhAnh,
                donGia: item.donGia,
                soLuong: item.soLuong
              }]
            });
          }
          return acc;
        }, []);
        setOrders(groupedOrders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('API Error:', err.response?.data || err.message);
      setError('Không thể tải lịch sử mua hàng.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchOrderHistory();
  }, []);

  const cancelOrder = async (maDonHang) => {
    try {
      await axiosInstance.put(`/api/order/cancel/${maDonHang}`);
      await fetchOrderHistory();
      return { success: true };
    } catch (err) {
      console.error('Cancel Order Error:', err);
      return {
        success: false,
        message: err.response?.data?.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.',
      };
    }
  };

  return { orders, loading, error, fetchOrderHistory, cancelOrder };
};

export default useOrderHistory;