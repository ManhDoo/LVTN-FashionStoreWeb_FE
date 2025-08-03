import React, { useState } from "react";
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import useProductAdmin from "../../adminHooks/useProductAdmin";

const ProductIsDeletedPage = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { productsIsDeleted, loading, error, page, totalPages, goToPage, deleteProduct } = useProductAdmin();
  const [confirmingProductId, setConfirmingProductId] = useState(null);
  const [confirmingProductName, setConfirmingProductName] = useState("");
  return (
    <div className="container mx-auto p-4">
      {/* Search Accordion */}
      <div className="mb-4">
        <div className="bg-white shadow rounded-lg">
          <button
            className="w-full flex justify-between items-center p-4 text-left bg-gray-100 rounded-t-lg hover:bg-gray-200"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <h4 className="text-lg font-medium m-0">Tìm kiếm</h4>
            <ChevronDownIcon
              className={`w-5 h-5 transform transition-transform ${
                isSearchOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          <div className={`${isSearchOpen ? "block" : "hidden"} p-4 border-t`}>
            <form>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <select className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {productsIsDeleted.map((product) => (
                      <option key={product.maSanPham} value={product.maSanPham}>
                        {product.tensp}
                      </option>
                    ))}
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
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h4 className="text-lg font-medium">Danh sách sản phẩm</h4>
          
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-bold">STT</th>
                  <th className="p-3 font-bold">Tên sản phẩm</th>
                  <th className="p-3 font-bold">Mô tả</th>
                  <th className="p-3 font-bold">Hình ảnh</th>
                  <th className="p-3 font-bold">Giá gốc</th>
                  <th className="p-3 font-bold">Ngày tạo</th>
                  <th className="p-3 font-bold">Danh mục</th>
                  <th className="p-3 font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center p-4">
                      Đang tải...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="text-center p-4">
                      Lỗi: {error}
                    </td>
                  </tr>
                ) : productsIsDeleted.length > 0 ? (
                  productsIsDeleted.map((product, index) => (
                    <tr
                      key={product.maSanPham}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">{index + 1 + page * 10}</td>
                      <td className="p-3">{product.tensp}</td>
                      <td className="p-3">{product.moTa}</td>
                      <td className="p-3">
                        {product.hinhAnh.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={product.tensp}
                            className="w-16 h-16 object-cover inline-block mr-2"
                          />
                        ))}
                      </td>
                      <td className="p-3">
                        {product.giaGoc.toLocaleString()} VND
                      </td>
                      <td className="p-3">
                        {product.ngayTao
                          ? new Date(product.ngayTao).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        {product.danhMuc?.tendm || "Chưa có"}
                      </td>
                      <td className="p-3 text-center">
                        <a
                          href={`/product-edit/${product.maSanPham}`}
                          className="inline-block bg-blue-500 text-white p-2 rounded mr-1 hover:bg-blue-600"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </a>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setConfirmingProductId(product.maSanPham);
                            setConfirmingProductName(product.tensp);
                          }}
                          className="inline-block bg-red-500 text-white p-2 rounded hover:bg-red-600"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center p-4">
                      Không có dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination controls */}
        <div className="p-4 border-t">
          <div className="flex justify-center space-x-1">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className="px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              «
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`px-3 py-1 rounded ${
                  page === i
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              »
            </button>
          </div>
        </div>
        {error && (
  <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-md text-center">
    {error}
  </div>
)}
{confirmingProductId && (
  <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md w-96">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Xác nhận khôi phục
      </h2>
      <p className="mb-4 text-center">
        Bạn có chắc chắn muốn khôi phục sản phẩm <strong>{confirmingProductName}</strong>?
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setConfirmingProductId(null)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Hủy
        </button>
        <button
          onClick={() => {
            deleteProduct(confirmingProductId);
            setConfirmingProductId(null);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
};

export default ProductIsDeletedPage;
