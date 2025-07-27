import React, { useState } from 'react';
import usePromotionAdmin from '../../adminHooks/usePromotionAdmin';
import useProductAdmin from '../../adminHooks/useProductAdmin';
import axiosAdmin from '../../utils/axiosAdmin';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const AssignPromotionToProduct = () => {
  const { promotions } = usePromotionAdmin();
  const { products } = useProductAdmin();
  const navigate = useNavigate();

  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedPromotionId, setSelectedPromotionId] = useState('');
  const [message, setMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectProduct = (productId) => {
    if (!selectedProductIds.includes(productId)) {
      setSelectedProductIds([...selectedProductIds, productId]);
    }
    setIsModalOpen(false);
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProductIds(selectedProductIds.filter((id) => id !== productId));
  };

  const handleAssign = async () => {
    if (selectedProductIds.length === 0 || !selectedPromotionId) {
      setMessage('Vui lòng chọn ít nhất một sản phẩm và một khuyến mãi.');
      return;
    }

    try {
      await Promise.all(
        selectedProductIds.map((productId) =>
          axiosAdmin.put(
            `/api/promotion/gan-san-pham?maSanPham=${productId}&maKhuyenMai=${selectedPromotionId}`
          )
        )
      );
      setMessage('Gán khuyến mãi thành công!');
      navigate('/promotion-page');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gán khuyến mãi thất bại.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Gán Khuyến Mãi Cho Sản Phẩm</h2>

      {/* Chọn khuyến mãi */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Chọn khuyến mãi</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={selectedPromotionId}
          onChange={(e) => setSelectedPromotionId(e.target.value)}
        >
          <option value="">-- Chọn khuyến mãi --</option>
          {promotions.map((promotion) => (
            <option key={promotion.maKhuyenMai} value={promotion.maKhuyenMai}>
              {promotion.tenKhuyenMai} ({promotion.trangThai})
            </option>
          ))}
        </select>
      </div>

      {/* Hiển thị sản phẩm đã chọn */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Sản phẩm đã chọn</label>
        {selectedProductIds.length > 0 ? (
          <div className="flex gap-3 flex-wrap">
            {selectedProductIds.map((productId) => {
              const product = products.find((p) => p.maSanPham === productId);
              return (
                <div key={productId} className="relative w-20 h-20">
                  <img
                    src={product?.hinhAnh?.[0] || ''}
                    alt={product?.tensp}
                    className="w-full h-full object-cover rounded border"
                  />
                  <button
                    onClick={() => handleRemoveProduct(productId)}
                    className="absolute top-0 right-0 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Xóa sản phẩm"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400">Chưa có sản phẩm nào được chọn.</p>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="mb-4 w-full bg-gray-800 hover:bg-gray-900 text-white py-2 rounded"
      >
        Chọn sản phẩm
      </button>

      {/* Modal hiển thị sản phẩm */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-6 max-w-5xl mx-auto mt-20 rounded shadow max-h-[80vh] overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 z-50"
      >
        <h3 className="text-xl font-semibold mb-4">Chọn sản phẩm</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Hình ảnh</th>
              <th className="p-2">Tên</th>
              <th className="p-2">Giá gốc</th>
              <th className="p-2">Khuyến mãi</th>
              <th className="p-2">Chọn</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.maSanPham} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  <img
                    src={product.hinhAnh?.[0] || ''}
                    alt={product.tensp}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-2">{product.tensp}</td>
                <td className="p-2">{product.giaGoc?.toLocaleString()}₫</td>
                <td className="p-2">
                  {product.khuyenMai ? (
                    <span className="text-green-600">{product.khuyenMai.tenKhuyenMai}</span>
                  ) : (
                    <span className="text-gray-400">Chưa có</span>
                  )}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleSelectProduct(product.maSanPham)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    disabled={selectedProductIds.includes(product.maSanPham)}
                  >
                    Chọn
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal>

      {/* Gán */}
      <button
        onClick={handleAssign}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Gán khuyến mãi
      </button>

      {/* Thông báo */}
      {message && <p className="mt-4 text-center text-sm text-red-600">{message}</p>}
    </div>
  );
};

export default AssignPromotionToProduct;