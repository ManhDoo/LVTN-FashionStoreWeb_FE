import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VNPayReturnPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status");
  const orderId = queryParams.get("orderId");
  const message = queryParams.get("message");

  useEffect(() => {
        
    if (status === "success" && orderId) {
      navigate(`/payment-success?orderId=${orderId}`);
    }
    if (status === "failure") {
      navigate(`/payment-failure?orderId=${orderId}`);
    }
    console.log("status: ", status);
  }, [status, orderId, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <svg
                className="animate-spin h-12 w-12 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Đang xử lý thanh toán...
            </h2>
            <p className="text-gray-600">
              Vui lòng chờ trong giây lát.
            </p>
          </>
        )}

        {status === "failure" && (
          <>
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Thanh toán thất bại!
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate("/checkout")}
              className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
            >
              Thử lại
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VNPayReturnPage;