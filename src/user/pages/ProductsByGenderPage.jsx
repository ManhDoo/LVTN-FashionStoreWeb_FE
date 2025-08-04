// src/user/pages/ProductsByGender.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductsByGender from '../hooks/useProductsByGender';
import { slugify } from "../utils/slugify";

const ProductsByGenderPage = () => {
  const { gender } = useParams(); // FOR MAN / FOR WOMAN
  const navigate = useNavigate();
  const { products, loading, error, categoryInfo } = useProductsByGender(gender);

  const calculateDiscountedPrice = (product) => {
    if (
      !product.khuyenMai ||
      product.khuyenMai.giaTriGiam === 0 ||
      product.khuyenMai.trangThai === "Đã kết thúc"
    ) {
      return null;
    }

    const discount = product.khuyenMai.giaTriGiam;
    return product.khuyenMai.hinhThucGiam === "Phần trăm"
      ? product.giaGoc * (1 - discount / 100)
      : product.giaGoc - discount;
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-lg">Đang tải...</div>
    </div>
  );
  
  if (error) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500 text-lg">{error}</div>
    </div>
  );
  
  if (products.length === 0) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-gray-500 text-lg">Không có sản phẩm nào.</div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-900">
          {gender}
        </h2>
      </div>

      {/* Products Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map(product => {
            const discountedPrice = calculateDiscountedPrice(product);

            return (
              <div
                key={product.maSanPham}
                className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                onClick={() => navigate(`/product/${slugify(product.tensp)}-${product.maSanPham}`)}
              >
                {/* Product Image */}
                <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-gray-100 relative">
                  <img 
                    src={product.hinhAnh[0]} 
                    alt={product.tensp} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Discount Badge */}
                  {product.khuyenMai &&
                    product.khuyenMai.giaTriGiam > 0 &&
                    product.khuyenMai.trangThai !== "Đã kết thúc" && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm font-medium">
                        -{product.khuyenMai.giaTriGiam}
                        {product.khuyenMai.hinhThucGiam === "Phần trăm" ? "%" : "K"}
                      </span>
                    )}
                </div>
                
                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700">
                    {product.tensp}
                  </h3>
                  <div className="flex flex-col space-y-1">
                    {discountedPrice ? (
                      <>
                        <p className="text-red-600 font-bold text-sm sm:text-base">
                          {discountedPrice.toLocaleString('vi-VN')} VND
                        </p>
                        <p className="text-gray-500 line-through text-xs sm:text-sm">
                          {product.giaGoc.toLocaleString('vi-VN')} VND
                        </p>
                      </>
                    ) : (
                      <p className="text-red-600 font-bold text-sm sm:text-base">
                        {product.giaGoc != null 
                          ? product.giaGoc.toLocaleString('vi-VN') + ' VND' 
                          : 'Đang cập nhật'
                        }
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductsByGenderPage;