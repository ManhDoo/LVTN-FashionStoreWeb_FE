import React from 'react';
import useCategoryStore from '../../adminHooks/useCategoryAdmin';

const CategoryCreate = () => {
  const { formData, error, isLoading, handleChange, handleSubmit } = useCategoryStore();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên danh mục</label>
                <input
                  type="text"
                  name="tendm"
                  value={formData.tendm}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phái</label>
                <select
                  name="phai"
                  value={formData.phai}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="nam">Nam</option>
                  <option value="nu">Nữ</option>
                </select>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                <textarea
                  name="mota"
                  value={formData.mota}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Nhập mô tả"
                />
              </div>
            </div>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Tạo'}
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => navigate('/category')} // Điều hướng về trang danh sách (cần điều chỉnh route)
            >
              Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryCreate;