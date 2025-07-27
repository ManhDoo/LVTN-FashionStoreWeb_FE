import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../hooks/useAuthStore";
import { getCart } from "../../utils/cartStorage";
import useOrderStore from "../../hooks/useOrderStore";
import usePaymentMethods from "../../hooks/usePaymentMethod";
import useGHNLocationStore from "../../hooks/useGHNLocationStore";
import { calculateShippingFee } from "../../hooks/calculateShippingFee";
import AccountSection from "./AccountSection";
import DeliveryOptions from "./DeliveryOptions";
import ShippingInfo from "./ShippingInfo";
import PaymentMethodSection from "./PaymentMethodSection";
import OrderSummary from "./OrderSummary";

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
  const [paymentMethod, setPaymentMethod] = useState(null); // Khởi tạo null để tránh giá trị mặc định không hợp lệ
  const [cart, setCart] = useState([]);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [provinceName, setProvinceName] = useState("");
    const [districtName, setDistrictName] = useState("");
    const [wardName, setWardName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("me");
  const [shippingFee, setShippingFee] = useState(0);

  // Lọc paymentMethods để loại bỏ COD khi không xác thực
  const filteredPaymentMethods = paymentMethods.filter(
    (method) => isAuthenticated || method.tenPhuongThuc.toLowerCase() !== "cod"
  );

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

  // Chỉ đặt paymentMethod mặc định khi filteredPaymentMethods thay đổi và chưa có lựa chọn
  useEffect(() => {
    if (filteredPaymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(filteredPaymentMethods[0].maPTThanhToan);
    }
  }, [filteredPaymentMethods, paymentMethod]);

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
    // (Các logic prefill khác giữ nguyên như trước)

    const province = provinces.find((p) => p.ProvinceName === user.tinh);
    if (province) setSelectedProvince(province.ProvinceID);

    const district = districts.find((d) => d.DistrictName === user.huyen);
    if (district) setSelectedDistrict(district.DistrictID);

    const ward = wards.find((w) => w.WardName === user.xa);
    if (ward) setSelectedWard(ward.WardCode);
  };

  const handleDeliveryOptionChange = (option) => {
    setDeliveryOption(option);

    if (option === "other" && isAuthenticated && user) {
      setName("");
      setAddress("");
      setPhone("");
      setPhoneError("");
      setSelectedProvince("");
      setSelectedDistrict("");
      setSelectedWard("");
    } else if (option === "me" && isAuthenticated && user) {
      prefillUserInfo();
    }
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    if (!phoneRegex.test(phone) || /^0+$/.test(phone)) {
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
    (sum, item) => sum + item.price * item.quantity,
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
      const selectedPaymentMethod = filteredPaymentMethods.find(
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Thanh Toán</h1>
          <p className="text-gray-600">Hoàn tất đơn hàng của bạn</p>
        </div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AccountSection email={email} setEmail={setEmail} />
            <DeliveryOptions
              isAuthenticated={isAuthenticated}
              deliveryOption={deliveryOption}
              handleDeliveryOptionChange={handleDeliveryOptionChange}
            />
            <ShippingInfo
              name={name}
              setName={setName}
              phone={phone}
              handlePhoneChange={handlePhoneChange}
              phoneError={phoneError}
              selectedProvince={selectedProvince}
              handleProvinceChange={handleProvinceChange}
              provinces={provinces}
              selectedDistrict={selectedDistrict}
              handleDistrictChange={handleDistrictChange}
              districts={districts}
              selectedWard={selectedWard}
              handleWardChange={handleWardChange}
              wards={wards}
              address={address}
              setAddress={setAddress}
            />
            <PaymentMethodSection
              loading={loading}
              error={error}
              paymentMethods={filteredPaymentMethods}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              getPaymentIcon={getPaymentIcon}
              getPaymentDescription={getPaymentDescription}
            />
            <button
              className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                isPlacingOrder ||
                !name ||
                !address ||
                !phone ||
                !selectedProvince ||
                !selectedDistrict ||
                !selectedWard ||
                !paymentMethod
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
                !selectedWard ||
                !paymentMethod
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
          <div className="lg:col-span-1">
            <OrderSummary cart={cart} totalPrice={totalPrice} shippingFee={shippingFee} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;