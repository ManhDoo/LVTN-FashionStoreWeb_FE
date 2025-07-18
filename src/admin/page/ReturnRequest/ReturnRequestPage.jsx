import React, { useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/outline';
import useReturnRequestsAdmin from '../../adminHooks/useReturnRequestsAdmin';

const ReturnRequestPageAdmin = () => {
  const { returnRequests, loading, error } = useReturnRequestsAdmin();
  const [selectedReturn, setSelectedReturn] = useState(null);

  const formatDateVN = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReturnTypeText = (type) => {
    switch (type) {
      case 'HOAN_TRA':
        return 'Hoàn trả';
      case 'DOI':
        return 'Đổi hàng';
      default:
        return type;
    }
  };

  const getReturnReasonText = (reason) => {
    switch (reason) {
      case 'THIEU_HANG':
        return 'Thiếu hàng';
      case 'SAI_SAN_PHAM':
        return 'Sai sản phẩm';
      case 'SAN_PHAM_LOI':
        return 'Sản phẩm lỗi';
      default:
        return reason;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'CHO_XAC_NHAN':
        return 'Chờ xác nhận';
      case 'DA_XAC_NHAN':
        return 'Đã xác nhận';
      case 'DA_HUY':
        return 'Đã hủy';
      case 'DANG_GIAO':
        return 'Đang giao';
      case 'DA_GIAO':
        return 'Đã giao';
      default:
        return status;
    }
  };

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
                  <th className="p-3 font-bold">Thao tác</th>
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
                    </td>
                  </tr>
                ) : returnRequests.length > 0 ? (
                  returnRequests.map((request, index) => (
                    <tr key={request.maPhieu} className="border-b hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{request.maPhieu}</td>
                      <td className="p-3">{request.maDonHang}</td>
                      <td className="p-3">{getReturnTypeText(request.loai)}</td>
                      <td className="p-3">{getReturnReasonText(request.lyDo)}</td>
                      <td className="p-3">{formatDateVN(request.ngayTao)}</td>
                      <td className="p-3">{getStatusText(request.trangThai)}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedReturn(request)}
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

      {/* Modal chi tiết yêu cầu hoàn trả */}
      {selectedReturn && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h4 className="text-lg font-medium">Chi tiết yêu cầu hoàn trả #{selectedReturn.maPhieu}</h4>
              <button
                onClick={() => setSelectedReturn(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <span className="font-medium">Trạng thái:</span>
                  <span>{getStatusText(selectedReturn.trangThai)}</span>
                </div>
                <div>
                    <h5 className="font-medium mb-2">Hình ảnh minh chứng:</h5>
                    {selectedReturn.chiTietDoiTra.map((item, index) => (
                    <div key={index} className="flex items-start space-x-6 p-4 bg-gray-50 rounded-lg mb-4">
                      <img
                        src={item.hinhAnh[0]}
                        alt={item.tenSanPham}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      />
                     
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4">
                  <h5 className="font-medium mb-2">Sản phẩm hoàn trả:</h5>
                  {selectedReturn.chiTietDoiTra.map((item, index) => (
                    <div key={index} className="flex items-start space-x-6 p-4 bg-gray-50 rounded-lg mb-4">
                      {/* <img
                        src={item.hinhAnh[0]}
                        alt={item.tenSanPham}
                        className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      /> */}
                      <div className="flex-1">
                        <p className="font-medium text-lg">{item.tenSanPham}</p>
                        <p className="text-sm text-gray-600">Số lượng: {item.soLuongDoi}</p>
                        <p className="text-sm text-gray-600">Lý do chi tiết: {item.lyDoChiTiet}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnRequestPageAdmin;