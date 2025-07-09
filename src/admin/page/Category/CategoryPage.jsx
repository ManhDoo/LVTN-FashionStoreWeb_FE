import React, { useState } from 'react';
import { ChevronDownIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import useCategoryStore from '../../../user/hooks/useCategoryStore';
import { useNavigate } from 'react-router-dom';
import useCategoryAdmin from '../../adminHooks/useCategoryAdmin';

const CategoryPage = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { categories, loading, error: storeError, fetchCategories } = useCategoryStore();
  const { handleDelete, error: deleteError, isLoading } = useCategoryAdmin();
  const navigate = useNavigate();

  const onDelete = async (maDanhMuc) => {
    const success = await handleDelete(maDanhMuc);
    if (success) {
      fetchCategories(); // Refresh the category list
    }
  };

  return (
    <div className="p-4">
      {/* Accordion tìm kiếm */}
      <div className="mb-4">
        <div className="bg-white shadow rounded-lg">
          <button
            className="w-full flex justify-between items-center p-4 text-left bg-gray-100 rounded-t-lg hover:bg-gray-200"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <h4 className="text-lg font-medium m-0">Tìm kiếm</h4>
            <ChevronDownIcon
              className={`w-5 h-5 transform transition-transform ${isSearchOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isSearchOpen && (
            <div className="p-4 border-t">
              <form>
                <div className="flex flex-wrap -mx-2">
                  <div className="w-full md:w-1/3 px-2 mb-4">
                    <select className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="nam">Nam</option>
                      <option value="nu">Nữ</option>
                    </select>
                  </div>
                  <div className="w-full md:w-1/3 px-2 mb-4 flex space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                      Tìm kiếm
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Nhập Lại
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Bảng danh mục */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h4 className="text-lg font-medium">Danh sách danh mục</h4>
          <a
            href="/category-create"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Tạo danh mục mới
          </a>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-bold">STT</th>
                  <th className="p-3 font-bold">Tên danh mục</th>
                  <th className="p-3 font-bold">Mô tả</th>
                  <th className="p-3 font-bold">Phái</th>
                  <th className="p-3 font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading || isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : storeError || deleteError ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-red-500">
                      {storeError || deleteError}
                    </td>
                  </tr>
                ) : categories.length > 0 ? (
                  categories.map((cat, index) => (
                    <tr key={cat.maDanhMuc} className="border-b hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{cat.tendm}</td>
                      <td className="p-3">{cat.mota}</td>
                      <td className="p-3 capitalize">{cat.phai}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => navigate(`/category-edit/${cat.maDanhMuc}`)}
                          className="inline-block bg-blue-500 text-white p-2 rounded mr-1 hover:bg-blue-600"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(cat.maDanhMuc)}
                          className="inline-block bg-red-500 text-white p-2 rounded mr-1 hover:bg-red-600"
                          disabled={isLoading}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4">
                      Không có dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;