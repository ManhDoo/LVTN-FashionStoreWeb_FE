import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import useProductAdmin from "../../adminHooks/useProductAdmin";

const ProductPage = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { products, loading, error, page, totalPages, goToPage, deleteProduct } = useProductAdmin();
  const [confirmingProductId, setConfirmingProductId] = useState(null);
  const [confirmingProductName, setConfirmingProductName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [highlightedProductId, setHighlightedProductId] = useState(null);
  const tableRef = useRef(null);

  // Refs cho từng dòng sản phẩm
  const productRefs = useRef({});

  const handleSearch = (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert("Vui lòng chọn một sản phẩm để tìm kiếm!");
      return;
    }

    // Tìm vị trí của sản phẩm trong danh sách hiện tại
    const productIndex = products.findIndex(
      product => product.maSanPham.toString() === selectedProductId
    );

    if (productIndex !== -1) {
      // Scroll đến sản phẩm
      const productRow = productRefs.current[selectedProductId];
      if (productRow) {
        productRow.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // Highlight và nhấp nháy
        setHighlightedProductId(selectedProductId);
        
        // Tự động tắt highlight sau 3 giây
        setTimeout(() => {
          setHighlightedProductId(null);
        }, 3000);
      }
    } else {
      alert("Sản phẩm không có trong trang hiện tại!");
    }
  };

  const handleReset = () => {
    setSelectedProductId("");
    setHighlightedProductId(null);
  };

  // CSS cho animation nhấp nháy
  const getRowClassName = (productId) => {
    const baseClass = "border-b hover:bg-gray-50 transition-colors duration-200";
    if (highlightedProductId === productId.toString()) {
      return `${baseClass} animate-pulse bg-yellow-200 border-yellow-400 border-2`;
    }
    return baseClass;
  };

  return (
    <div className="container mx-auto p-4">
      {/* Custom CSS for blinking animation */}
      <style jsx>{`
        @keyframes highlight-blink {
          0%, 100% { background-color: #fef3c7; border-color: #f59e0b; }
          50% { background-color: #fbbf24; border-color: #d97706; }
        }
        
        .highlight-row {
          animation: highlight-blink 0.8s ease-in-out 3;
          border-width: 2px !important;
        }
      `}</style>

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
            <form onSubmit={handleSearch}>
              <div className="flex flex-wrap -mx-2">
                <div className="w-full md:w-1/3 px-2 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn sản phẩm:
                  </label>
                  <select 
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    {products.map((product) => (
                      <option key={product.maSanPham} value={product.maSanPham}>
                        {product.tensp}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-1/3 px-2 mb-4 flex space-x-2 items-end">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
                  >
                    Tìm kiếm
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200"
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
          <a
            href="/product-create"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Tạo sản phẩm
          </a>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto" ref={tableRef}>
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
                ) : products.length > 0 ? (
                  products.map((product, index) => (
                    <tr
                      key={product.maSanPham}
                      ref={(el) => productRefs.current[product.maSanPham] = el}
                      className={`${getRowClassName(product.maSanPham)} ${
                        highlightedProductId === product.maSanPham.toString() ? 'highlight-row' : ''
                      }`}
                    >
                      <td className="p-3">{index + 1 + page * 10}</td>
                      <td className="p-3 font-medium">
                        {highlightedProductId === product.maSanPham.toString() && (
                          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-ping"></span>
                        )}
                        {product.tensp}
                      </td>
                      <td className="p-3">{product.moTa}</td>
                      <td className="p-3">
                        {product.hinhAnh.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={product.tensp}
                            className="w-16 h-16 object-cover inline-block mr-2 rounded"
                          />
                        ))}
                      </td>
                      <td className="p-3 font-semibold text-green-600">
                        {product.giaGoc.toLocaleString()} VND
                      </td>
                      <td className="p-3">
                        {product.ngayTao
                          ? new Date(product.ngayTao).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {product.danhMuc?.tendm || "Chưa có"}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <a
                          href={`/product-edit/${product.maSanPham}`}
                          className="inline-block bg-blue-500 text-white p-2 rounded mr-1 hover:bg-blue-600 transition-colors duration-200"
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
                          className="inline-block bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-200"
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
              className="px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200"
            >
              «
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`px-3 py-1 rounded transition-colors duration-200 ${
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
              className="px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50 transition-colors duration-200"
            >
              »
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-md text-center">
            {error}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmingProductId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96 max-w-md mx-4">
              <h2 className="text-lg font-semibold mb-4 text-center text-gray-800">
                Xác nhận xóa
              </h2>
              <p className="mb-6 text-center text-gray-600">
                Bạn có chắc chắn muốn xóa sản phẩm{" "}
                <strong className="text-red-600">{confirmingProductName}</strong>?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setConfirmingProductId(null);
                    setConfirmingProductName("");
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    deleteProduct(confirmingProductId);
                    setConfirmingProductId(null);
                    setConfirmingProductName("");
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
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

export default ProductPage;