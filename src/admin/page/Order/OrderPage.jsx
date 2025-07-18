import React, { useState } from 'react';
import useOrderAdmin from '../../adminHooks/useOrderAdmin';
import { useLocation } from 'react-router-dom';

// Mapping for status colors and Vietnamese labels
const statusConfig = {
  CHO_XAC_NHAN: { label: 'Chờ xác nhận', bgColor: 'bg-orange-100', textColor: 'text-orange-700' },
  DA_XAC_NHAN: { label: 'Đã xác nhận', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  DANG_GIAO: { label: 'Đang giao', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' },
  DA_GIAO: { label: 'Đã giao', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  DA_HUY: { label: 'Đã hủy', bgColor: 'bg-red-100', textColor: 'text-red-700' },
  DA_THANH_TOAN: { label: 'Đã thanh toán', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
};

const OrderPage = () => {
  const { orders, loading, error, page, totalPages, goToPage, updateOrderStatus } = useOrderAdmin();
  const [expandedRow, setExpandedRow] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [statusUpdates, setStatusUpdates] = useState({});
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status') || '';

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleDateChange = (e) => {
    setFilterDate(e.target.value);
  };

  const handleStatusUpdate = async (maDonHang) => {
    const newStatus = statusUpdates[maDonHang];
    if (!newStatus) {
      alert('Vui lòng chọn trạng thái mới');
      return;
    }
    const result = await updateOrderStatus(maDonHang, newStatus);
    if (result.success) {
      alert('Cập nhật trạng thái thành công');
    } else {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };
  const handleStatusSelectChange = (maDonHang, newStatus) => {
  setStatusUpdates((prev) => ({ ...prev, [maDonHang]: newStatus }));
};

  

const formatDateVN = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const filteredOrders = orders
  .filter((order) => {
    if (!filterDate) return true;
    const formattedOrderDate = formatDateVN(order.ngayTao);
    const formattedFilterDate = formatDateVN(filterDate);
    return formattedOrderDate === formattedFilterDate;
  })
  .sort((a, b) => new Date(b.ngayTao) - new Date(a.ngayTao));



  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h4 className="text-lg font-medium">
            Danh sách đơn hàng {status ? `(${statusConfig[status]?.label || status})` : ''}
          </h4>
          <input
            type="date"
            value={filterDate}
            onChange={handleDateChange}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-bold">STT</th>
                  <th className="p-3 font-bold">Tên người nhận</th>
                  <th className="p-3 font-bold">Địa chỉ</th>
                  <th className="p-3 font-bold">SĐT</th>
                  <th className="p-3 font-bold">Ngày tạo</th>
                  <th className="p-3 font-bold">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4">Đang tải...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="text-center p-4">Lỗi: {error}</td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <React.Fragment key={order.maDonHang}>
                      <tr
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleRow(index)}
                      >
                        <td className="p-3">{index + 1 + page * 10}</td>
                        <td className="p-3">{order.tenNguoiNhan}</td>
                        <td className="p-3">{order.diaChi}</td>
                        <td className="p-3">{order.soDienThoai}</td>
                        <td className="p-3">{new Date(order.ngayTao).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-1 rounded ${
                              statusConfig[order.trangThai]?.bgColor || 'bg-gray-100'
                            } ${
                              statusConfig[order.trangThai]?.textColor || 'text-gray-700'
                            }`}
                          >
                            {statusConfig[order.trangThai]?.label || order.trangThai}
                          </span>
                        </td>
                      </tr>
                      {expandedRow === index && (
                        <tr>
                          <td colSpan="6" className="bg-gray-50 p-4">
                            <p className="font-medium mb-2">Chi tiết đơn hàng:</p>
                            <ul className="space-y-2">
                              {order.items.map((item, i) => (
                                <li key={i} className="border-b pb-2">
                                  <div className="flex items-center space-x-4">
                                    <img
                                      src={item.hinhAnh}
                                      alt={item.tenSanPham}
                                      className="w-16 h-16 object-cover"
                                    />
                                    <div>
                                      <p><strong>{item.tenSanPham}</strong></p>
                                      <p>Màu sắc: {item.mauSac}</p>
                                      <p>Kích cỡ: {item.kichCo}</p>
                                      <p>Số lượng: {item.soLuong}</p>
                                      <p>Đơn giá: {item.donGia.toLocaleString()} VND</p>
                                      <p className="font-semibold">
                                        Tổng: {(item.donGia * item.soLuong).toLocaleString()} VND
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <div className="mt-4">
                              <label className="block mb-1 font-medium">Cập nhật trạng thái:</label>
                              <select
                                value={statusUpdates[order.maDonHang] || order.trangThai}
                                onChange={(e) => handleStatusSelectChange(order.maDonHang, e.target.value)}
                                className="border rounded px-2 py-1 text-sm mr-2"
                              >
                                {Object.entries(statusConfig).map(([value, { label }]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleStatusUpdate(order.maDonHang)}
                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                              >
                                Cập nhật
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4">Không có đơn hàng nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex justify-center space-x-1">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className="px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              «
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`px-3 py-1 rounded ${
                  page === i ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              »
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-md text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;