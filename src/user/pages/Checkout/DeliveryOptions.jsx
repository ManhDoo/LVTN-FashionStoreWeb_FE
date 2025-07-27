import React from "react";

const DeliveryOptions = ({ isAuthenticated, deliveryOption, handleDeliveryOptionChange }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Tùy Chọn Giao Hàng
        </h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label
            className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              deliveryOption === "me"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            } ${!isAuthenticated ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input
              type="radio"
              name="deliveryOption"
              value="me"
              checked={deliveryOption === "me"}
              onChange={() => handleDeliveryOptionChange("me")}
              className="sr-only"
              disabled={!isAuthenticated}
            />
            <div
              className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                deliveryOption === "me" ? "border-blue-500" : "border-gray-300"
              }`}
            >
              {deliveryOption === "me" && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <div>
              <span className="font-medium text-gray-800">Gửi cho tôi</span>
              <p className="text-sm text-gray-500">Sử dụng địa chỉ tài khoản</p>
            </div>
          </label>
          <label
            className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              deliveryOption === "other"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="deliveryOption"
              value="other"
              checked={deliveryOption === "other"}
              onChange={() => handleDeliveryOptionChange("other")}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                deliveryOption === "other" ? "border-blue-500" : "border-gray-300"
              }`}
            >
              {deliveryOption === "other" && (
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              )}
            </div>
            <div>
              <span className="font-medium text-gray-800">Địa chỉ khác</span>
              <p className="text-sm text-gray-500">Nhập địa chỉ mới</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOptions;