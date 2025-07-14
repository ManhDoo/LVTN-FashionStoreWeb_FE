import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { XCircle, RotateCcw, Home } from "lucide-react";

const PaymentFailurePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const message = queryParams.get("message") || "Thanh toán thất bại. Vui lòng thử lại.";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-pink-100 to-rose-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="mb-6">
          <XCircle className="w-16 h-16 text-red-600 mx-auto animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-red-600 mb-4">Thanh toán thất bại!</h1>
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/checkout")}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Thử lại
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
