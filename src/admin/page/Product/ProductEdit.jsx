import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosAdmin from "../../utils/axiosAdmin";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productDetails, setProductDetails] = useState(null);
  const [product, setProduct] = useState({
    tensp: "",
    giaGoc: 0,
    moTa: "",
    trongLuong: 0,
    hinhAnh: [],
    maDanhMuc: null,
    maKhuyenMai: null,
  });
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
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
        setProduct({
          tensp: productRes.data[0].sanPham.tensp,
          giaGoc: productRes.data[0].sanPham.giaGoc,
          moTa: productRes.data[0].sanPham.moTa,
          trongLuong: productRes.data[0].sanPham.trongLuong,
          hinhAnh: productRes.data[0].sanPham.hinhAnh || [],
          maDanhMuc: productRes.data[0].sanPham.danhMuc?.maDanhMuc || null,
          maKhuyenMai: productRes.data[0].sanPham.khuyenMai?.maKhuyenMai || null,
        });
        setUpdatedVariants(
          productRes.data.map((detail) => ({
            id: detail.id,
            maMau: detail.mauSac.maMau,
            maKichCo: detail.kichCo.maKichCo,
            tonKho: detail.tonKho,
            giaThem: detail.giaThem,
            hinhAnh: detail.hinhAnh || [],
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
        giaThem: detail.giaThem,
        hinhAnh: detail.hinhAnh || [],
      });
      return acc;
    }, {});
  };

  const handleProductChange = (field, value) => {
    setProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleVariantChange = (id, field, value) => {
    setUpdatedVariants((prev) =>
      prev.map((variant) =>
        variant.id === id
          ? { ...variant, [field]: field === "tonKho" || field === "giaThem" ? parseFloat(value) || 0 : value }
          : variant
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
        id: `new-${prev.length}`,
        maMau: parseInt(newVariant.maMau),
        maKichCo: parseInt(newVariant.maKichCo),
        tonKho: parseInt(newVariant.tonKho),
        giaThem: parseFloat(newVariant.giaThem),
        hinhAnh: newVariant.hinhAnh,
      },
    ]);

    setNewVariant({ maMau: "", maKichCo: "", tonKho: 0, giaThem: 0, hinhAnh: [] });
  };

  const handleImageUpload = (e, type, variantId = null) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    if (type === "product") {
      setProduct((prev) => ({ ...prev, hinhAnh: [...prev.hinhAnh, ...imageUrls] }));
    } else if (type === "variant" && variantId) {
      setUpdatedVariants((prev) =>
        prev.map((variant) =>
          variant.id === variantId
            ? { ...variant, hinhAnh: [...variant.hinhAnh, ...imageUrls] }
            : variant
        )
      );
    } else if (type === "newVariant") {
      setNewVariant((prev) => ({ ...prev, hinhAnh: [...prev.hinhAnh, ...imageUrls] }));
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        tensp: product.tensp,
        giaGoc: product.giaGoc,
        moTa: product.moTa,
        trongLuong: product.trongLuong,
        hinhAnh: product.hinhAnh,
        chiTietSanPhams: updatedVariants.map((variant) => ({
          id: variant.id.toString().startsWith("new-") ? null : variant.id,
          maMau: variant.maMau,
          maKichCo: variant.maKichCo,
          tonKho: variant.tonKho,
          giaThem: variant.giaThem,
        })),
      };

      await axiosAdmin.put(`/api/products/update/${id}`, payload);
      alert("Cập nhật sản phẩm thành công!");
      navigate("/product");
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

  const groupedDetails = groupByColor(productDetails);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Chỉnh sửa sản phẩm</h2>

        {/* Product Information Form */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Thông tin sản phẩm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Tên sản phẩm</label>
              <input
                type="text"
                value={product.tensp}
                onChange={(e) => handleProductChange("tensp", e.target.value)}
                className="w-full p-2 border rounded"
              />
              <label className="block mb-1 mt-2">Giá gốc (VND)</label>
              <input
                type="number"
                value={product.giaGoc}
                onChange={(e) => handleProductChange("giaGoc", parseFloat(e.target.value) || 0)}
                className="w-full p-2 border rounded"
                min="0"
              />
              <label className="block mb-1 mt-2">Mô tả</label>
              <textarea
                value={product.moTa}
                onChange={(e) => handleProductChange("moTa", e.target.value)}
                className="w-full p-2 border rounded"
                rows="4"
              />
              <label className="block mb-1 mt-2">Trọng lượng (kg)</label>
              <input
                type="number"
                value={product.trongLuong}
                onChange={(e) => handleProductChange("trongLuong", parseFloat(e.target.value) || 0)}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
              />
            </div>
            
          </div>
        </div>

        {/* Product Variants */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Chi tiết sản phẩm</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(groupedDetails).map((color, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium text-blue-600">{color}</h4>
                <table className="w-full text-left mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 font-bold">Kích cỡ</th>
                      <th className="p-2 font-bold">Tồn kho</th>
                      <th className="p-2 font-bold">Giá thêm</th>
                      {/* <th className="p-2 font-bold">Hình ảnh</th> */}
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
                              updatedVariants.find((v) => v.id === item.id)?.tonKho || item.tonKho
                            }
                            onChange={(e) => handleVariantChange(item.id, "tonKho", e.target.value)}
                            className="w-20 p-1 border rounded"
                            min="0"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            value={
                              updatedVariants.find((v) => v.id === item.id)?.giaThem || item.giaThem
                            }
                            onChange={(e) => handleVariantChange(item.id, "giaThem", e.target.value)}
                            className="w-20 p-1 border rounded"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="file"
                            multiple
                            onChange={(e) => handleImageUpload(e, "variant", item.id)}
                            className="w-full p-1 border rounded"
                          />
                          <div className="flex flex-wrap gap-2 mt-1">
                            {updatedVariants
                              .find((v) => v.id === item.id)
                              ?.hinhAnh.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt="Variant"
                                  className="w-16 h-16 object-cover rounded"
                                />
                              ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Variant */}
        {/* <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Thêm biến thể mới</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
            <div>
              <label className="block mb-1">Giá thêm</label>
              <input
                type="number"
                value={newVariant.giaThem}
                onChange={(e) => handleNewVariantChange("giaThem", e.target.value)}
                className="w-full p-2 border rounded"
                min="0"
                step="0.01"
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
          <div className="mt-2">
            <label className="block mb-1">Hình ảnh biến thể</label>
            <input
              type="file"
              multiple
              onChange={(e) => handleImageUpload(e, "newVariant")}
              className="w-full p-2 border rounded"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {newVariant.hinhAnh.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="New Variant"
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
            </div>
          </div>
        </div> */}

        {/* Save and Cancel Buttons */}
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