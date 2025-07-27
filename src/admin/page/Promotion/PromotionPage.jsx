import React, { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import usePromotionAdmin from '../../adminHooks/usePromotionAdmin';
import { useNavigate } from 'react-router-dom';

const PromotionPage = () => {
  const { promotions,loading, error, deletePromotion } = usePromotionAdmin();
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const formatDateVN = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="p-4">
      {/* Bảng danh sách khuyến mãi */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h4 className="text-lg font-medium">Danh sách khuyến mãi</h4>
          <a
            href="/promotion-create"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Tạo khuyến mãi mới
          </a>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-bold">STT</th>
                  <th className="p-3 font-bold">Tên khuyến mãi</th>
                  <th className="p-3 font-bold">Giá trị giảm</th>
                  <th className="p-3 font-bold">Hình thức</th>
                  <th className="p-3 font-bold">Loại</th>
                  <th className="p-3 font-bold">Ngày bắt đầu</th>
                  <th className="p-3 font-bold">Ngày kết thúc</th>
                  <th className="p-3 font-bold">Trạng thái</th>
                  <th className="p-3 font-bold">Thao tác</th>
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
                ) :error ? (
                  <tr>
                    <td colSpan="9" className="text-center p-4 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : promotions.length > 0 ? (
                  promotions.map((promo, index) => (
                    <tr key={promo.maKhuyenMai} className="border-b hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{promo.tenKhuyenMai}</td>
                      <td className="p-3">
                        {promo.giaTriGiam} {promo.hinhThucGiam === 'Phần trăm' ? '%' : 'VND'}
                      </td>
                      <td className="p-3">{promo.hinhThucGiam}</td>
                      <td className="p-3">{promo.loaiKhuyenMai}</td>
                      <td className="p-3">{formatDateVN(promo.ngayBatDau)}</td>
                      <td className="p-3">{formatDateVN(promo.ngayKetThuc)}</td>
                      <td className="p-3">{promo.trangThai}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => navigate(`/promotion-edit/${promo.maKhuyenMai}`)}
                          className="inline-block bg-blue-500 text-white p-2 rounded mr-1 hover:bg-blue-600"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm("Bạn có chắc chắn muốn xóa khuyến mãi này không?")) {
                              try {
                                await deletePromotion(promo.maKhuyenMai);
                                setMessage("Đã xóa khuyến mãi thành công. Tải lại trang để cập nhật.");
                              } catch (err) {
                                setMessage(err.message);
                              }
                            }
                          }}
                          className="inline-block bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center p-4">
                      Không có khuyến mãi nào.
                    </td>
                  </tr>
                )}
              </tbody>
              {message && (
  <div className="p-4 text-white bg-yellow-500 rounded-md mb-4">
    {message}
  </div>
)}

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionPage;
