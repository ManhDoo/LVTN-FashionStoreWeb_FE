import React, { useState, useEffect } from "react";
import useAuthStore from "../hooks/useAuthStore";
import { getCart } from "../utils/cartStorage";
import { useNavigate } from "react-router-dom";
import useOrderStore from "../hooks/useOrderStore";
import usePaymentMethods from "../hooks/usePaymentMethod";
import useGHNLocationStore from "../hooks/useGHNLocationStore";
import { calculateShippingFee } from "../hooks/calculateShippingFee";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, fetchProfile } = useAuthStore();
  const {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
  } = useGHNLocationStore();
  const { placeOrder, isPlacingOrder } = useOrderStore();
  const { paymentMethods, loading, error } = usePaymentMethods();
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(""); 
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("me");
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const savedCart = getCart();
    setCart(savedCart);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchProfile();
    }
  }, [isAuthenticated, user, fetchProfile]);

  useEffect(() => {
    if (isAuthenticated && user && deliveryOption === "me") {
      prefillUserInfo();
    }
  }, [isAuthenticated, user, provinces, districts, wards, deliveryOption]);

  useEffect(() => {
    if (paymentMethods.length > 0) {
      setPaymentMethod(paymentMethods[0].maPTThanhToan);
    }
  }, [paymentMethods]);

  useEffect(() => {
  const shouldCalculate =
    selectedDistrict && selectedWard && cart.length > 0;

  if (shouldCalculate) {
    calculateShippingFee(selectedDistrict, selectedWard, cart).then((fee) => {
      setShippingFee(fee);
    });
  } else {
    setShippingFee(0);
  }
}, [selectedDistrict, selectedWard, cart]);


  const prefillUserInfo = () => {
    setEmail(user.email || "");
    setName(user.hoTen || "");
    setAddress(user.duong || "");
    setPhone(user.soDienThoai || "");
    setPhoneError("");
    setProvinceName(user.tinh || "");
    setDistrictName(user.huyen || "");
    setWardName(user.xa || "");

    const province = provinces.find((p) => p.ProvinceName === user.tinh);
    if (province) {
      setSelectedProvince(province.ProvinceID);
    }

    const district = districts.find((d) => d.DistrictName === user.huyen);
    if (district) {
      setSelectedDistrict(district.DistrictID);
    }

    const ward = wards.find((w) => w.WardName === user.xa);
    if (ward) {
      setSelectedWard(ward.WardCode);
    }
  };

  const handleDeliveryOptionChange = (option) => {
    setDeliveryOption(option);

    if (option === "other" && isAuthenticated && user) {
      setName("");
      setAddress("");
      setPhone("");
      setPhoneError(""); 
      setProvinceName("");
      setDistrictName("");
      setWardName("");
      setSelectedProvince("");
      setSelectedDistrict("");
      setSelectedWard("");
    } else if (option === "me" && isAuthenticated && user) {
      prefillUserInfo();
    }
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

    if (!phoneRegex.test(phone)) {
      return "Số điện thoại không hợp lệ";
    }

    if (/^0+$/.test(phone)) {
      return "Số điện thoại không hợp lệ";
    }

    return "";
  };

  const handlePhoneChange = (e) => {
    const newPhone = e.target.value;
    setPhone(newPhone);
    setPhoneError(validatePhoneNumber(newPhone));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity + shippingFee,
    0
  );

  const handlePlaceOrder = async () => {
    const phoneValidationError = validatePhoneNumber(phone);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      alert(phoneValidationError);
      return;
    }
    if (
      !name ||
      !address ||
      !phone ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard
    ) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const orderData = {
        user: isAuthenticated ? user : null,
        name,
        phone,
        email,
        address,
        provinceName,
        districtName,
        wardName,
        cart,
        pttt: paymentMethod,
        phiGiaoHang: shippingFee,
      };

      const response = await placeOrder(orderData);
      const selectedPaymentMethod = paymentMethods.find(
        (method) => method.maPTThanhToan === paymentMethod
      );

      if (!isAuthenticated && selectedPaymentMethod.tenPhuongThuc.toLowerCase() === "cod") {
        alert("Bạn cần đăng nhập để thanh toán bằng COD!");
        return;
      }

      if (["vnpay", "momo"].includes(selectedPaymentMethod.tenPhuongThuc.toLowerCase())) {
        window.location.href = response;
      } else {  
        alert("Đơn hàng đã được đặt thành công!");
        navigate("/");
      }
    } catch (error) {
      alert(`Đặt hàng thất bại: ${error.message || "Lỗi không xác định"}`);
    }
  };

  const handleProvinceChange = (e) => {
    const id = e.target.value;
    setSelectedProvince(id);
    const province = provinces.find((p) => p.ProvinceID === parseInt(id));
    setProvinceName(province ? province.ProvinceName : "");
    
  };

  const handleDistrictChange = (e) => {
    const id = e.target.value;
    setSelectedDistrict(id);
    const district = districts.find((d) => d.DistrictID === parseInt(id));
    setDistrictName(district ? district.DistrictName : "");
  };

  const handleWardChange = (e) => {
    const code = e.target.value;
    setSelectedWard(code);
    const ward = wards.find((w) => w.WardCode === code);
    setWardName(ward ? ward.WardName : "");
    
  };

  const getPaymentIcon = (method) => {
    switch (method.toLowerCase()) {
      case "cod":
        return (
          <svg
            className="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        );
      case "momo":
        return (
          <svg
            className="w-6 h-6 text-pink-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
      case "vnpay":
        return (
          <svg
            className="w-6 h-6 text-blue-600"
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
        );
      default:
        return (
          <svg
            className="w-6 h-6 text-gray-600"
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
        );
    }
  };

  const getPaymentDescription = (method) => {
    switch (method.toLowerCase()) {
      case "cod":
        return "Thanh toán bằng tiền mặt khi nhận hàng";
      case "momo":
        return "Thanh toán nhanh chóng qua ví điện tử";
      case "vnpay":
        return "Thanh toán an toàn qua VNPAY";
      default:
        return "Phương thức thanh toán khác";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Thanh Toán</h1>
          <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Thông Tin Tài Khoản
                </h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập email của bạn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <button className="ml-4 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium">
                    Gửi hóa đơn
                  </button>
                </div>
              </div>
            </div>

            {/* Delivery Options */}
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
                    } ${
                      !isAuthenticated ? "opacity-50 cursor-not-allowed" : ""
                    }`}
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
                        deliveryOption === "me"
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {deliveryOption === "me" && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">
                        Gửi cho tôi
                      </span>
                      <p className="text-sm text-gray-500">
                        Sử dụng địa chỉ tài khoản
                      </p>
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
                        deliveryOption === "other"
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {deliveryOption === "other" && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">
                        Địa chỉ khác
                      </span>
                      <p className="text-sm text-gray-500">Nhập địa chỉ mới</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6">
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
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Thông Tin Giao Hàng
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập họ và tên"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Nhập số điện thoại"
                      value={phone}
                      onChange={handlePhoneChange}
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh/Thành phố *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                    >
                      <option value="">Chọn tỉnh/thành phố</option>
                      {provinces.map((province) => (
                        <option
                          key={province.ProvinceID}
                          value={province.ProvinceID}
                        >
                          {province.ProvinceName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quận/Huyện *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                      value={selectedDistrict}
                      onChange={handleDistrictChange}
                      disabled={!selectedProvince}
                    >
                      <option value="">Chọn quận/huyện</option>
                      {districts.map((district) => (
                        <option
                          key={district.DistrictID}
                          value={district.DistrictID}
                        >
                          {district.DistrictName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phường/Xã *
                    </label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
                      value={selectedWard}
                      onChange={handleWardChange}
                      disabled={!selectedDistrict}
                    >
                      <option value="">Chọn phường/xã</option>
                      {wards.map((ward) => (
                        <option key={ward.WardCode} value={ward.WardCode}>
                          {ward.WardName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ chi tiết *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Số nhà, tên đường..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quốc gia
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                    <option>Việt Nam</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
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
                  <div className="text-center">
                    Đang tải phương thức thanh toán...
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500">Lỗi: {error}</div>
                ) : paymentMethods.length === 0 ? (
                  <div className="text-center">
                    Không có phương thức thanh toán nào
                  </div>
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

            {/* Place Order Button */}
            <button
              className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                isPlacingOrder ||
                !name ||
                !address ||
                !phone ||
                !selectedProvince ||
                !selectedDistrict ||
                !selectedWard
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl"
              }`}
              onClick={handlePlaceOrder}
              disabled={
                isPlacingOrder ||
                !name ||
                !address ||
                !phone ||
                !selectedProvince ||
                !selectedDistrict ||
                !selectedWard
              }
            >
              {isPlacingOrder ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Đang xử lý...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  ĐẶT HÀNG NGAY
                </div>
              )}
            </button>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1 ">
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
                {/* Cart Items */}
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
                      <p className="text-gray-500 font-medium">
                        Giỏ hàng trống
                      </p>
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
                          <p className="text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                          <p className="text-lg font-bold text-blue-600">
                            {(item.price * item.quantity).toLocaleString(
                              "vi-VN"
                            )}{" "}
                            đ
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Discount Code */}
                {/* {cart.length > 0 && (
                  <div className="mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Mã giảm giá hoặc thẻ quà tặng"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      />
                      <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium">
                        Áp dụng
                      </button>
                    </div>
                  </div>
                )} */}

                {/* Order Summary */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Tổng phụ:</span>
                    <span className="font-semibold">
                      {totalPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Vận chuyển:</span>
                    <span className="font-semibold text-blue-600">{shippingFee.toLocaleString("vi-VN")} đ</span>

                  </div>
                  <div className="flex justify-between items-center py-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl px-4">
                    <span className="text-lg font-bold text-gray-800">
                      Tổng cộng:
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {(totalPrice + shippingFee).toLocaleString("vi-VN")} đ

                    </span>
                  </div>
                </div>

                {/* Security Badge */}
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
                    <span className="text-sm font-medium">
                      Thanh toán bảo mật SSL
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
