import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import useProductAdmin from '../../adminHooks/useProductAdmin';
import useColorAdmin from '../../adminHooks/useColorAdmin';
import useSizeAdmin from '../../adminHooks/useSizeAdmin';
import useCategoryAdmin from '../../adminHooks/useCategoryAdmin';

const ProductCreate = () => {
  const {
    tenSanPham,
    setTenSanPham,
    giaGoc,
    setGiaGoc,
    moTa,
    setMoTa,
    hinhAnhSanPham,
    details,
    success,
    error,
    uploading,
    handleProductImageChange,
    handleDetailImageChange,
    removeProductImage,
    removeDetailImage,
    handleAddDetail,
    handleRemoveDetail,
    handleDetailChange,
    handleSubmit,
    resetForm,
  } = useProductAdmin();

  const { colors, error: colorError, loading: colorLoading } = useColorAdmin();
  const { sizes, error: sizeError, loading: sizeLoading } = useSizeAdmin();
  const { danhMucList, error: categoryError, isLoading: categoryLoading, setDanhMucList } = useCategoryAdmin();
  const [maDanhMuc, setMaDanhMuc] = React.useState('');

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Tạo sản phẩm mới</h2>
      {(error || colorError || sizeError || categoryError) && (
        <div className="text-red-500 mb-4">{error || colorError || sizeError || categoryError}</div>
      )}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      {uploading && <div className="text-blue-500 mb-4">Đang tải ảnh...</div>}
      {(colorLoading || sizeLoading || categoryLoading) && (
        <div className="text-blue-500 mb-4">Đang tải dữ liệu...</div>
      )}
      <form onSubmit={(e) => handleSubmit(e, maDanhMuc)} className="space-y-6">
        {/* Thông tin sản phẩm */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Thông tin sản phẩm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={tenSanPham}
                onChange={(e) => setTenSanPham(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Giá gốc (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={giaGoc}
                onChange={(e) => setGiaGoc(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                value={moTa}
                onChange={(e) => setMoTa(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">Hình ảnh sản phẩm</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleProductImageChange}
                className="w-full p-2 border rounded-md"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {hinhAnhSanPham.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-32 h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeProductImage(index)}
                      className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                value={maDanhMuc}
                onChange={(e) => setMaDanhMuc(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">-- Chọn danh mục --</option>
                {danhMucList.map((dm) => (
                  <option key={dm.maDanhMuc} value={dm.maDanhMuc}>
                    {dm.tendm}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chi tiết sản phẩm */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">Chi tiết sản phẩm</h3>
          {details.map((detail, index) => (
            <div key={index} className="mb-4 p-4 border rounded-md relative">
              <h4 className="font-medium mb-2">Chi tiết {index + 1}</h4>
              {details.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveDetail(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">
                    Màu sắc <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={detail.maMau}
                    onChange={(e) => handleDetailChange(index, 'maMau', e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Chọn màu sắc --</option>
                    {colors.map((color) => (
                      <option key={color.maMau} value={color.maMau}>
                        {color.tenMau.trim()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Kích cỡ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={detail.maKichCo}
                    onChange={(e) => handleDetailChange(index, 'maKichCo', e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Chọn kích cỡ --</option>
                    {sizes.map((size) => (
                      <option key={size.maKichCo} value={size.maKichCo}>
                        {size.tenKichCo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 font-medium">Hình ảnh chi tiết</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleDetailImageChange(index, e)}
                    className="w-full p-2 border rounded-md"
                  />
                  <div className="mt-2 flex flex-wrap gap-2">
                    {detail.hinhAnh.map((url, imgIndex) => (
                      <div key={imgIndex} className="relative">
                        <img
                          src={url}
                          alt={`Detail ${index + 1} Image ${imgIndex + 1}`}
                          className="w-32 h-32 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeDetailImage(index, imgIndex)}
                          className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Giá thêm (VND)</label>
                  <input
                    type="number"
                    value={detail.giaThem}
                    onChange={(e) => handleDetailChange(index, 'giaThem', e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">
                    Tồn kho <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={detail.tonKho}
                    onChange={(e) => handleDetailChange(index, 'tonKho', e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddDetail}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Thêm chi tiết
          </button>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Nhập lại
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreate;