// src/pages/admin/PromotionProductPage.jsx
import React from 'react';
import usePromotionProducts from '../../../user/hooks/usePromotionProducts';
import usePromotionAdmin from '../../adminHooks/usePromotionAdmin';
import { useNavigate } from 'react-router-dom';

const PromotionProductPage = () => {
  const { products, loading, error } = usePromotionProducts();
  const { deletePromotionProduct } = usePromotionAdmin();
  const navigate = useNavigate();

  const formatCurrency = (number) =>
    number.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  return (
    <div className="p-4">
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h4 className="text-lg font-medium">Danh sách sản phẩm có khuyến mãi</h4>
          <a
            href="/promotion-assign"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Thêm khuyến mãi cho sản phẩm
          </a>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-bold">STT</th>
                  <th className="p-3 font-bold">Tên sản phẩm</th>
                  <th className="p-3 font-bold">Ảnh</th>
                  <th className="p-3 font-bold">Giá gốc</th>
                  <th className="p-3 font-bold">Khuyến mãi</th>
                  <th className="p-3 font-bold">Giá sau giảm</th>
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
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center">
                      Không có sản phẩm khuyến mãi nào.
                    </td>
                  </tr>
                ) : (
                  products.map((product, index) => {
                    const discount = product.khuyenMai.giaTriGiam;
                    const isPercent = product.khuyenMai.hinhThucGiam === 'Phần trăm';
                    const finalPrice = isPercent
                      ? product.giaGoc * (1 - discount / 100)
                      : product.giaGoc - discount;

                    return (
                      <tr key={product.maSanPham} className="border-b hover:bg-gray-50">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">{product.tensp}</td>
                        <td className="p-3">
                          <img
                            src={product.hinhAnh[0]}
                            alt={product.tensp}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="p-3">{formatCurrency(product.giaGoc)}</td>
                        <td className="p-3">
                          {product.khuyenMai.tenKhuyenMai} <br />
                          ({discount}
                          {isPercent ? '%' : ' VND'})
                        </td>
                        <td className="p-3 text-green-600 font-semibold">
                          {formatCurrency(finalPrice)}
                        </td>
                        <td className="p-3">{product.khuyenMai.trangThai}</td>
                        <td className="p-3">
                          <button
                            onClick={() => deletePromotionProduct(product.maSanPham)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Xóa
                          </button>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionProductPage;
