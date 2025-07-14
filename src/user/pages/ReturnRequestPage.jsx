// src/pages/ReturnPage.jsx
import React, { useEffect, useState } from 'react';
import { getOrderDetailById } from '../hooks/useReturnStore'
import { useParams } from 'react-router-dom';

const ReturnPage = () => {
  const { orderId } = useParams(); // Lấy từ URL
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    if (orderId) {
      getOrderDetailById(orderId)
        .then((res) => {
          setOrderDetail(res.data);
        })
        .catch((err) => {
          console.error(err.response?.data || "Không thể lấy thông tin đơn hàng");
        });
    }
  }, [orderId]);

  if (!orderDetail) return <div>Đang tải thông tin đơn hàng...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Yêu cầu hoàn trả</h2>

      {/* THÔNG TIN ĐƠN HÀNG */}
      <div className="mb-6 border p-4 rounded bg-gray-50">
        <h3 className="text-xl font-semibold mb-2">Thông tin đơn hàng</h3>
        <img
                            src={orderDetail.hinhAnh}
                            alt={orderDetail.tenSanPham}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
        <p><strong>Sản phẩm:</strong> {orderDetail.tenSanPham}</p>
        <p><strong>Màu sắc:</strong> {orderDetail.mauSac}</p>
        <p><strong>Kích cỡ:</strong> {orderDetail.kichCo}</p>
        <p><strong>Đơn giá:</strong> {orderDetail.donGia.toLocaleString()}đ</p>
        <p><strong>Số lượng:</strong> {orderDetail.soLuong}</p>
        <p><strong>Tổng tiền:</strong> {(orderDetail.donGia * orderDetail.soLuong).toLocaleString()}đ</p>
      </div>

      {/* FORM GỬI YÊU CẦU */}
      <form>
        <div className="mb-4">
          <label className="font-semibold">Lý do:</label>
          <select className="w-full border rounded px-3 py-2">
            <option value="">Chọn lý do</option>
            <option value="sai-mau">Sai mẫu</option>
            <option value="doi-size">Đổi size</option>
            <option value="loi-san-pham">Lỗi sản phẩm</option>
            <option value="khong-muon-nua">Không muốn nhận hàng</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="font-semibold">Mô tả chi tiết:</label>
          <textarea className="w-full border rounded px-3 py-2" rows="4" />
        </div>

        <div className="mb-4">
          <label className="font-semibold">Hình ảnh minh họa (nếu có):</label>
          <input type="file" multiple className="block" />
        </div>

        <div className="mb-4">
          <label className="font-semibold">Email nhận phản hồi:</label>
          <input type="email" className="w-full border rounded px-3 py-2" defaultValue={orderDetail.email || ''} />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Gửi yêu cầu hoàn trả
        </button>
      </form>
    </div>
  );
};

export default ReturnPage;
