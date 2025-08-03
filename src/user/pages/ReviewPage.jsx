import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../utils/axios";
import { uploadMultipleImages } from "../utils/cloudinary"; 

const ReviewForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const productInfo = {
    chiTietDonHangId: query.get("chiTietDonHangId"),
    maSanPham: query.get("maSanPham"),
    tenSanPham: query.get("tenSanPham"),
    hinhAnh: query.get("hinhAnh"),
    soLuong: query.get("soLuong"),
    donGia: query.get("donGia"),
    kichCo: query.get("kichCo"),
    mauSac: query.get("mauSac"),
    maDonHang: query.get("maDonHang"),
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      const uploadedUrls = await uploadMultipleImages(files, setUploading, setError);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      setError("Lỗi khi xử lý ảnh. Vui lòng thử lại.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      setError("Vui lòng chọn số sao và nhập nội dung đánh giá");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post("/api/comment", {
        chiTietDonHangId: parseInt(productInfo.chiTietDonHangId),
        soSao: rating,
        noiDung: comment,
        hinhAnh: images,
      });
      alert("Đánh giá đã được gửi thành công!");
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Đánh Giá Sản Phẩm
            </h1>
            <button
              onClick={() => navigate("/orders")}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <svg
                className="w-6 h-6"
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
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <img
              src={productInfo.hinhAnh}
              alt={productInfo.tenSanPham}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold">{productInfo.tenSanPham}</h3>
              <p className="text-sm text-gray-600">Size: {productInfo.kichCo}</p>
              <p className="text-sm text-gray-600">Màu: {productInfo.mauSac}</p>
              <p className="text-sm text-gray-600">SL: {productInfo.soLuong}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh giá sao *
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét *
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows="4"
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh (tùy chọn)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-gray-500 mt-2">Đang tải ảnh lên...</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Preview ${index}`}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || uploading || !rating || !comment}
              className={`w-full py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
                loading || uploading || !rating || !comment
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-600 to-purple-600 text-white hover:from-pink-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? (
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
                  Đang gửi...
                </div>
              ) : (
                "Gửi Đánh Giá"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;