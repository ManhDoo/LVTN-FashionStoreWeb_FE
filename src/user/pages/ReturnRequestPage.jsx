import React from 'react';
import useReturnRequests from '../hooks/useReturnRequests';

const ReturnPage = () => {
  const {
    orderDetail,
    selectedReason,
    setSelectedReason,
    description,
    setDescription,
    selectedFiles,
    previewUrls,
    uploading,
    uploadError,
    submitting,
    reasons,
    loadingReasons,
    phuongAn,
    setPhuongAn,
    phiShip,
    setShip,
    phiDoiTra,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
  } = useReturnRequests();

  // Define available options based on selected reason
  const phuongAnOptions = selectedReason === 'KHONG_CON_NHU_CAU'
    ? ['Hoàn tiền và trả hàng']
    : ['Hoàn tiền và trả hàng', 'Đổi hàng'];

  // Format phiDoiTra for display
  const returnFeeText = phiDoiTra === 0 ? 'Miễn phí' : phiDoiTra.toLocaleString('vi-VN') + 'đ';

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
          <strong>Tổng tiền:</strong>{' '}
          {(orderDetail.donGia * orderDetail.soLuong).toLocaleString()}đ
        </p>
        {selectedReason && (
          <p>
            <strong>Phí hoàn trả:</strong> {returnFeeText}
          </p>
        )}
      </div>

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
                setPhuongAn('Hoàn tiền và trả hàng'); // Default to this option
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
          <select
            className="w-full border rounded px-3 py-2"
            value={phuongAn}
            onChange={(e) => setPhuongAn(e.target.value)}
            disabled={!selectedReason}
          >
            <option value="">Chọn phương án</option>
            {phuongAnOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
          <label className="font-semibold">Hình ảnh minh họa (tối đa 4 ảnh):</label>
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
          {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={uploading || !selectedReason || !phuongAn}
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