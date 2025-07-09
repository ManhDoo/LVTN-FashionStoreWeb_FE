import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, ArrowRight, Home, RotateCcw } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  // Mock logic - trong thực tế thay bằng logic gốc
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Change to "success" or "error" to see different states
      setStatus("success");
      setMessage("Giao dịch đã được xử lý thành công. Mã giao dịch: VNP123456789");
    }, 2000);
  }, []);

  // Countdown for success state
  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // navigate("/") - uncomment in real implementation
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [status]);

  const getStatusConfig = () => {
    switch (status) {
      case "loading":
        return {
          icon: Clock,
          title: "Đang xử lý thanh toán...",
          subtitle: "Vui lòng chờ trong giây lát",
          bgGradient: "from-blue-500 to-purple-600",
          cardBg: "bg-white/90 backdrop-blur-sm",
          iconColor: "text-blue-600",
          titleColor: "text-gray-800",
          animation: "animate-pulse"
        };
      case "success":
        return {
          icon: CheckCircle,
          title: "Thanh toán thành công!",
          subtitle: `Bạn sẽ được chuyển về trang chủ trong ${countdown} giây...`,
          bgGradient: "from-emerald-400 via-green-500 to-teal-600",
          cardBg: "bg-white/95 backdrop-blur-md",
          iconColor: "text-emerald-600",
          titleColor: "text-emerald-700",
          animation: "animate-bounce"
        };
      case "error":
        return {
          icon: XCircle,
          title: "Thanh toán thất bại!",
          subtitle: "Đã xảy ra lỗi trong quá trình thanh toán",
          bgGradient: "from-red-400 via-pink-500 to-rose-600",
          cardBg: "bg-white/95 backdrop-blur-md",
          iconColor: "text-red-600",
          titleColor: "text-red-700",
          animation: "animate-pulse"
        };
      default:
        return {};
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;


  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles for success state */}
      {status === "success" && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      )}

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`${config.cardBg} rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full text-center border border-white/20 transform transition-all duration-500 hover:scale-105`}>
          
          {/* Status Icon */}
          <div className={`flex justify-center mb-8 ${config.animation}`}>
            <div className="relative">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${config.bgGradient} p-1 shadow-lg`}>
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <IconComponent className={`w-12 h-12 ${config.iconColor}`} />
                </div>
              </div>
              {status === "loading" && (
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className={`text-3xl md:text-4xl font-bold ${config.titleColor} mb-4 tracking-tight`}>
            {config.title}
          </h1>

          {/* Message */}
          {message && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
              <p className="text-gray-700 text-sm leading-relaxed">{message}</p>
            </div>
          )}

          {/* Subtitle */}
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            {config.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            {status === "success" && (
              <div className="space-y-4">
                <button
                  onClick={handleHomeClick}
                  className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 group"
                >
                  <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Về trang chủ ngay
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center justify-center gap-2 text-emerald-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Tự động chuyển hướng sau {countdown}s
                  </span>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <button
                  onClick={() => handleNavigation("/checkout")}
                  className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-2xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-3 group"
                >
                  <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Thử lại
                </button>
                
                <button
                  onClick={() => handleNavigation("/")}
                  className="w-full px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition-all duration-300 font-medium flex items-center justify-center gap-3 group"
                >
                  <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Về trang chủ
                </button>
              </div>
            )}

            {status === "loading" && (
              <div className="flex justify-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi
            </p>
          </div>

          {/* Demo Controls */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400 mb-2">Demo Controls:</p>
            <div className="flex gap-2 justify-center">
              <button 
                onClick={() => setStatus("loading")}
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded"
              >
                Loading
              </button>
              <button 
                onClick={() => setStatus("success")}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded"
              >
                Success
              </button>
              <button 
                onClick={() => setStatus("error")}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded"
              >
                Error
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;