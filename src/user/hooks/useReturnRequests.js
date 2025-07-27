import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { uploadMultipleImages } from '../utils/cloudinary';

const useReturnRequests = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // State for fetching return requests
  const [returnRequests, setReturnRequests] = useState([]);
  const [loadingReturns, setLoadingReturns] = useState(true);
  const [errorReturns, setErrorReturns] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10); // Matches API pageSize

  // State for return submission
  const [selectedReason, setSelectedReason] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [reasons, setReasons] = useState([]);
  const [loadingReasons, setLoadingReasons] = useState(true);
  const [phuongAn, setPhuongAn] = useState('-');
  const [phiShip, setShip] = useState('');
  const [phiDoiTra, setPhiDoiTra] = useState(0);

  const orderDetail = {
    maDonHang: searchParams.get('maDonHang'),
    chiTietDonHangId: searchParams.get('chiTietDonHangId'),
    maSanPham: searchParams.get('maSanPham'),
    tenSanPham: searchParams.get('tenSanPham'),
    hinhAnh: searchParams.get('hinhAnh'),
    soLuong: searchParams.get('soLuong'),
    donGia: Number(searchParams.get('donGia')),
    kichCo: searchParams.get('kichCo'),
    mauSac: searchParams.get('mauSac'),
    phiGiaoHang: Number(searchParams.get('phiGiaoHang') || 0), // Ensure phiGiaoHang is a number
  };

  // Define reasons that qualify for free return
  const freeReturnReasons = ['LOI_SAN_PHAM', 'KHAC_MO_TA', 'GUI_SAI_HANG'];

  // Update phiDoiTra based on selectedReason
  useEffect(() => {
    if (selectedReason) {
      const newPhiDoiTra = freeReturnReasons.includes(selectedReason)
        ? 0
        : Number(orderDetail.phiGiaoHang || 0);
      setPhiDoiTra(newPhiDoiTra);
    } else {
      setPhiDoiTra(0);
    }
  }, [selectedReason, orderDetail.phiGiaoHang]);

  // Fetch return requests
  const fetchReturnRequests = async (page = 0) => {
    try {
      const response = await axiosInstance.get(`/api/returns?page=${page}`);
      setReturnRequests(response.data.content);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.pageable.pageNumber);
    } catch (err) {
      setErrorReturns('Không thể tải yêu cầu hoàn trả.');
    } finally {
      setLoadingReturns(false);
    }
  };

  // Fetch return reasons
  useEffect(() => {
    axiosInstance
      .get('/api/return-reasons')
      .then((res) => {
        setReasons(res.data);
      })
      .catch((err) => {
        console.error('Lỗi khi tải lý do đổi trả', err);
      })
      .finally(() => setLoadingReasons(false));
  }, []);

  // Fetch return requests on mount
  useEffect(() => {
    fetchReturnRequests();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
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

  const loaiMapping = {
    'Hoàn tiền và trả hàng': 'TRA',
    'Đổi hàng': 'DOI',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadError(null);

    try {
      const imageUrls = await uploadMultipleImages(
        selectedFiles,
        setUploading,
        setUploadError
      );

      const payload = {
        maDonHang: parseInt(orderDetail.maDonHang),
        loai: loaiMapping[phuongAn],
        lyDo: selectedReason,
        phiDoiTra: phiDoiTra, // Include phiDoiTra in the payload
        items: [
          {
            chiTietDonHangId: parseInt(orderDetail.chiTietDonHangId),
            soLuong: parseInt(orderDetail.soLuong),
            lyDoChiTiet: description,
            hinhAnh: imageUrls,
          },
        ],
      };

      await axiosInstance.post('/api/returns', payload);
      alert('Gửi yêu cầu hoàn trả thành công!');
      navigate('/list-return');
    } catch (err) {
      console.error('Lỗi gửi yêu cầu:', err.response?.data || err.message);
      setUploadError('Không thể gửi yêu cầu hoàn trả.');
    } finally {
      setSubmitting(false);
    }
  };

  return {
    returnRequests,
    loadingReturns,
    errorReturns,
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
    phiDoiTra, // Return phiDoiTra for use in ReturnPage
    setPhiDoiTra,
    handleImageChange,
    handleRemoveImage,
    handleSubmit,
    fetchReturnRequests,
  };
};

export default useReturnRequests;