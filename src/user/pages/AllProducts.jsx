import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useProductList from '../hooks/useProductStore';

const AllProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, loading, error, categoryInfo  } = useProductList(category);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;
  if (products.length === 0) return <div>Không có sản phẩm nào để hiển thị.</div>;

  return (
    <div className="bg-white p-4 mt-4">
      <h2 className="text-2xl font-bold mb-10 mt-6 text-center">{!isNaN(category) ? `Danh mục ${category}` : category}</h2>
      <div className="grid grid-cols-4 gap-4 pl-15">
        {products.map((product) => (
          <div
            key={product.maSanPham}
            className="pr-7 cursor-pointer"
            onClick={() => navigate(`/product/${product.maSanPham}`)}
          >
            <img
              src={product.hinhAnh[0]}
              alt={product.tensp}
              className="h-[480px] rounded-md"
            />
            <div className="flex space-x-2">
              <span key="black" className="text-black text-4xl">●</span>
              <span key="blue" className="text-blue-500 text-4xl">●</span>
              <span key="red" className="text-red-500 text-4xl">●</span>
            </div>
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

export default AllProducts;