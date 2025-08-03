import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../hooks/useAuthStore";
import useScrollVisibility from "./ScrollVisibility";
import logo from "../../assets/images/logoStore.png";
import { getCart } from "../utils/cartStorage";
import { searchProducts } from "../hooks/useSearchProduct";
import useFavorite from "../hooks/useFavoriteItems";
import { Heart } from "lucide-react";

const Header = () => {
  const { isAuthenticated, user, logout, fetchProfile } = useAuthStore();
  const [showLogout, setShowLogout] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const popupRef = useRef();
  const navigate = useNavigate();
  const isHeaderVisible = useScrollVisibility(80);
  const { favoriteIds, addToFavorite, removeFromFavorite } = useFavorite();

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchProfile();
    }
  }, [isAuthenticated, user, fetchProfile]);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        setShowSearchPopup(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchProducts(searchTerm);
        setSearchResults(results);
        setShowSearchPopup(true);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowSearchPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = getCart();
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(totalItems);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const handleUserClick = () => {
    setShowLogout(!showLogout);
  };

  const handleLogoutClick = () => {
    logout();
    setShowLogout(false);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setShowSearchPopup(false);
  };

  return (
    <header
      className={`fixed bg-white w-full top-0 z-[9999] transition-transform duration-300 ${
        isHeaderVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo Section */}
          <div className="flex items-center">
            <div className="relative group">
              <img
                src={logo}
                alt="Fashion Store Logo"
                className="h-12 w-auto cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={() => navigate("/")}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
            </div>
          </div>

          {/* Search Section */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <div
              className={`relative transition-all duration-300 ${
                isSearchFocused ? "transform scale-105" : ""
              }`}
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Tìm kiếm sản phẩm yêu thích..."
                className={`w-full p-4 pl-6 pr-14 border-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-200 focus:border-pink-300 hover:shadow-xl ${
                  isSearchFocused
                    ? "border-pink-300 bg-white"
                    : "border-gray-200"
                }`}
              />
              <div
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                  isSearchFocused
                    ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white"
                    : "text-gray-400 hover:text-pink-500"
                }`}
              >
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65l4.35 4.35z"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - User & Cart */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={handleUserClick}
                >
                  <div className="p-1 bg-white/20 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">
                    {user.hoTen || "User"}
                  </span>
                </button>
                {showLogout && (
                  <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-[9999] animate-in slide-in-from-top-2 duration-200 w-50">
                    <button
                      className="w-full px-6 py-3 text-left text-blue-600 hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2"
                      onClick={() => {
                        navigate("/profile");
                        setShowLogout(false);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Thông tin cá nhân</span>
                    </button>
                    <button
                      className="w-full px-6 py-3 text-left text-blue-600 hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2"
                      onClick={() => {
                        navigate("/orders");
                        setShowLogout(false);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7h18M3 12h18M3 17h18"
                        />
                      </svg>
                      <span>Đơn hàng</span>
                    </button>
                    <button
                      className="w-full px-6 py-3 text-left text-blue-600 hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2"
                      onClick={() => {
                        navigate("/list-return");
                        setShowLogout(false);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10v4m0 0l4-4m-4 4l4 4M17 10a4 4 0 00-4-4H7"
                        />
                      </svg>
                      <span>Yêu cầu hoàn trả</span>
                    </button>
                    <button
                      className="w-full px-6 py-3 text-left text-blue-600 hover:bg-blue-50 transition-colors duration-200 flex items-center space-x-2"
                      onClick={() => {
                        navigate("/favorite");
                        setShowLogout(false);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.174 3.617a1 1 0 00.95.69h3.801c.969 0 1.371 1.24.588 1.81l-3.073 2.234a1 1 0 00-.364 1.118l1.174 3.617c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.073 2.234c-.784.57-1.838-.197-1.539-1.118l1.174-3.617a1 1 0 00-.364-1.118L3.125 9.044c-.783-.57-.38-1.81.588-1.81h3.801a1 1 0 00.95-.69l1.174-3.617z" />
                      </svg>
                      <span>Sản phẩm yêu thích</span>
                    </button>
                    <button
                      className="w-full px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center space-x-2"
                      onClick={handleLogoutClick}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => navigate("/login")}
              >
                <div className="p-1 bg-white/20 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium">Đăng nhập</span>
              </button>
            )}
            <button
              className="relative flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => navigate("/cart")}
            >
              <div className="p-1 bg-white/20 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2-2v4.01"
                  />
                </svg>
              </div>
              <span className="text-sm font-medium">Giỏ hàng</span>
              {cartItemCount > 0 && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-800 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                  {cartItemCount}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results Popup - Fullscreen */}
      {showSearchPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center pt-20">
          <div
            ref={popupRef}
            className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl w-full max-w-7xl mx-4 max-h-[80vh] overflow-hidden border border-pink-100 animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-pink-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65l4.35 4.35z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Kết quả tìm kiếm
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tìm thấy {searchResults.length} sản phẩm cho "{searchTerm}"
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSearchPopup(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-400 group-hover:text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(80vh-80px)] p-6">
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {searchResults.map((product) => {
                    const isFavorite = favoriteIds.includes(product.maSanPham);
                    return (
                      <div
                        key={product.maSanPham}
                        className="group cursor-pointer bg-white/80 backdrop-blur-sm rounded-xl p-4 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-pink-200 hover:bg-white"
                      >
                        <div className="relative overflow-hidden rounded-lg mb-3">
                          <img
                            src={product.hinhAnh[0]}
                            alt={product.tensp}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                            onClick={() => handleProductClick(product.maSanPham)}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isFavorite) {
                                removeFromFavorite(product.maSanPham);
                              } else {
                                addToFavorite(product.maSanPham);
                              }
                            }}
                            className="absolute top-2 left-2 bg-white p-2 rounded-full shadow hover:bg-red-100 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <Heart
                              className={`w-5 h-5 ${
                                isFavorite ? "text-red-600 fill-red-600" : "text-gray-400"
                              }`}
                            />
                          </button>
                        </div>
                        <h3
                          className="font-semibold text-sm text-gray-800 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300 mb-2"
                          onClick={() => handleProductClick(product.maSanPham)}
                        >
                          {product.tensp}
                        </h3>
                        <p className="text-pink-600 font-bold text-sm">
                          {product.giaGoc.toLocaleString("vi-VN")} VND
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65l4.35 4.35z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Không tìm thấy sản phẩm nào
                  </h3>
                  <p className="text-gray-500">Thử tìm kiếm với từ khóa khác</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;