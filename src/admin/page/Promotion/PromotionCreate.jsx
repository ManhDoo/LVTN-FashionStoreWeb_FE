import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usePromotionAdmin from '../../adminHooks/usePromotionAdmin';

const PromotionCreate = () => {
  const navigate = useNavigate();
  const { createPromotion } = usePromotionAdmin();

  const [form, setForm] = useState({
    tenKhuyenMai: '',
    giaTriGiam: '',
    hinhThucGiam: 'Phần trăm',
    loaiKhuyenMai: 'Theo sản phẩm',
    moTa: '',
    ngayBatDau: '',
    ngayKetThuc: '',
    trangThai: 'Sắp diễn ra'
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createPromotion(form);
      alert('Tạo khuyến mãi thành công!');
      navigate('/promotion-page');
    } catch (err) {
      setError('Lỗi khi tạo khuyến mãi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4">Tạo khuyến mãi mới</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="tenKhuyenMai"
          value={form.tenKhuyenMai}
          onChange={handleChange}
          placeholder="Tên khuyến mãi"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="giaTriGiam"
          value={form.giaTriGiam}
          onChange={handleChange}
          placeholder="Giá trị giảm"
          required
          className="w-full border p-2 rounded"
        />
        <select
          name="hinhThucGiam"
          value={form.hinhThucGiam}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Phần trăm">Phần trăm</option>
          <option value="Tiền mặt">Tiền mặt</option>
        </select>
        <select
          name="loaiKhuyenMai"
          value={form.loaiKhuyenMai}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Theo sản phẩm">Theo sản phẩm</option>
          <option value="Toàn bộ đơn hàng">Toàn bộ đơn hàng</option>
        </select>
        <textarea
          name="moTa"
          value={form.moTa}
          onChange={handleChange}
          placeholder="Mô tả khuyến mãi"
          className="w-full border p-2 rounded"
        />
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Ngày bắt đầu</label>
            <input
              type="datetime-local"
              name="ngayBatDau"
              value={form.ngayBatDau}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Ngày kết thúc</label>
            <input
              type="datetime-local"
              name="ngayKetThuc"
              value={form.ngayKetThuc}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
        <select
          name="trangThai"
          value={form.trangThai}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Sắp diễn ra">Sắp diễn ra</option>
          <option value="Đang diễn ra">Đang diễn ra</option>
          <option value="Đã kết thúc">Đã kết thúc</option>
        </select>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Đang tạo...' : 'Tạo khuyến mãi'}
        </button>
      </form>
    </div>
  );
};

export default PromotionCreate;
