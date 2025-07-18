// src/user/pages/ProductsByGender.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductsByGender from '../hooks/useProductsByGender';
import { slugify } from "../utils/slugify";

const ProductsByGenderPage = () => {
  const { gender } = useParams(); // FOR MAN / FOR WOMAN
  const navigate = useNavigate();
  const { products, loading, error, categoryInfo } = useProductsByGender(gender);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (products.length === 0) return <div>Không có sản phẩm nào.</div>;

  return (
    <div className="bg-white p-4 mt-4">
      <h2 className="text-2xl font-bold mb-10 mt-6 text-center">
        {gender}
      </h2>
      <div className="grid grid-cols-4 gap-4 pl-45 pr-30">
        {products.map(product => (
          <div
            key={product.maSanPham}
            className="pr-7 cursor-pointer"
            onClick={() => navigate(`/product/${slugify(product.tensp)}-${product.maSanPham}`)
}
          >
            <img src={product.hinhAnh[0]} alt={product.tensp} className="h-[480px] rounded-md" />
            <p className="font-bold">{product.tensp}</p>
            <p className="text-red-500">
              {product.giaGoc != null ? product.giaGoc.toLocaleString('vi-VN') + ' VND' : 'Đang cập nhật'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsByGenderPage;
