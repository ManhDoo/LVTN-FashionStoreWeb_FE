import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import usePromotionProducts from "../hooks/usePromotionProducts";
import { slugify } from "../utils/slugify";

const PromotionProducts = () => {
  const navigate = useNavigate();
  const scrollRef = useRef();
  const { products, loading, error } = usePromotionProducts();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const calculateDiscountedPrice = (product) => {
    if (!product.khuyenMai || product.khuyenMai.giaTriGiam === 0) return null;
    const discount = product.khuyenMai.giaTriGiam;
    return product.khuyenMai.hinhThucGiam === "Phần trăm"
      ? product.giaGoc * (1 - discount / 100)
      : product.giaGoc - discount;
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white p-4 mt-4 relative mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Sản phẩm khuyến mãi
      </h2>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
        >
          ←
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
        >
          →
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-6 scroll-smooth scrollbar-hide"
        >
          {products
            .filter(
              (product) =>
                product.khuyenMai &&
                product.khuyenMai.trangThai !== "Đã kết thúc"
            )
            .map((product) => {
              const discountedPrice = calculateDiscountedPrice(product);

              return (
                <div
                  key={product.maSanPham}
                  className="min-w-[300px] cursor-pointer"
                  onClick={() => navigate(`/product/${slugify(product.tensp)}-${product.maSanPham}`)
}
                >
                  <div className="relative">
                    <img
                      src={product.hinhAnh[0]}
                      alt={product.tensp}
                      className="h-[480px] w-full object-cover rounded-md"
                    />
                    {product.khuyenMai && product.khuyenMai.giaTriGiam > 0 && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm">
                        -{product.khuyenMai.giaTriGiam}
                        {product.khuyenMai.hinhThucGiam === "Phần trăm"
                          ? "%"
                          : "K"}
                      </span>
                    )}
                  </div>
                  <p className="font-bold mt-2">{product.tensp}</p>
                  <div className="flex items-center space-x-2">
                    {discountedPrice ? (
                      <>
                        <p className="text-red-500 text-lg font-semibold">
                          {discountedPrice.toLocaleString("vi-VN")} VND
                        </p>
                        <p className="text-gray-500 line-through">
                          {product.giaGoc.toLocaleString("vi-VN")} VND
                        </p>
                      </>
                    ) : (
                      <p className="text-red-500">
                        {product.giaGoc.toLocaleString("vi-VN")} VND
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PromotionProducts;
