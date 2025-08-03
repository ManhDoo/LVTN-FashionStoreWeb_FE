import React, { useState } from 'react';
import useOrderAdmin from '../../adminHooks/useOrderAdmin';
import { useLocation } from 'react-router-dom';

// Mapping for status colors and Vietnamese labels
const statusConfig = {
  CHO_XAC_NHAN: { 
    label: 'Chờ xác nhận', 
    bgColor: 'bg-gradient-to-r from-orange-50 to-orange-100', 
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-500'
  },
  DA_XAC_NHAN: { 
    label: 'Đã xác nhận', 
    bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100', 
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500'
  },
  DANG_GIAO: { 
    label: 'Đang giao', 
    bgColor: 'bg-gradient-to-r from-yellow-50 to-yellow-100', 
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-500'
  },
  DA_GIAO: { 
    label: 'Đã giao', 
    bgColor: 'bg-gradient-to-r from-green-50 to-green-100', 
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500'
  },  
  DA_HUY: { 
    label: 'Đã hủy', 
    bgColor: 'bg-gradient-to-r from-red-50 to-red-100', 
    textColor: 'text-red-800',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500'
  },
  DA_THANH_TOAN: { 
    label: 'Đã thanh toán', 
    bgColor: 'bg-gradient-to-r from-purple-50 to-purple-100', 
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-500'
  },
};

