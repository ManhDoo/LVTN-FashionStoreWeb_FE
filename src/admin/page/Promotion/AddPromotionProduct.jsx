import React, { useState } from 'react';
import usePromotionAdmin from '../../adminHooks/usePromotionAdmin';
import useProductAdmin from '../../adminHooks/useProductAdmin';
import axiosAdmin from '../../utils/axiosAdmin';
import { useNavigate } from 'react-router-dom';

const AssignPromotionToProduct = () => {
  const { promotions } = usePromotionAdmin();
  const { products } = useProductAdmin();
const navigate = useNavigate();
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedPromotionId, setSelectedPromotionId] = useState('');
  const [message, setMessage] = useState(null);

  const handleAssign = async () => {
    if (!selectedProductId || !selectedPromotionId) {
      setMessage('Vui lòng chọn cả sản phẩm và khuyến mãi.');
      return;
    }

    try {
      await axiosAdmin.put(
        `/api/promotion/gan-san-pham?maSanPham=${selectedProductId}&maKhuyenMai=${selectedPromotionId}`
      );
      setMessage('Gán khuyến mãi thành công!');
      navigate('/promotion-page');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Gán khuyến mãi thất bại.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Gán Khuyến Mãi Cho Sản Phẩm</h2>

      {/* Chọn sản phẩm */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Chọn sản phẩm</label>
        <select
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">-- Chọn sản phẩm --</option>
          {products.map((product) => (
            <option key={product.maSanPham} value={product.maSanPham}>
              {product.tensp}
            </option>
          ))}
        </select>
      </div>

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

      {/* Gán */}
      <button
        onClick={handleAssign}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Gán khuyến mãi
      </button>

      {/* Thông báo */}
      {message && (
        <p className="mt-4 text-center text-sm text-red-600">{message}</p>
      )}
    </div>
  );
};

export default AssignPromotionToProduct;
