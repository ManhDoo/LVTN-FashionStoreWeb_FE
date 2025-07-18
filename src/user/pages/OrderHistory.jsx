import React, { useState, useEffect } from "react";
import useOrderHistory from "../hooks/useOrderHistory";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const {
    orders,
    loading,
    error,
    fetchOrderHistory,
    cancelOrder,
    totalPages,
    currentPage,
    setCurrentPage,
  } = useOrderHistory();
  const [cancelError, setCancelError] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
    const navigate = useNavigate();
    const handleProductClick = (maSanPham) => {
    navigate(`/product/${encodeURIComponent(maSanPham)}`);
  };
  

  const getStatusColor = (status) => {
    switch (status) {
      case "DA_HUY":
        return "bg-red-100 text-red-800 border-red-200";
      case "CHO_XAC_NHAN":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "DA_XAC_NHAN":
        return "bg-yellow-100 text-yellow-800 border-yellow-500";
      case "DANG_GIAO":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DA_GIAO":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "DA_HUY":
        return "Đã hủy";
      case "CHO_XAC_NHAN":
        return "Chờ xác nhận";
      case "DA_XAC_NHAN":
        return "Đã xác nhận";
      case "DANG_GIAO":
        return "Đang giao";
      case "DA_GIAO":
        return "Đã giao";
      case "DA_THANH_TOAN":
        return "Đã thanh toán";
      default:
        return "Không xác định";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCancelOrder = async (maDonHang) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

    setCancelLoading(true);
    setCancelError(null);

    const result = await cancelOrder(maDonHang);
    if (result.success) {
      alert("Đơn hàng đã được hủy thành công!");
    } else {
      setCancelError(result.message);
    }

    setCancelLoading(false);
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    return order.trangThai === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Lịch Sử Đơn Hàng
              </h1>
              <p className="text-gray-600">
                Theo dõi và quản lý các đơn hàng của bạn
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/")}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span>Tiếp tục mua sắm</span>
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            {[
              { key: "all", label: "Tất cả" },
              { key: "CHO_XAC_NHAN", label: "Chờ xác nhận" },
              { key: "DANG_GIAO", label: "Đang giao" },
              { key: "DA_GIAO", label: "Đã giao" },
              { key: "DA_HUY", label: "Đã hủy" },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  filter === filterOption.key
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg"
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cancel Error Display */}
        {cancelError && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {cancelError}
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-pink-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Chưa có đơn hàng nào
              </h3>
              <p className="text-gray-500">
                Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên!
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.maDonHang}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100"
              >
                {/* Order Header */}
                <div className="px-6 py-4  border-b border-pink-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Đơn hàng #DH{order.maDonHang}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Ngày đặt: {formatDate(order.ngayTao)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          order.trangThai
                        )}`}
                      >
                        {getStatusText(order.trangThai)}
                      </span>
                      {order.coThanhToan === true && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-300">
                          Đã thanh toán
                        </span>
                      )}
                      {order.coYeuCauDoiTra === true && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium border bg-blue-100 text-blue-700 border-blue-300">
                          Yêu cầu trả hàng
                        </span>
                      )}
                    </div>
                    <div className="mt-2 sm:mt-0 text-right">
                      <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        {(order.tongGia ?? 0).toLocaleString("vi-VN")} ₫
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.tongSoLuong ?? 0} sản phẩm
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="grid gap-4">
                    {order.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-all duration-300"
                      >
                        <div className="flex-shrink-0">
                          <img
                            src={item.hinhAnh}
                            alt={item.tenSanPham}
                            className="w-16 h-16 object-cover rounded-lg shadow-md"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.tenSanPham}
                          </h4>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500">
                              SL: {item.soLuong}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-pink-600">
                            {(item.donGia ?? 0).toLocaleString("vi-VN")} ₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Xem chi tiết
                    </button>
                    {["CHO_XAC_NHAN", "DA_THANH_TOAN"].includes(
                      order.trangThai
                    ) && (
                      <button
                        onClick={() => handleCancelOrder(order.maDonHang)}
                        disabled={cancelLoading}
                        className={`flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg ${
                          cancelLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {cancelLoading ? "Đang hủy..." : "Hủy đơn hàng"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">
                    Chi tiết đơn hàng #{selectedOrder.maDonHang}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ngày đặt:</span>
                    <span className="font-semibold">
                      {formatDate(selectedOrder.ngayTao)}
                    </span>
                  </div>
                  {selectedOrder.ngayGiao && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Ngày giao:</span>
                      <span className="font-semibold">
                        {formatDate(selectedOrder.ngayGiao)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        selectedOrder.trangThai
                      )}`}
                    >
                      {getStatusText(selectedOrder.trangThai)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Địa chỉ giao hàng:</span>
                    <span className="font-semibold">
                      {selectedOrder.diaChi}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Sản phẩm đã đặt:</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between space-x-3 p-3 bg-gray-50 rounded-lg cursor-pointer"
                          onClick={() => handleProductClick(item.maSanPham)}
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={item.hinhAnh}
                              alt={item.tenSanPham}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium text-sm">
                                {item.tenSanPham}
                              </p>
                              <p className="text-xs text-gray-500">
                                SL: {item.soLuong}
                              </p>
                              <p className="text-xs text-gray-500">
                                Màu: {item.mauSac}
                              </p>
                              <p className="text-xs text-gray-500">
                                Size: {item.kichCo}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-end space-y-2">
                            <span className="font-semibold text-pink-600">
                              {(item.donGia ?? 0).toLocaleString("vi-VN")} ₫
                            </span>

                            {/* Nút hoàn trả cho từng sản phẩm */}
                            {["DA_GIAO", "DA_THANH_TOAN"].includes(
                              selectedOrder.trangThai
                            ) &&
                              !item.coYeuCauDoiTra && (
                                <button
                                  onClick={() => {
                                    const query = new URLSearchParams({
                                      maDonHang: selectedOrder.maDonHang,
                                      chiTietDonHangId: item.chiTietDonHangId,
                                      maSanPham: item.maSanPham,
                                      tenSanPham: item.tenSanPham,
                                      hinhAnh: item.hinhAnh,
                                      soLuong: item.soLuong,
                                      donGia: item.donGia,
                                      kichCo: item.kichCo,
                                      mauSac: item.mauSac,
                                    }).toString();

                                    window.location.href = `/return-request?${query}`;
                                  }}
                                  className="px-3 py-1 bg-yellow-400 text-white text-sm rounded hover:bg-yellow-500 cursor-pointer"
                                >
                                  Trả hàng
                                </button>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Tổng cộng:</span>
                      <span className="text-pink-600">
                        {(selectedOrder.tongGia ?? 0).toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  </div>
                  {/* Button: Return/Refund
                  {["DA_GIAO", "DA_THANH_TOAN"].includes(
                    selectedOrder.trangThai
                  ) &&
                    !selectedOrder.coYeuCauDoiTra && (
                      <div className="pt-4">
                        <button
                          onClick={() => {
                            window.location.href = `/return-request/${selectedOrder.maDonHang}`;
                          }}
                          className="w-full px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Trả hàng / Hoàn tiền
                        </button>
                      </div>
                    )} */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mb-2 flex justify-center space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-10 h-10 rounded-full border text-sm font-medium transition-all ${
                currentPage === i
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
