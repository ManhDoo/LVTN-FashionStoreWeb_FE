import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";
import { Heart } from "lucide-react";
import useFavorite from "../hooks/useFavoriteItems";
import LoadingSpinner from "../components/LoadingSpinner";

const FavoritePage = () => {
  const scrollRef = useRef();
  const navigate = useNavigate();
  const {
    favoriteProducts: products,
    favoriteIds,
    addToFavorite,
    removeFromFavorite,
    loading,
    error
  } = useFavorite(); // ✅ Dùng lại hook

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

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
  
  if (loading) return <LoadingSpinner />;

  // ✅ Error
  if (error) {
    return (
      <div className="text-red-500 text-center py-6">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 mt-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Sản phẩm yêu thích</h2>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">Bạn chưa có sản phẩm yêu thích nào.</p>
      ) : (
        <>
          {/* Scroll Buttons */}
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

          {/* Product List */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-6 scroll-smooth scrollbar-hide"
          >
            {products.map((product) => {
              const discountedPrice = calculateDiscountedPrice(product);
              const isFavorite = favoriteIds.includes(product.maSanPham);

              return (
                <div
                  key={product.maSanPham}
                  className="min-w-[300px] cursor-pointer relative group"
                >
                  <div
                    onClick={() =>
                      navigate(
                        `/product/${slugify(product.tensp)}-${product.maSanPham}`
                      )
                    }
                  >
                    <div className="relative">
                      <img
                        src={product.hinhAnh[0]}
                        alt={product.tensp}
                        className="h-[480px] w-full object-cover rounded-md"
                      />
                      {product.khuyenMai &&
                        product.khuyenMai.giaTriGiam > 0 &&
                        product.khuyenMai.trangThai !== "Đã kết thúc" && (
                          <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm">
                            - {product.khuyenMai.giaTriGiam}
                            {product.khuyenMai.hinhThucGiam === "Phần trăm"
                              ? "%"
                              : "K"}
                          </span>
                        )}
                    </div>
                  </div>

                  {/* ❤️ Nút yêu thích */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFavorite) {
                        removeFromFavorite(product.maSanPham);
                      } else {
                        addToFavorite(product.maSanPham);
                      }
                    }}
                    className="absolute top-2 left-2 bg-white p-2 rounded-full shadow hover:bg-red-100 z-10"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isFavorite
                          ? "text-red-600 fill-red-600"
                          : "text-gray-400"
                      }`}
                    />
                  </button>

                  <p className="font-bold mt-2 truncate whitespace-nowrap overflow-hidden">
                    {product.tensp}
                  </p>
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
        </>
      )}
    </div>
  );
};

export default FavoritePage;
