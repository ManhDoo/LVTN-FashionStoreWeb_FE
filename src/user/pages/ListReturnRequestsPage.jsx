import React, { useState } from "react";
import useReturnRequests from "../hooks/useReturnRequests.JS";
const ListReturnRequestPage = () => {
  const { returnRequests, loadingReturns, errorReturns } = useReturnRequests();
  const [selectedReturn, setSelectedReturn] = useState(null);

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

  const getReturnTypeText = (type) => {
    switch (type) {
      case "HOAN_TRA":
        return "TRẢ HÀNG/HOÀN TIÊN";
      default:
        return type;
    }
  };

  const getReturnReasonText = (reason) => {
    switch (reason) {
      case "THIEU_HANG":
        return "Thiếu hàng";
      case "SAI_SAN_PHAM":
        return "Sai sản phẩm";
      case "SAN_PHAM_LOI":
        return "Sản phẩm lỗi";
      default:
        return reason;
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

  if (loadingReturns) {
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

  if (errorReturns) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-500">{errorReturns}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Yêu Cầu Hoàn Trả
              </h1>
              <p className="text-gray-600">
                Theo dõi và quản lý các yêu cầu hoàn trả của bạn
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/orders")}
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
              <span>Quay lại lịch sử đơn hàng</span>
            </button>
          </div>
        </div>

        {/* Return Requests List */}
        <div className="space-y-6">
          {returnRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full flex items-center justify-center">
                
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Chưa có yêu cầu hoàn trả nào
                </h3>
                <p className="text-gray-500">
                  Hiện tại bạn chưa có yêu cầu hoàn trả nào.
                </p>
              </div>
          ) : (
            returnRequests.map((returnRequest) => (
              <div
                key={returnRequest.maPhieu}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-100"
              >
                <div className="px-6 py-4 border-b border-pink-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Yêu cầu hoàn trả #{returnRequest.maPhieu}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Đơn hàng #{returnRequest.maDonHang} | Ngày tạo:{" "}
                          {formatDate(returnRequest.ngayTao)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          returnRequest.trangThai
                        )}`}
                      >
                        {getStatusText(returnRequest.trangThai)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          Loại: {getReturnTypeText(returnRequest.loai)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Lý do: {getReturnReasonText(returnRequest.lyDo)}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedReturn(returnRequest)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        Xem chi tiết
                      </button>
                    </div>
                    {returnRequest.chiTietDoiTra.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-all duration-300"
                      >
                        <img
                        src={item.hinhAnh[0]}
                        alt={item.tenSanPham}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      />
                        
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {item.tenSanPham}
                          </p>
                          <p className="text-sm text-gray-600">
                            Số lượng đổi: {item.soLuongDoi}
                          </p>
                          <p className="text-sm text-gray-600">
                            Lý do: {item.lyDoChiTiet}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Return Request Detail Modal */}
        {selectedReturn && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl???xl font-bold">
                    Chi tiết yêu cầu hoàn trả #{selectedReturn.maPhieu}
                  </h2>
                  <button
                    onClick={() => setSelectedReturn(null)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                  >
                    {/* <img
                        src={item.hinhAnh[0]}
                        alt={item.tenSanPham}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      /> */}
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
                    <span className="text-gray-600">Mã đơn hàng:</span>
                    <span className="font-semibold">
                      {selectedReturn.maDonHang}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Ngày tạo:</span>
                    <span className="font-semibold">
                      {formatDate(selectedReturn.ngayTao)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Loại:</span>
                    <span className="font-semibold">
                      {getReturnTypeText(selectedReturn.loai)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lý do:</span>
                    <span className="font-semibold">
                      {getReturnReasonText(selectedReturn.lyDo)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        selectedReturn.trangThai
                      )}`}
                    >
                      {getStatusText(selectedReturn.trangThai)}
                    </span>
                  </div>
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Sản phẩm hoàn trả:</h3>
                    <div className="space-y-3">
                      {selectedReturn.chiTietDoiTra.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <p>Hình ảnh minh chứng</p>
                            <img
                            src={item.hinhAnhMinhChung[0]}
                            alt={item.tenSanPham}
                            className="w-50 h-50 object-cover rounded-lg"
                          />
                          </div>
                          {/* <img
                            src={item.hinhAnh[0]}
                            alt={item.tenSanPham}
                            className="w-12 h-12 object-cover rounded-lg"
                          /> */}
                          {/* <div>
                            <p className="font-medium text-sm">
                              {item.tenSanPham}
                            </p>
                            <p className="text-xs text-gray-500">
                              Số lượng đổi: {item.soLuongDoi}
                            </p>
                            <p className="text-xs text-gray-500">
                              Lý do: {item.lyDoChiTiet}
                            </p>
                          </div> */}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListReturnRequestPage;