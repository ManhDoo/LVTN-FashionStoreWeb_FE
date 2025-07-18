import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

const useOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchOrderHistory = async (page = 0, size = 10) => {
  try {
    const endpoint = `/api/order?page=${page}&size=${size}`;
    const response = await axiosInstance.get(endpoint);

    const pageData = response.data;
    const content = Array.isArray(pageData.content) ? pageData.content : [];

    const groupedOrders = content.reduce((acc, item) => {
      const existingOrder = acc.find(order => order.maDonHang === item.maDonHang);
      if (existingOrder) {
        existingOrder.items.push({
          maSanPham: item.maSanPham,
          tenSanPham: item.tenSanPham,
          hinhAnh: item.hinhAnh,
          donGia: item.donGia,
          soLuong: item.soLuong,
          ngayTao: item.ngayTao,
          ngayGiao: item.ngayGiao,
          trangThai: item.trangThai,
          mauSac: item.mauSac,
          kichCo: item.kichCo,
          coYeuCauDoiTra: item.coYeuCauDoiTra,
          coThanhToan: item.coThanhToan
        });
        existingOrder.tongGia += item.donGia * item.soLuong;
        existingOrder.tongSoLuong += item.soLuong;
      } else {
        acc.push({
          maDonHang: item.maDonHang,
          tenNguoiNhan: item.tenNguoiNhan,
          diaChi: item.diaChi,
          soDienThoai: item.soDienThoai,
          tongGia: item.donGia * item.soLuong,
          tongSoLuong: item.soLuong,
          ngayTao: item.ngayTao,
          ngayGiao: item.ngayGiao,
          trangThai: item.trangThai,
          coThanhToan: item.coThanhToan,
          coYeuCauDoiTra: item.coYeuCauDoiTra,
          items: [{
            chiTietDonHangId: item.id,
            maSanPham: item.maSanPham,
            tenSanPham: item.tenSanPham,
            hinhAnh: item.hinhAnh,
            donGia: item.donGia,
            soLuong: item.soLuong,
            mauSac: item.mauSac,
            kichCo: item.kichCo
          }]
        });
      }
      
      return acc;
    }, []);

    setOrders(groupedOrders);
    setTotalPages(pageData.totalPages || 1); // Thêm dòng này để lưu totalPages
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
    fetchOrderHistory(currentPage);
  }, [currentPage]);

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

  return { orders, loading, error, fetchOrderHistory, cancelOrder, totalPages, currentPage, setCurrentPage, };
};

export default useOrderHistory;