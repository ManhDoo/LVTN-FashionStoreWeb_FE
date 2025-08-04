import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { slugify } from "../utils/slugify";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
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
    const scrollAmount = window.innerWidth < 640 ? 200 : 300;
    scrollRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const scrollRight = () => {
    const scrollAmount = window.innerWidth < 640 ? 200 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Sản phẩm yêu thích
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Bạn chưa có sản phẩm yêu thích nào.</p>
            <p className="text-gray-400 text-sm mt-2">Hãy thêm những sản phẩm bạn yêu thích vào danh sách này!</p>
          </div>
        </div>
      ) : (
        <div className="relative px-4 sm:px-6 lg:px-8">
          {/* Scroll Buttons - Hidden on mobile */}
          <button
            onClick={scrollLeft}
            className="hidden sm:flex absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl p-3 rounded-full z-10 transition-all duration-200 hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={scrollRight}
            className="hidden sm:flex absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg hover:shadow-xl p-3 rounded-full z-10 transition-all duration-200 hover:bg-gray-50"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          {/* Product List - Responsive Grid/Scroll */}
          <div className="block sm:hidden">
            {/* Mobile: Vertical Grid */}
            <div className="grid grid-cols-1 gap-6">
              {products.map((product) => {
                const discountedPrice = calculateDiscountedPrice(product);
                const isFavorite = favoriteIds.includes(product.maSanPham);

                return (
                  <div
                    key={product.maSanPham}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className="flex">
                      {/* Product Image */}
                      <div 
                        className="w-32 h-32 relative cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/product/${slugify(product.tensp)}-${product.maSanPham}`
                          )
                        }
                      >
                        <img
                          src={product.hinhAnh[0]}
                          alt={product.tensp}
                          className="w-full h-full object-cover"
                        />
                        {product.khuyenMai &&
                          product.khuyenMai.giaTriGiam > 0 &&
                          product.khuyenMai.trangThai !== "Đã kết thúc" && (
                            <span className="absolute top-1 right-1 bg-red-600 text-white px-1.5 py-0.5 rounded-full text-xs">
                              -{product.khuyenMai.giaTriGiam}
                              {product.khuyenMai.hinhThucGiam === "Phần trăm" ? "%" : "K"}
                            </span>
                          )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product.tensp}
                          </h3>
                          <div className="flex flex-col">
                            {discountedPrice ? (
                              <>
                                <p className="text-red-600 text-lg font-bold">
                                  {discountedPrice.toLocaleString("vi-VN")} VND
                                </p>
                                <p className="text-gray-500 line-through text-sm">
                                  {product.giaGoc.toLocaleString("vi-VN")} VND
                                </p>
                              </>
                            ) : (
                              <p className="text-red-600 text-lg font-bold">
                                {product.giaGoc.toLocaleString("vi-VN")} VND
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Favorite Button */}
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isFavorite) {
                                removeFromFavorite(product.maSanPham);
                              } else {
                                addToFavorite(product.maSanPham);
                              }
                            }}
                            className="bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-colors duration-200"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                isFavorite
                                  ? "text-red-600 fill-red-600"
                                  : "text-gray-400"
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tablet & Desktop: Horizontal Scroll */}
          <div className="hidden sm:block">
            <div
              ref={scrollRef}
              className="flex overflow-x-auto space-x-4 lg:space-x-6 scroll-smooth scrollbar-hide pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {products.map((product) => {
                const discountedPrice = calculateDiscountedPrice(product);
                const isFavorite = favoriteIds.includes(product.maSanPham);

                return (
                  <div
                    key={product.maSanPham}
                    className="min-w-[200px] sm:min-w-[240px] lg:min-w-[280px] cursor-pointer relative group flex-shrink-0"
                  >
                    <div
                      onClick={() =>
                        navigate(
                          `/product/${slugify(product.tensp)}-${product.maSanPham}`
                        )
                      }
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
                    >
                      <div className="relative">
                        <div className="aspect-[3/4] bg-gray-100">
                          <img
                            src={product.hinhAnh[0]}
                            alt={product.tensp}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        {product.khuyenMai &&
                          product.khuyenMai.giaTriGiam > 0 &&
                          product.khuyenMai.trangThai !== "Đã kết thúc" && (
                            <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm font-medium">
                              -{product.khuyenMai.giaTriGiam}
                              {product.khuyenMai.hinhThucGiam === "Phần trăm" ? "%" : "K"}
                            </span>
                          )}

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isFavorite) {
                              removeFromFavorite(product.maSanPham);
                            } else {
                              addToFavorite(product.maSanPham);
                            }
                          }}
                          className="absolute top-2 left-2 bg-white hover:bg-red-50 p-2 rounded-full shadow-sm transition-colors duration-200"
                        >
                          <Heart
                            className={`w-4 h-4 lg:w-5 lg:h-5 ${
                              isFavorite
                                ? "text-red-600 fill-red-600"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="p-3 lg:p-4">
                        <h3 className="font-semibold text-sm lg:text-base text-gray-900 mb-2 line-clamp-2">
                          {product.tensp}
                        </h3>
                        <div className="flex flex-col space-y-1">
                          {discountedPrice ? (
                            <>
                              <p className="text-red-600 text-base lg:text-lg font-bold">
                                {discountedPrice.toLocaleString("vi-VN")} VND
                              </p>
                              <p className="text-gray-500 line-through text-sm">
                                {product.giaGoc.toLocaleString("vi-VN")} VND
                              </p>
                            </>
                          ) : (
                            <p className="text-red-600 text-base lg:text-lg font-bold">
                              {product.giaGoc.toLocaleString("vi-VN")} VND
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritePage;