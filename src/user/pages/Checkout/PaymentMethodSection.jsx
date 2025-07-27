import React from "react";

const PaymentMethodSection = ({
  loading,
  error,
  paymentMethods,
  paymentMethod,
  setPaymentMethod,
  getPaymentIcon,
  getPaymentDescription,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
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
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          Phương Thức Thanh Toán
        </h2>
      </div>
      <div className="p-6 space-y-4">
        {loading ? (
          <div className="text-center">Đang tải phương thức thanh toán...</div>
        ) : error ? (
          <div className="text-center text-red-500">Lỗi: {error}</div>
        ) : paymentMethods.length === 0 ? (
          <div className="text-center">Không có phương thức thanh toán nào</div>
        ) : (
          paymentMethods.map((method) => (
            <label
              key={method.maPTThanhToan}
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                paymentMethod === method.maPTThanhToan
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="pttt"
                value={method.maPTThanhToan}
                checked={paymentMethod === method.maPTThanhToan}
                onChange={() => setPaymentMethod(method.maPTThanhToan)}
                className="sr-only"
              />
              <div
                className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  paymentMethod === method.maPTThanhToan
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {paymentMethod === method.maPTThanhToan && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </div>
              <div className="flex items-center">
                <div className="bg-gray-100 p-2 rounded-lg mr-3">
                  {getPaymentIcon(method.tenPhuongThuc)}
                </div>
                <div>
                  <span className="font-medium text-gray-800">
                    {method.tenPhuongThuc}
                  </span>
                  <p className="text-sm text-gray-500">
                    {getPaymentDescription(method.tenPhuongThuc)}
                  </p>
                </div>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentMethodSection;