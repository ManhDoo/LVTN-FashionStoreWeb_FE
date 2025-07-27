import { useState, useEffect } from 'react';
import axiosAdmin from '../utils/axiosAdmin';
import { uploadMultipleImages } from '../../user/utils/cloudinary';
import { useNavigate } from 'react-router-dom';

const useProductAdmin = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // Product form state
  const [tenSanPham, setTenSanPham] = useState('');
  const [giaGoc, setGiaGoc] = useState(0);
  const [moTa, setMoTa] = useState('');
  const [hinhAnhSanPham, setHinhAnhSanPham] = useState([]);
  const [colorDetails, setColorDetails] = useState([
    { maMau: '', hinhAnh: [], sizes: [{ maKichCo: '', giaThem: 0, tonKho: 0 }] },
  ]);
  const [success, setSuccess] = useState(null);

  const fetchProducts = async (currentPage = 0) => {
    try {
      setLoading(true);
      const res = await axiosAdmin.get(`/api/products?page=${currentPage}`);
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
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

  const handleProductImageChange = async (e) => {
    const files = e.target.files;
    const urls = await uploadMultipleImages(files, setUploading, setError);
    setHinhAnhSanPham([...hinhAnhSanPham, ...urls]);
  };

  const removeProductImage = (index) => {
    setHinhAnhSanPham(hinhAnhSanPham.filter((_, i) => i !== index));
  };

  const handleColorDetailChange = async (colorIndex, field, value) => {
    const updatedColorDetails = [...colorDetails];
    if (field === 'hinhAnh' && value instanceof Event) {
      const files = value.target.files;
      const urls = await uploadMultipleImages(files, setUploading, setError);
      updatedColorDetails[colorIndex].hinhAnh = [...updatedColorDetails[colorIndex].hinhAnh, ...urls];
    } else if (field === 'hinhAnh') {
      updatedColorDetails[colorIndex].hinhAnh = updatedColorDetails[colorIndex].hinhAnh.filter(
        (_, i) => i !== value
      );
    } else {
      updatedColorDetails[colorIndex][field] = value;
    }
    setColorDetails(updatedColorDetails);
  };

  const handleSizeDetailChange = (colorIndex, sizeIndex, field, value) => {
    const updatedColorDetails = [...colorDetails];
    updatedColorDetails[colorIndex].sizes[sizeIndex][field] = value;
    setColorDetails(updatedColorDetails);
  };

  const addSizeToColor = (colorIndex) => {
    const updatedColorDetails = [...colorDetails];
    updatedColorDetails[colorIndex].sizes.push({ maKichCo: '', giaThem: 0, tonKho: 0 });
    setColorDetails(updatedColorDetails);
  };

  const removeSizeFromColor = (colorIndex, sizeIndex) => {
    const updatedColorDetails = [...colorDetails];
    if (updatedColorDetails[colorIndex].sizes.length > 1) {
      updatedColorDetails[colorIndex].sizes = updatedColorDetails[colorIndex].sizes.filter(
        (_, i) => i !== sizeIndex
      );
      setColorDetails(updatedColorDetails);
    }
  };

  const addColorDetail = () => {
    setColorDetails([...colorDetails, { maMau: '', hinhAnh: [], sizes: [{ maKichCo: '', giaThem: 0, tonKho: 0 }] }]);
  };

  const removeColorDetail = (colorIndex) => {
    if (colorDetails.length > 1) {
      setColorDetails(colorDetails.filter((_, i) => i !== colorIndex));
    }
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
      chiTietSanPhamDTOs: colorDetails.flatMap((color) =>
        color.sizes.map((size) => ({
          maKichCo: parseInt(size.maKichCo) || 0,
          maMau: parseInt(color.maMau) || 0,
          hinhAnh: color.hinhAnh,
          giaThem: parseFloat(size.giaThem) || 0,
          tonKho: parseInt(size.tonKho) || 0,
        }))
      ),
    };

    setLoading(true);
    try {
      await axiosAdmin.post('/api/products/with-details', payload);
      setSuccess('Thêm sản phẩm thành công!');
      setTenSanPham('');
      setGiaGoc(0);
      setMoTa('');
      setHinhAnhSanPham([]);
      setColorDetails([{ maMau: '', hinhAnh: [], sizes: [{ maKichCo: '', giaThem: 0, tonKho: 0 }] }]);
      navigate('/product');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi thêm sản phẩm');
    }finally{
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTenSanPham('');
    setGiaGoc(0);
    setMoTa('');
    setHinhAnhSanPham([]);
    setColorDetails([{ maMau: '', hinhAnh: [], sizes: [{ maKichCo: '', giaThem: 0, tonKho: 0 }] }]);
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
    setError,
    uploading,
    tenSanPham,
    setTenSanPham,
    giaGoc,
    setGiaGoc,
    moTa,
    setMoTa,
    hinhAnhSanPham,
    colorDetails,
    success,
    goToPage,
    deleteProduct,
    handleProductImageChange,
    removeProductImage,
    handleColorDetailChange,
    handleSizeDetailChange,
    addSizeToColor,
    removeSizeFromColor,
    addColorDetail,
    removeColorDetail,
    handleSubmit,
    resetForm,
  };
};

export default useProductAdmin;