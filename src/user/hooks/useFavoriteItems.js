import axiosInstance from "../utils/axios";
import { useEffect, useState } from "react";

const useFavorite = () => {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
const [favoriteIds, setFavoriteIds] = useState([]);
const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchFavorites = async () => {
    setLoading(true);
  try {
    const res = await axiosInstance.get("/api/favorite/list", {
      params: { page: 0 }, // hoặc truyền từ biến nếu cần
    });
    setFavoriteProducts(res.data.content);
    setFavoriteIds(res.data.content.map((p) => p.maSanPham)); // lấy ID để check yêu thích
  } catch (err) {
    console.error("Lỗi khi tải danh sách yêu thích:", err);
    setError("Không thể tải sản phẩm yêu thích");
  }finally{
    setLoading(false);
  }
};


  const addToFavorite = async (productId) => {
    try {
      await axiosInstance.post("/api/favorite/add", null, {
        params: { maSanPham: productId },
      });
      setFavoriteIds((prev) => [...prev, productId]); // cập nhật local
    } catch (error) {
      const message =
        error.response?.data?.message || "Lỗi khi thêm sản phẩm yêu thích";
    }
  };

  const removeFromFavorite = async (productId) => {
    try {
      await axiosInstance.delete("/api/favorite/remove", {
        params: { maSanPham: productId },
      });
      setFavoriteIds((prev) => prev.filter((id) => id !== productId));
    } catch (error) {
      console.error("Lỗi khi xóa yêu thích:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return { favoriteIds, addToFavorite, removeFromFavorite, favoriteProducts, loading, error };
};

export default useFavorite;
