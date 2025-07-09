import { useState, useEffect } from 'react';
import axiosAdmin from '../utils/axiosAdmin';
import { useNavigate, useParams } from 'react-router-dom';

const useCategoryAdmin = () => {
  const [formData, setFormData] = useState({
    tendm: '',
    phai: 'nam',
    mota: '',
  });
  const [danhMucList, setDanhMucList] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchDanhMuc = async () => {
    try {
      setIsLoading(true);
      const res = await axiosAdmin.get('/api/categories');
      setDanhMucList(res.data);
      setError(null);
    } catch (err) {
      setError('Lỗi khi lấy danh sách danh mục');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        setIsLoading(true);
        try {
          const token = localStorage.getItem('tokenAdmin');
          if (!token) {
            setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
            setIsLoading(false);
            return;
          }

          const response = await axiosAdmin.get(`/api/categories/${id}`);
          if (response.status === 200) {
            setFormData(response.data);
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Đã xảy ra lỗi khi lấy thông tin danh mục.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategory();
    }
    fetchDanhMuc();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('tokenAdmin');
      if (!token) {
        setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
        setIsLoading(false);
        return;
      }

      const url = id ? `/api/categories/${id}` : '/api/categories';
      const method = id ? 'put' : 'post';

      const response = await axiosAdmin[method](url, formData);

      if (response.status === 200 || response.status === 201) {
        alert(id ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục thành công!');
        navigate('/category');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi lưu danh mục.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (maDanhMuc) => {
    if (!window.confirm('Bạn có chắc muốn xóa danh mục này?')) return false;

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('tokenAdmin');
      if (!token) {
        setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
        setIsLoading(false);
        return false;
      }

      const response = await axiosAdmin.delete(`/api/categories/${maDanhMuc}`);

      if (response.status === 200 || response.status === 204) {
        alert('Xóa danh mục thành công!');
        fetchDanhMuc(); // Cập nhật lại danh sách danh mục
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi xóa danh mục.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    danhMucList,
    error,
    isLoading,
    handleChange,
    handleSubmit,
    handleDelete,
    setDanhMucList,
  };
};

export default useCategoryAdmin;