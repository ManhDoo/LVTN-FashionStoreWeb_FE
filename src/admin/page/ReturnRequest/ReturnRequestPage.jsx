import React, { useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import useReturnRequestsAdmin from "../../adminHooks/useReturnRequestsAdmin";
import ImagePopup from "../../utils/ImagePopup";
import axiosAdmin from "../../utils/axiosAdmin";
import { useNavigate } from 'react-router-dom';

const ReturnRequestPageAdmin = () => {
  const {
    returnRequests,
    loading,
    error,
    fetchReturnRequests,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useReturnRequestsAdmin();
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);
  const navigate = useNavigate();

  const formatDateVN = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getReturnTypeText = (type) => {
    switch (type) {
      case "TRA":
        return "Hoàn trả";
      case "DOI":
        return "Đổi hàng";
      default:
        return type;
    }
  };

  const getReturnReasonText = (reason) => {
    switch (reason) {
      case "THIEU_HANG":
        return "Thiếu hàng";
      case "KHONG_CON_NHU_CAU":
        return "Không còn nhu cầu";
      case "LOI_SAN_PHAM":
        return "Sản phẩm lỗi";
      case "KHAC_MO_TA":
        return "Khác mô tả";
      case "GUI_SAI_HANG":
        return "Gửi sai hàng";
      default:
        return reason;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "CHO_XAC_NHAN":
        return "Chờ xác nhận";
      case "DA_XAC_NHAN":
        return "Đã xác nhận";
      case "TU_CHOI":
        return "Từ chối";
      case "DANG_XU_LY":
        return "Đang xử lý";
      case "HOAN_THANH":
        return "Hoàn thành";
      default:
        return status;
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleStatusUpdate = async (maPhieu, loai, newStatus) => {
    try {
      setUpdatingStatus(true);
      setUpdateError(null);
      await axiosAdmin.put(`/api/returns/${maPhieu}/status?status=${newStatus}`);
      setSelectedReturn((prev) =>
        prev && prev.maPhieu === maPhieu ? { ...prev, trangThai: newStatus } : prev
      );
      if (newStatus === "HOAN_THANH" && loai === "DOI") {
        alert("Cập nhìn trạng thái thành công! Đã tự động tạo đơn hàng mới cho khách hàng.");
      } else {
        alert("Cập nhật trạng thái thành công!");
      }
      fetchReturnRequests(currentPage); // Refresh the current page
      setSelectedReturn(null);
      setPendingStatus(null);
    } catch (err) {
      setUpdateError("Lỗi khi cập nhật trạng thái: " + (err.response?.data?.message || err.message));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const statusOptions = [
    { value: "DA_XAC_NHAN", label: "Đã xác nhận" },
    { value: "DANG_XU_LY", label: "Đang xử lý" },
    { value: "HOAN_THANH", label: "Hoàn thành" },
  ];

  return (
    <div className="p-4">
      {/* Bảng danh sách yêu cầu hoàn trả */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h4 className="text-lg font-medium">Danh sách yêu cầu hoàn trả</h4>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-bold">STT</th>
                  <th className="p-3 font-bold">Mã phiếu</th>
                  <th className="p-3 font-bold">Mã đơn hàng</th>
                  <th className="p-3 font-bold">Loại</th>
                  <th className="p-3 font-bold">Lý do</th>
                  <th className="p-3 font-bold">Ngày tạo</th>
                  <th className="p-3 font-bold">Trạng thái</th>
                  <th className="p-3 font-bold">Xem chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto"></div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="text-center p-4 text-red-500">
                      {error}
                      <button
                        onClick={() => fetchReturnRequests(currentPage)}
                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Thử lại
                      </button>
                    </td>
                  </tr>
                ) : returnRequests.length > 0 ? (
                  returnRequests.map((request, index) => (
                    <tr
                      key={request.maPhieu}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">{index + 1 + currentPage * 10}</td>
                      <td className="p-3">{request.maPhieu}</td>
                      <td className="p-3">{request.maDonHang}</td>
                      <td className="p-3">{getReturnTypeText(request.loai)}</td>
                      <td className="p-3">{getReturnReasonText(request.lyDo)}</td>
                      <td className="p-3">{formatDateVN(request.ngayTao)}</td>
                      <td className="p-3">{getStatusText(request.trangThai)}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedReturn(request);
                            setPendingStatus(request.trangThai);
                          }}
                          className="inline-block bg-blue-500 text-white p-2 rounded mr-1 hover:bg-blue-600"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-4">
                      Không có yêu cầu hoàn trả nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } transition-all duration-300`}
          >
            Trước
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } transition-all duration-300`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages - 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            } transition-all duration-300`}
          >
            Sau
          </button>
        </div>
      )}

      {/* Modal chi tiết yêu cầu hoàn trả */}
      {selectedReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h4 className="text-lg font-medium">
                Chi tiết yêu cầu hoàn trả #{selectedReturn.maPhieu}
              </h4>
              <button
                onClick={() => {
                  setSelectedReturn(null);
                  setPendingStatus(null);
                }}
                className="text-gray-500 hover:text-gray-700"
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
            <div className="p-6">
              {updateError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {updateError}
                </div>
              )}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Mã phiếu:</span>
                  <span>{selectedReturn.maPhieu}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Mã đơn hàng:</span>
                  <span>{selectedReturn.maDonHang}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Loại:</span>
                  <span>{getReturnTypeText(selectedReturn.loai)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Lý do:</span>
                  <span>{getReturnReasonText(selectedReturn.lyDo)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Ngày tạo:</span>
                  <span>{formatDateVN(selectedReturn.ngayTao)}</span>
                </div>
                <div className="flex justify-between">
  <span className="font-medium">Số tiền hoàn trả:</span>
  <span>
    {selectedReturn.loai === "DOI"
      ? "0 VNĐ"
      : `${selectedReturn.soTienHoanTra.toLocaleString()} VNĐ`}
  </span>
</div>

                <div className="flex justify-between items-center">
                  <span className="font-medium">Trạng thái:</span>
                  <div className="flex items-center space-x-2">
                    {selectedReturn.trangThai === "CHO_XAC_NHAN" ? (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(selectedReturn.maPhieu, selectedReturn.loai, "DA_XAC_NHAN")}
                          disabled={updatingStatus}
                          className={`px-4 py-2 rounded text-white ${
                            updatingStatus
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                        >
                          {updatingStatus ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                              Đang duyệt
                            </div>
                          ) : (
                            "Duyệt"
                          )}
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedReturn.maPhieu, selectedReturn.loai, "TU_CHOI")}
                          disabled={updatingStatus}
                          className={`px-4 py-2 rounded text-white ${
                            updatingStatus
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-500 hover:bg-red-600"
                          }`}
                        >
                          {updatingStatus ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                              Đang từ chối
                            </div>
                          ) : (
                            "Từ chối"
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        <select
                          value={pendingStatus || selectedReturn.trangThai}
                          onChange={(e) => setPendingStatus(e.target.value)}
                          disabled={updatingStatus || selectedReturn.trangThai === "TU_CHOI"}
                          className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleStatusUpdate(selectedReturn.maPhieu, selectedReturn.loai, pendingStatus)}
                          disabled={updatingStatus || !pendingStatus || pendingStatus === selectedReturn.trangThai}
                          className={`px-4 py-2 rounded text-white ${
                            updatingStatus || !pendingStatus || pendingStatus === selectedReturn.trangThai
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          {updatingStatus ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                              Đang cập nhật
                            </div>
                          ) : (
                            "Cập nhật"
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Hình ảnh minh chứng:</h5>
                  {selectedReturn.chiTietDoiTra.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-6 p-4 bg-gray-50 rounded-lg mb-4"
                    >
                      <div className="flex flex-wrap gap-4">
                        {item.hinhAnhMinhChung.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`${item.tenSanPham} - ${idx + 1}`}
                            className="w-24 h-24 object-cover rounded-lg shadow-sm cursor-pointer hover:opacity-80"
                            onClick={() => handleImageClick(img)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <h5 className="font-medium mb-2">Sản phẩm hoàn trả:</h5>
                  {selectedReturn.chiTietDoiTra.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-6 p-4 bg-gray-50 rounded-lg mb-4"
                    >
                      <img
                        src={item.hinhAnh[0]}
                        alt={item.tenSanPham}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-lg">{item.tenSanPham}</p>
                        <p className="text-sm text-gray-600">
                          Số lượng: {item.soLuongDoi}
                        </p>
                        <p className="text-sm text-gray-600">
                          Lý do chi tiết: {item.lyDoChiTiet}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup hiển thị ảnh lớn */}
      {selectedImage && (
        <ImagePopup
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default ReturnRequestPageAdmin;