// Allowed status transitions
const allowedStatuses = {
  DA_XAC_NHAN: ['DANG_GIAO'],
  DANG_GIAO: ['DA_GIAO'],
  DA_GIAO: [],
  DA_HUY: [],
  DA_THANH_TOAN: [],
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

  const handleStatusUpdate = async (maDonHang, newStatus) => {
    const result = await updateOrderStatus(maDonHang, newStatus);
    if (result.success) {
      alert('Cập nhật trạng thái thành công');
      setExpandedRow(null); // Close expanded row after successful update
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

  const StatusIcon = ({ trangThai }) => {
    const iconMap = {
      CHO_XAC_NHAN: '⏳',
      DA_XAC_NHAN: '✅',
      DANG_GIAO: '🚚',
      DA_GIAO: '📦',
      DA_HUY: '❌',
      DA_THANH_TOAN: '💳'
    };
    return <span className="text-lg mr-2">{iconMap[trangThai] || '📄'}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 mb-6">
          <div className="p-6 text-black rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-black mb-2">
                  📋 Quản lý đơn hàng
                </h1>
                <p className="text-indigo-900">
                  {status ? `Lọc theo: ${statusConfig[status]?.label || status}` : 'Tất cả đơn hàng'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3">
                  <input
                    type="date"
                    value={filterDate}
                    onChange={handleDateChange}
                    className="bg-transparent text-black placeholder-indigo-200 border-none outline-none text-sm"
                    style={{ colorScheme: 'dark' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="p-4 text-left font-bold text-gray-700">STT</th>
                  <th className="p-4 text-left font-bold text-gray-700">👤 Người nhận</th>
                  <th className="p-4 text-left font-bold text-gray-700">📍 Địa chỉ</th>
                  <th className="p-4 text-left font-bold text-gray-700">📞 SĐT</th>
                  <th className="p-4 text-left font-bold text-gray-700">📅 Ngày tạo</th>
                  <th className="p-4 text-left font-bold text-gray-700">💳 Thanh Toán</th>
                  <th className="p-4 text-left font-bold text-gray-700">🏷️ Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center p-12">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="text-gray-600">Đang tải dữ liệu...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="text-center p-12">
                      <div className="text-red-500 bg-red-50 rounded-lg p-6">
                        ❌ Lỗi: {error}
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order, index) => (
                    <React.Fragment key={order.maDonHang}>
                      <tr
                        className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer transition-all duration-300 transform hover:scale-[1.01]"
                        onClick={() => toggleRow(index)}
                      >
                        <td className="p-4">
                          <div className="w-8 h-8 text-black rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1 + page * 10}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-800">{order.tenNguoiNhan}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">{order.diaChi}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600">{`0${order.soDienThoai}`}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm text-gray-600">{new Date(order.ngayTao).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4">
                          <div className={`text-sm font-medium ${
                                order.coThanhToan ? 'text-green-600' : 'text-gray-600'
                              }`}>
                              {order.coThanhToan === true ? "Đã thanh toán" : "Chưa thanh toán"}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium border-2 ${
                            statusConfig[order.trangThai]?.bgColor || 'bg-gray-100'
                          } ${
                            statusConfig[order.trangThai]?.textColor || 'text-gray-700'
                          } ${
                            statusConfig[order.trangThai]?.borderColor || 'border-gray-200'
                          }`}>
                            <StatusIcon trangThai={order.trangThai} />
                            {statusConfig[order.trangThai]?.label || order.trangThai}
                          </div>
                        </td>
                        
                      </tr>
                      {expandedRow === index && (
                        <tr>
                          <td colSpan="6" className="bg-gradient-to-r from-slate-50 to-blue-50">
                            <div className="p-6">
                              {/* Order Details Section */}
                              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-6">
                                <div className="flex items-center mb-4">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">📦</span>
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-800 ml-3">Chi tiết đơn hàng</h3>
                                </div>
                                
                                <div className="space-y-4">
                                  {order.items.map((item, i) => (
                                    <div key={i} className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-100">
                                      <div className="flex items-center space-x-4">
                                        <div className="relative">
                                          <img
                                            src={item.hinhAnh}
                                            alt={item.tenSanPham}
                                            className="w-20 h-20 object-cover rounded-xl shadow-md border-2 border-white"
                                          />
                                          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                                            {item.soLuong}
                                          </div>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                          <h4 className="font-bold text-gray-800 text-lg">{item.tenSanPham}</h4>
                                          <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center space-x-2">
                                              <span className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"></span>
                                              <span className="text-gray-600">Màu: <span className="font-medium">{item.mauSac}</span></span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <span className="text-blue-500">📏</span>
                                              <span className="text-gray-600">Size: <span className="font-medium">{item.kichCo}</span></span>
                                            </div>
                                          </div>
                                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                                            <div className="text-sm text-gray-600">
                                              Đơn giá: <span className="font-medium text-indigo-600">{item.donGia.toLocaleString()} VND</span>
                                            </div>
                                            <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                                              {(item.donGia * item.soLuong).toLocaleString()} VND
                                            </div>
                                            
                                          </div>
                                          
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="text-xl text-gray-600">
                                              Tổng thu: <span className="font-medium text-indigo-600">{order.tongGia.toLocaleString()} VND</span>
                                          </div>

                              {/* Status Update Section */}
                              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center mb-6">
                                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">⚡</span>
                                  </div>
                                  <h3 className="text-lg font-bold text-gray-800 ml-3">Cập nhật trạng thái</h3>
                                </div>

                                {order.trangThai === 'CHO_XAC_NHAN' ? (
                                  <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                      onClick={() => handleStatusUpdate(order.maDonHang, 'DA_XAC_NHAN')}
                                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                                    >
                                      <span className="text-xl">✅</span>
                                      <span>Duyệt đơn hàng</span>
                                    </button>
                                    <button
                                      onClick={() => handleStatusUpdate(order.maDonHang, 'DA_HUY')}
                                      className="flex-1 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-2"
                                    >
                                      <span className="text-xl">❌</span>
                                      <span>Hủy đơn hàng</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
                                      <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chọn trạng thái mới:
                                      </label>
                                      <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1">
                                          <select
                                            value={statusUpdates[order.maDonHang] || order.trangThai}
                                            onChange={(e) => handleStatusSelectChange(order.maDonHang, e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 bg-white font-medium"
                                          >
                                            <option value={order.trangThai}>
                                              {statusConfig[order.trangThai]?.label || order.trangThai}
                                            </option>
                                            {allowedStatuses[order.trangThai]?.map((status) => (
                                              <option key={status} value={status}>
                                                {statusConfig[status]?.label || status}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                        <button
                                          onClick={() => handleStatusUpdate(order.maDonHang, statusUpdates[order.maDonHang] || order.trangThai)}
                                          disabled={!statusUpdates[order.maDonHang] || statusUpdates[order.maDonHang] === order.trangThai}
                                          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2"
                                        >
                                          <span className="text-lg">🔄</span>
                                          <span>Cập nhật</span>
                                        </button>
                                      </div>
                                    </div>
                                    
                                    {statusUpdates[order.maDonHang] && statusUpdates[order.maDonHang] !== order.trangThai && (
                                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                                        <div className="flex items-center space-x-3">
                                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xs">ℹ️</span>
                                          </div>
                                          <div className="flex-1">
                                            <p className="text-sm font-medium text-blue-800">
                                              Thay đổi từ: <span className="font-bold">{statusConfig[order.trangThai]?.label}</span>
                                              {' → '}
                                              <span className="font-bold">{statusConfig[statusUpdates[order.maDonHang]]?.label}</span>
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-12 pl-65">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-4xl">📋</span>
                        </div>
                        <p className="text-gray-600 text-lg">Không có đơn hàng nào.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-slate-50">
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 0}
                className="px-4 py-2 rounded-xl bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
              >
                ← Trước
              </button>
              
              <div className="flex space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
                      page === i 
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-110' 
                        : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 rounded-xl bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium"
              >
                Sau →
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 text-red-700 p-6 rounded-2xl text-center shadow-lg">
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;