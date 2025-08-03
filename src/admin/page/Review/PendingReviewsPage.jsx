import React, { useEffect, useState } from "react";
import axiosAdmin from "../../utils/axiosAdmin";

const PendingReviewsPage = () => {
  const [reviews, setReviews] = useState([]);

  const fetchPendingReviews = async () => {
    try {
      const response = await axiosAdmin.get("/api/comment/chua-duyet");
      setReviews(response.data);
    } catch (error) {
      console.error("Lỗi khi tải đánh giá chưa duyệt:", error);
    }
  };

  const duyetDanhGia = async (id) => {
    try {
      await axiosAdmin.put(`/api/comment/admin/duyet-danh-gia/${id}`);
      alert("Đã duyệt đánh giá!");
      fetchPendingReviews(); // Reload danh sách
    } catch (error) {
      console.error("Lỗi khi duyệt đánh giá:", error);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Danh sách đánh giá chưa duyệt</h2>

      {reviews.length === 0 ? (
        <p>Không có đánh giá nào đang chờ duyệt.</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-xl p-4 shadow-md bg-white"
            >
              <h3 className="font-semibold text-lg">{review.tenSanPham}</h3>
              <p className="text-sm text-gray-500">Màu: {review.mauSac}</p>
              <p className="mt-2">
                <strong>Khách:</strong> {review.hoTenKhachHang}
              </p>
              <p>
                <strong>Số sao:</strong> {review.soSao} ⭐
              </p>
              <p className="mt-2">
                <strong>Nội dung:</strong> {review.noiDung || "Không có"}
              </p>

              {review.hinhAnh && review.hinhAnh.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {review.hinhAnh.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`img-${index}`}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              <button
                onClick={() => duyetDanhGia(review.id)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Duyệt
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingReviewsPage;
