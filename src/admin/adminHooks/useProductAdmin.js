import { useState, useEffect } from 'react';
import axiosAdmin from '../utils/axiosAdmin';
import { uploadMultipleImages } from '../../user/utils/cloudinary'; // Adjust path based on your project structure
import { useNavigate } from 'react-router-dom';

const useProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0); // bắt đầu từ 0
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // State cho form tạo sản phẩm
  const [tenSanPham, setTenSanPham] = useState('');
  const [giaGoc, setGiaGoc] = useState(0);
  const [moTa, setMoTa] = useState('');
  const [hinhAnhSanPham, setHinhAnhSanPham] = useState([]);
  const [details, setDetails] = useState([
    { maKichCo: '', maMau: '', hinhAnh: [], giaThem: 0, tonKho: 0 },
  ]);
  const [success, setSuccess] = useState(null);

  const fetchProducts = async (currentPage = 0) => {
    try {
      setLoading(true);
      const res = await axiosAdmin.get(`/api/products?page=${currentPage}`);
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number); // cập nhật lại page hiện tại
      setError(null);
    } catch (err) {
      setError(err.message || 'Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axiosAdmin.delete(`/api/products/${id}`);
      fetchProducts(page);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Lỗi khi xóa sản phẩm';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chọn nhiều ảnh cho sản phẩm
  const handleProductImageChange = async (e) => {
    const files = e.target.files;
    const urls = await uploadMultipleImages(files, setUploading, setError);
    setHinhAnhSanPham([...hinhAnhSanPham, ...urls]);
  };

  // Xử lý chọn nhiều ảnh cho chi tiết sản phẩm
  const handleDetailImageChange = async (index, e) => {
    const files = e.target.files;
    const urls = await uploadMultipleImages(files, setUploading, setError);
    const updatedDetails = [...details];
    updatedDetails[index].hinhAnh = [...updatedDetails[index].hinhAnh, ...urls];
    setDetails(updatedDetails);
  };

  // Xóa ảnh khỏi sản phẩm
  const removeProductImage = (index) => {
    setHinhAnhSanPham(hinhAnhSanPham.filter((_, i) => i !== index));
  };

  // Xóa ảnh khỏi chi tiết sản phẩm
  const removeDetailImage = (detailIndex, imageIndex) => {
    const updatedDetails = [...details];
    updatedDetails[detailIndex].hinhAnh = updatedDetails[detailIndex].hinhAnh.filter(
      (_, i) => i !== imageIndex
    );
    setDetails(updatedDetails);
  };

  const handleAddDetail = () => {
    setDetails([...details, { maKichCo: '', maMau: '', hinhAnh: [], giaThem: 0, tonKho: 0 }]);
  };

  const handleRemoveDetail = (index) => {
    if (details.length > 1) {
      setDetails(details.filter((_, i) => i !== index));
    }
  };

  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...details];
    updatedDetails[index][field] = value;
    setDetails(updatedDetails);
  };

  const handleSubmit = async (e, maDanhMuc) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      sanPham: {
        tensp: tenSanPham,
        hinhAnh: hinhAnhSanPham,
        giaGoc: parseFloat(giaGoc),
        moTa: moTa,
        danhMuc: { maDanhMuc: parseInt(maDanhMuc) || 0 },
        khuyenMai: null,
      },
      chiTietSanPhamDTOs: details.map((d) => ({
        maKichCo: parseInt(d.maKichCo) || 0,
        maMau: parseInt(d.maMau) || 0,
        hinhAnh: d.hinhAnh,
        giaThem: parseFloat(d.giaThem) || 0,
        tonKho: parseInt(d.tonKho) || 0,
      })),
    };

    try {
      await axiosAdmin.post('/api/products/with-details', payload);
      setSuccess('Thêm sản phẩm thành công!');
      setTenSanPham('');
      setGiaGoc(0);
      setMoTa('');
      setHinhAnhSanPham([]);
      setDetails([{ maKichCo: '', maMau: '', hinhAnh: [], giaThem: 0, tonKho: 0 }]);
      navigate('/product');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi thêm sản phẩm');
    }
  };

  const resetForm = () => {
    setTenSanPham('');
    setGiaGoc(0);
    setMoTa('');
    setHinhAnhSanPham([]);
    setDetails([{ maKichCo: '', maMau: '', hinhAnh: [], giaThem: 0, tonKho: 0 }]);
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const goToPage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  return {
    products,
    page,
    totalPages,
    loading,
    error,
    uploading,
    tenSanPham,
    setTenSanPham,
    giaGoc,
    setGiaGoc,
    moTa,
    setMoTa,
    hinhAnhSanPham,
    details,
    success,
    goToPage,
    deleteProduct,
    handleProductImageChange,
    handleDetailImageChange,
    removeProductImage,
    removeDetailImage,
    handleAddDetail,
    handleRemoveDetail,
    handleDetailChange,
    handleSubmit,
    resetForm,
  };
};

export default useProductAdmin;