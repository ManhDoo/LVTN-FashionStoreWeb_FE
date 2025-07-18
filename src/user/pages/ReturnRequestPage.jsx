import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { uploadMultipleImages } from "../utils/cloudinary";
import { useNavigate, useParams } from 'react-router-dom';

const ReturnPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploadError, setUploadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [phuongAn, setPhuongAn] = useState("-");
  const navigate = useNavigate();


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4); // Giới hạn tối đa 4
    setSelectedFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };
  const handleRemoveImage = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const orderDetail = {
    maDonHang: searchParams.get("maDonHang"),
    chiTietDonHangId: searchParams.get("chiTietDonHangId"),
    maSanPham: searchParams.get("maSanPham"),
    tenSanPham: searchParams.get("tenSanPham"),
    hinhAnh: searchParams.get("hinhAnh"),
    soLuong: searchParams.get("soLuong"),
    donGia: Number(searchParams.get("donGia")),
    kichCo: searchParams.get("kichCo"),
    mauSac: searchParams.get("mauSac"),
  };

  const [reasons, setReasons] = useState([]);
  const [loadingReasons, setLoadingReasons] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/api/return-reasons")
      .then((res) => {
        setReasons(res.data);
      })
      .catch((err) => {
        console.error("Lỗi khi tải lý do đổi trả", err);
      })
      .finally(() => setLoadingReasons(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadError(null);

    try {
      // Tải ảnh lên Cloudinary
      const imageUrls = await uploadMultipleImages(
        selectedFiles,
        setUploading,
        setUploadError
      );

      const payload = {
        maDonHang: parseInt(orderDetail.maDonHang),
        loai: "HOAN_TRA",
        lyDo: selectedReason,
        items: [
          {
            chiTietDonHangId: parseInt(orderDetail.chiTietDonHangId),
            soLuong: parseInt(orderDetail.soLuong),
            lyDoChiTiet: description,
            hinhAnh: imageUrls,
          },
        ],
      };

      await axiosInstance.post("/api/returns", payload);
      alert("Gửi yêu cầu hoàn trả thành công!");
      navigate('/list-return');
    } catch (err) {
      console.error("Lỗi gửi yêu cầu:", err.response?.data || err.message);
      setUploadError("Không thể gửi yêu cầu hoàn trả.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">Yêu cầu hoàn trả</h2>

      <div className="mb-6 border p-4 rounded bg-gray-50">
        <h3 className="text-xl font-semibold mb-2">Thông tin sản phẩm</h3>
        <img
          src={orderDetail.hinhAnh}
          alt={orderDetail.tenSanPham}
          className="w-12 h-12 object-cover rounded-lg"
        />
        <p>
          <strong>Sản phẩm:</strong> {orderDetail.tenSanPham}
        </p>
        <p>
          <strong>Màu sắc:</strong> {orderDetail.mauSac}
        </p>
        <p>
          <strong>Kích cỡ:</strong> {orderDetail.kichCo}
        </p>
        <p>
          <strong>Đơn giá:</strong> {orderDetail.donGia.toLocaleString()}đ
        </p>
        <p>
          <strong>Số lượng:</strong> {orderDetail.soLuong}
        </p>
        <p>
          <strong>Tổng tiền:</strong>{" "}
          {(orderDetail.donGia * orderDetail.soLuong).toLocaleString()}đ
        </p>
      </div>

      {/* FORM GỬI YÊU CẦU */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="font-semibold">Lý do:</label>
          {loadingReasons ? (
            <p>Đang tải lý do...</p>
          ) : (
            <select
              className="w-full border rounded px-3 py-2"
              value={selectedReason}
              onChange={(e) => {
                setSelectedReason(e.target.value);
                setPhuongAn("Hoàn tiền và trả hàng");
              }}
            >
              <option value="">Chọn lý do</option>
              {reasons.map((reason) => (
                <option key={reason.code} value={reason.code}>
                  {reason.label}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="mt-2">
  <label className="font-semibold">Phương án:</label>
  <input
    type="text"
    value={phuongAn}
    className="w-full border rounded px-3 py-2 bg-gray-100"
    readOnly
  />
</div>


        <div className="mb-4">
          <label className="font-semibold">Mô tả chi tiết:</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="font-semibold">Hình ảnh minh họa:</label>
          <div className="mb-4">
            <label className="font-semibold">
              Hình ảnh minh họa (tối đa 4 ảnh):
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block mb-2"
            />
            <div className="flex gap-3 flex-wrap">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={url}
                    alt={`preview-${index}`}
                    className="w-full h-full object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Xóa ảnh"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div className="mb-4">
          <label className="font-semibold">Email nhận phản hồi:</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            defaultValue={orderDetail.email || ""}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={uploading}
        >
          Gửi yêu cầu hoàn trả
        </button>
      </form>
      {submitting && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-white border-t-pink-500 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ReturnPage;
