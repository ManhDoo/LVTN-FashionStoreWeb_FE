import React, { useState, useEffect } from 'react';
import { getCart, removeFromCart, updateQuantity } from '../utils/cartStorage';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState(new Set());

  useEffect(() => {
    setTimeout(() => {
      const savedCart = getCart();
      // Cập nhật giá nếu khuyến mãi hết hạn
      const updatedCart = savedCart.map(item => {
        const currentDate = new Date();
        const isPromotionValid = item.khuyenMai && new Date(item.khuyenMai.ngayKetThuc) > currentDate;
        // Đảm bảo giá luôn có giá trị hợp lệ
        const price = item.price || 0;
        const originalPrice = item.originalPrice || price; // Nếu originalPrice không tồn tại, dùng price
        return {
          ...item,
          displayPrice: isPromotionValid ? price : originalPrice,
        };
      });
      setCart(updatedCart);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleCheckoutClick = () => {
    navigate('/checkout');
  };

  const handleRemove = (id, color, size) => {
    const itemKey = `${id}-${color}-${size}`;
    setRemovingItems(prev => new Set([...prev, itemKey]));
    
    setTimeout(() => {
      removeFromCart(id, color, size);
      const updatedCart = getCart().map(item => {
        const currentDate = new Date();
        const isPromotionValid = item.khuyenMai && new Date(item.khuyenMai.ngayKetThuc) > currentDate;
        const price = item.price || 0;
        const originalPrice = item.originalPrice || price;
        return {
          ...item,
          displayPrice: isPromotionValid ? price : originalPrice,
        };
      });
      setCart(updatedCart);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }, 300);
  };

  const handleQuantityChange = (index, action) => {
    const newQuantity = cart[index].quantity + (action === 'decrease' ? -1 : 1);
    if (newQuantity > 0) {
      updateQuantity(index, newQuantity);
      const updatedCart = getCart().map(item => {
        const currentDate = new Date();
        const isPromotionValid = item.khuyenMai && new Date(item.khuyenMai.ngayKetThuc) > currentDate;
        const price = item.price || 0;
        const originalPrice = item.originalPrice || price;
        return {
          ...item,
          displayPrice: isPromotionValid ? price : originalPrice,
        };
      });
      setCart(updatedCart);
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.displayPrice || 0) * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animate-reverse"></div>
          </div>
          <p className="text-gray-600 font-medium">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Giỏ Hàng Của Bạn
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full"></div>
          {cart.length > 0 && (
            <p className="mt-4 text-gray-600">
              Bạn có <span className="font-semibold text-pink-600">{totalItems}</span> sản phẩm trong giỏ hàng
            </p>
          )}
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v4a2 2 0 01-2 2H9a2 2 0 01-2-2v-4m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Giỏ hàng trống</h2>
              <p className="text-gray-500 mb-8">Hãy thêm những sản phẩm yêu thích vào giỏ hàng nhé!</p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        ) : (
          /* Cart Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item, index) => {
                const itemKey = `${item.id}-${item.color}-${item.size}`;
                const isRemoving = removingItems.has(itemKey);
                const isPromotionValid = item.khuyenMai && new Date(item.khuyenMai.ngayKetThuc) > new Date();

                return (
                  <div
                    key={itemKey}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-pink-100 transition-all duration-300 ${
                      isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-xl hover:scale-[1.02]'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                      {/* Product Image */}
                      <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-100">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                          {isPromotionValid && (
                            <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                              Giảm {item.khuyenMai?.giaTriGiam || 0}%
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 mb-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-700">
                            <div className="w-2 h-2 rounded-full bg-pink-500 mr-2"></div>
                            {item.color}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            Size: {item.size}
                          </span>
                        </div>
                        {isPromotionValid ? (
                          <div className="flex items-center">
                            <p className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                              {(item.displayPrice || 0).toLocaleString('vi-VN')} VND
                            </p>
                            {item.originalPrice && (
                              <p className="text-gray-500 line-through ml-2">
                                {(item.originalPrice || 0).toLocaleString('vi-VN')} VND
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                            {(item.displayPrice || 0).toLocaleString('vi-VN')} VND
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between md:flex-col md:items-end space-y-4">
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-full p-1">
                          <button
                            onClick={() => handleQuantityChange(index, 'decrease')}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="text-lg font-semibold text-gray-800 min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(index, 'increase')}
                            className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id, item.color, item.size)}
                          disabled={isRemoving}
                          className="flex items-center space-x-2 px-4 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 disabled:opacity-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="text-sm font-medium">Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-pink-100 sticky top-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Tóm tắt đơn hàng
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Số lượng sản phẩm:</span>
                    <span className="font-semibold">{totalItems}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span className="font-semibold">{totalPrice.toLocaleString('vi-VN')} VND</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Tổng cộng:</span>
                      <span className="text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        {totalPrice.toLocaleString('vi-VN')} VND
                      </span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleCheckoutClick}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 px-6 rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>THANH TOÁN</span>
                </button>

                <button 
                  onClick={() => navigate('/')}
                  className="w-full mt-4 border-2 border-pink-200 text-pink-600 font-semibold py-3 px-6 rounded-full hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  <span>Tiếp tục mua sắm</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;