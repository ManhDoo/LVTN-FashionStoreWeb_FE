import React, { useState, useRef } from 'react';
import axios from '../utils/axios';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  
  const otpRefs = useRef([]);

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace in OTP
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Original API call - Send OTP
  const handleSendOtp = async () => {
    try {
      await axios.post('/api/auth/send-otp', null, {
        params: { email },
      });
      setShowOtpPopup(true);
      setStep(2);
      setMessage('OTP đã được gửi đến email');
    } catch (error) {
      setMessage('Không thể gửi OTP: ' + error.response?.data || error.message);
    }
  };

  // Verify OTP and move to password step
  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setMessage('Vui lòng nhập đủ 6 số');
      return;
    }
    
    // Store OTP for later use in password reset
    setShowOtpPopup(false);
    setStep(3);
    setMessage('');
  };

  // Original API call - Reset Password
  const handleResetPassword = async () => {
    try {
      const otpCode = otp.join('');
      await axios.post('/api/auth/reset-password', null, {
        params: {
          email,
          otp: otpCode,
          newPassword,
        },
      });
      setMessage('Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập lại.');
      setStep(4);
    } catch (error) {
      setMessage('Lỗi: ' + error.response?.data || error.message);
    }
  };

  // Close popup and reset
  const handleClosePopup = () => {
    setShowOtpPopup(false);
    setStep(1);
    setOtp(['', '', '', '', '', '']);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2m0 0V7a2 2 0 012-2h4a2 2 0 012 2v2M9 12h6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Quên mật khẩu</h2>
          <p className="text-gray-600 mt-2">
            {step === 1 && "Nhập email để nhận mã xác thực"}
            {step === 3 && "Đặt mật khẩu mới"}
            {step === 4 && "Hoàn tất"}
          </p>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                placeholder="Nhập địa chỉ email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
            </div>
            <button
              onClick={handleSendOtp}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
            >
              Gửi mã OTP
            </button>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
              />
            </div>
            <button
              onClick={handleResetPassword}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
            >
              Đặt lại mật khẩu
            </button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Thành công!</h3>
            <p className="text-gray-600">Mật khẩu của bạn đã được đặt lại thành công.</p>
            <a 
              href="/login" 
              className="inline-block w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium text-center"
            >
              Đăng nhập ngay
            </a>
          </div>
        )}

        {/* Error/Success Message */}
        {message && step !== 4 && (
          <div className={`mt-4 p-3 rounded-lg ${message.includes('thành công') || message.includes('đã được gửi') 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm text-center ${message.includes('thành công') || message.includes('đã được gửi')
              ? 'text-green-600'
              : 'text-red-600'
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Back to login link */}
        {step !== 4 && (
          <div className="mt-6 text-center">
            <a href="/login" className="text-sm text-indigo-600 hover:text-indigo-800 transition duration-200">
              ← Quay lại đăng nhập
            </a>
          </div>
        )}
      </div>

      {/* OTP Popup */}
      {showOtpPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md mx-4 relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Nhập mã OTP</h3>
              <p className="text-gray-600 mt-2">
                Chúng tôi đã gửi mã 6 số đến
                <br />
                <span className="font-medium text-indigo-600">{email}</span>
              </p>
            </div>

            <div className="flex justify-center space-x-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition duration-200"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium mb-4"
            >
              Xác thực OTP
            </button>

            {message && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{message}</p>
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Không nhận được mã?{' '}
                <button
                  onClick={handleSendOtp}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Gửi lại
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;