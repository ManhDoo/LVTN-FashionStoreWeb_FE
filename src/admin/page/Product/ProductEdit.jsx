import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosAdmin from "../../utils/axiosAdmin";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newVariant, setNewVariant] = useState({
    maMau: "",
    maKichCo: "",
    tonKho: 0,
    giaThem: 0,
    hinhAnh: [],
  });
  const [updatedVariants, setUpdatedVariants] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy chi tiết sản phẩm
        const productRes = await axiosAdmin.get(`/api/products/${id}/details`);
        setProductDetails(productRes.data);
        setUpdatedVariants(
          productRes.data.map((detail) => ({
            id: detail.id,
            maMau: detail.mauSac.maMau,
            maKichCo: detail.kichCo.maKichCo,
            tonKho: detail.tonKho,
            giaThem: detail.giaThem,
            hinhAnh: detail.hinhAnh,
          }))
        );

        // Lấy danh sách màu sắc
        const colorsRes = await axiosAdmin.get("/api/color");
        setColors(colorsRes.data);

        // Lấy danh sách kích cỡ
        const sizesRes = await axiosAdmin.get("/api/size");
        setSizes(sizesRes.data);

        setLoading(false);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu: " + err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const groupByColor = (details) => {
    return details.reduce((acc, detail) => {
      const color = detail.mauSac.tenMau;
      if (!acc[color]) {
        acc[color] = [];
      }
      acc[color].push({
        id: detail.id,
        kichCo: detail.kichCo.tenKichCo,
        maKichCo: detail.kichCo.maKichCo,
        tonKho: detail.tonKho,
      });
      return acc;
    }, {});
  };

  const handleVariantChange = (id, newTonKho) => {
    setUpdatedVariants((prev) =>
      prev.map((variant) =>
        variant.id === id ? { ...variant, tonKho: parseInt(newTonKho) || 0 } : variant
      )
    );
  };

  const handleNewVariantChange = (field, value) => {
    setNewVariant((prev) => ({ ...prev, [field]: value }));
  };

  const addNewVariant = () => {
    if (!newVariant.maMau || !newVariant.maKichCo || newVariant.tonKho < 0) {
      alert("Vui lòng chọn màu sắc, kích cỡ và nhập số lượng tồn kho hợp lệ!");
      return;
    }

    // Kiểm tra xem biến thể đã tồn tại chưa
    const isDuplicate = updatedVariants.some(
      (variant) =>
        variant.maMau === parseInt(newVariant.maMau) &&
        variant.maKichCo === parseInt(newVariant.maKichCo)
    );
    if (isDuplicate) {
      alert("Biến thể với màu sắc và kích cỡ này đã tồn tại!");
      return;
    }

    setUpdatedVariants((prev) => [
      ...prev,
      {
        id: `new-${prev.length}`, // ID tạm thời cho biến thể mới
        maMau: parseInt(newVariant.maMau),
        maKichCo: parseInt(newVariant.maKichCo),
        tonKho: parseInt(newVariant.tonKho),
        giaThem: newVariant.giaThem,
        hinhAnh: newVariant.hinhAnh,
      },
    ]);

    // Reset form
    setNewVariant({ maMau: "", maKichCo: "", tonKho: 0, giaThem: 0, hinhAnh: [] });
  };

  const handleSubmit = async () => {
    try {
      // Chuẩn bị dữ liệu gửi lên API
      const payload = {
        sanPham: productDetails[0].sanPham, // Giữ nguyên thông tin sản phẩm
        chiTietSanPhamDTOs: updatedVariants.map((variant) => ({
          maMau: variant.maMau,
          maKichCo: variant.maKichCo,
          tonKho: variant.tonKho,
          giaThem: variant.giaThem,
          hinhAnh: variant.hinhAnh,
        })),
      };

      await axiosAdmin.put(`/api/products/${id}`, payload);
      alert("Cập nhật sản phẩm thành công!");
      navigate("/products");
    } catch (err) {
      setError("Lỗi khi cập nhật sản phẩm: " + err.message);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-700">{error}</div>
    );
  }

  if (!productDetails || productDetails.length === 0) {
    return (
      <div className="container mx-auto p-4 text-center">
        Không có dữ liệu chi tiết sản phẩm.
      </div>
    );
  }

  const product = productDetails[0].sanPham;
  const groupedDetails = groupByColor(productDetails);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Chi tiết sản phẩm</h2>

        {/* Thông tin sản phẩm (chỉ hiển thị) */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Thông tin chung</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Tên sản phẩm:</strong> {product.tensp}
              </p>
              <p>
                <strong>Mô tả:</strong> {product.moTa}
              </p>
              <p>
                <strong>Giá gốc:</strong> {product.giaGoc.toLocaleString()} VND
              </p>
              <p>
                <strong>Ngày tạo:</strong>{" "}
                {new Date(product.ngayTao).toLocaleDateString()}
              </p>
              <p>
                <strong>Danh mục:</strong>{" "}
                {product.danhMuc?.tendm || "Chưa có"}
              </p>
              <p>
                <strong>Khuyến mãi:</strong>{" "}
                {product.khuyenMai
                  ? `${product.khuyenMai.tenKhuyenMai} (${product.khuyenMai.giaTriGiam}% - ${product.khuyenMai.trangThai})`
                  : "Không có"}
              </p>
            </div>
            <div>
              <p>
                <strong>Hình ảnh:</strong>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.hinhAnh.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={product.tensp}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Chi tiết sản phẩm (cập nhật tồn kho) */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Chi tiết sản phẩm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(groupedDetails).map((color, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-blue-600">{color}</h4>
                <table className="w intelligible text-left mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 font-bold">Kích cỡ</th>
                      <th className="p-2 font-bold">Tồn kho</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedDetails[color].map((item, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="p-2">{item.kichCo}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={
                              updatedVariants.find(
                                (v) => v.id === item.id
                              )?.tonKho || item.tonKho
                            }
                            onChange={(e) =>
                              handleVariantChange(item.id, e.target.value)
                            }
                            className="w-20 p-1 border rounded"
                            min="0"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>

        {/* Thêm biến thể mới */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Thêm biến thể mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block mb-1">Màu sắc</label>
              <select
                value={newVariant.maMau}
                onChange={(e) => handleNewVariantChange("maMau", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Chọn màu</option>
                {colors.map((color) => (
                  <option key={color.maMau} value={color.maMau}>
                    {color.tenMau}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Kích cỡ</label>
              <select
                value={newVariant.maKichCo}
                onChange={(e) => handleNewVariantChange("maKichCo", e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Chọn kích cỡ</option>
                {sizes.map((size) => (
                  <option key={size.maKichCo} value={size.maKichCo}>
                    {size.tenKichCo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1">Tồn kho</label>
              <input
                type="number"
                value={newVariant.tonKho}
                onChange={(e) => handleNewVariantChange("tonKho", e.target.value)}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addNewVariant}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>

        {/* Nút lưu và quay lại */}
        <div className="flex justify-between">
          <a
            href="/product"
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Quay lại
          </a>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;