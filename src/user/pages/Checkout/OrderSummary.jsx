import React from "react";

const OrderSummary = ({ cart, totalPrice, shippingFee }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 sticky top-20 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <svg
            className="w-6 h-6 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          Tổng Quan Đơn Hàng
        </h2>
      </div>
      <div className="p-6">
        <div className="space-y-4 mb-6">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-gray-500 font-medium">Giỏ hàng trống</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-lg font-bold text-blue-600">
                    {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Tổng phụ:</span>
            <span className="font-semibold">
              {totalPrice.toLocaleString("vi-VN")} đ
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200">
            <span className="text-gray-600">Vận chuyển:</span>
            <span className="font-semibold text-blue-600">
              {shippingFee.toLocaleString("vi-VN")} đ
            </span>
          </div>
          <div className="flex justify-between items-center py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4">
            <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
            <span className="text-2xl font-bold text-blue-600">
              {(totalPrice + shippingFee).toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>
        <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-center space-x-2 text-green-700">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-sm font-medium">Thanh toán bảo mật SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;