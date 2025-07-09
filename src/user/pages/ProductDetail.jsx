import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useProductDetail from '../hooks/useProductDetail';
import { addToCart } from '../utils/cartStorage';
import { useNavigate } from 'react-router-dom';

function ProductDetail() {
  const navigate = useNavigate();
  const { maSanPham } = useParams();
  const { products, loading, error } = useProductDetail(maSanPham);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [variantError, setVariantError] = useState(null);

  // Set default color and size when data is loaded
  useEffect(() => {
    if (!loading && products.length > 0) {
      setSelectedColor(products[0].mauSac?.tenMau?.trim() || null);
      setSelectedSize(products[0].kichCo?.tenKichCo || null);
    }
  }, [loading, products]);

  // Validate variant
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variant = products.find(
        (detail) =>
          detail.mauSac?.tenMau?.trim() === selectedColor &&
          detail.kichCo?.tenKichCo === selectedSize
      );
      if (!variant) {
        setVariantError('Kết hợp màu sắc và kích thước này không có sẵn.');
      } else {
        setVariantError(null);
      }
    } else {
      setVariantError(null);
    }
  }, [selectedColor, selectedSize, products]);

  const handleQuantityChange = (action) => {
    if (action === 'decrease' && quantity > 1) setQuantity(quantity - 1);
    if (action === 'increase') setQuantity(quantity + 1);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    const availableSizes = getAvailableSizesForColor(color);
    if (!availableSizes.includes(selectedSize)) {
      setSelectedSize(availableSizes[0] || null);
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    const availableColors = getAvailableColorsForSize(size);
    if (!availableColors.includes(selectedColor)) {
      setSelectedColor(availableColors[0] || null);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!products.length) {
    return <div>Không tìm thấy sản phẩm.</div>;
  }

  const uniqueColors = [...new Set(products.map((detail) => detail.mauSac?.tenMau?.trim()))].filter(Boolean);
  const uniqueSizes = [...new Set(products.map((detail) => detail.kichCo?.tenKichCo))].filter(Boolean);

  const getAvailableSizesForColor = (color) => {
    return [...new Set(products.filter((detail) => detail.mauSac?.tenMau?.trim() === color).map((detail) => detail.kichCo?.tenKichCo))].filter(Boolean);
  };

  const getAvailableColorsForSize = (size) => {
    return [...new Set(products.filter((detail) => detail.kichCo?.tenKichCo === size).map((detail) => detail.mauSac?.tenMau?.trim()))].filter(Boolean);
  };

  const selectedVariant = products.find(
    (detail) =>
      detail.mauSac?.tenMau?.trim() === selectedColor &&
      detail.kichCo?.tenKichCo === selectedSize
  );

  const displayProduct = selectedVariant || products[0];

  // Calculate price with discount if applicable
  const originalPrice = displayProduct.sanPham.giaGoc + (displayProduct.giaThem || 0);
  const hasPromotion = displayProduct.sanPham.khuyenMai && displayProduct.sanPham.khuyenMai.trangThai === 'Đang diễn ra';
  let finalPrice = originalPrice;
  if (hasPromotion && displayProduct.sanPham.khuyenMai.hinhThucGiam === 'Phần trăm') {
    const discount = displayProduct.sanPham.khuyenMai.giaTriGiam;
    finalPrice = originalPrice * (1 - discount / 100);
  }

  // Color mapping
  const colorMap = {
    'Đen': 'black',
    'Xanh': 'blue',
    'Đỏ': 'red',
    'Vàng': 'yellow',
  };

  const handleAddToCart = () => {
  if (selectedVariant) {
    const cartItem = {
      id: selectedVariant.id,
      name: selectedVariant.sanPham.tensp,
      image: selectedVariant.sanPham.hinhAnh[0],
      quantity: quantity,
      color: selectedVariant.mauSac.tenMau,
      size: selectedVariant.kichCo.tenKichCo,
      price: finalPrice, // Giá đã giảm (hoặc giá gốc nếu không có khuyến mãi)
      originalPrice: originalPrice, // Giá gốc
      khuyenMai: selectedVariant.sanPham.khuyenMai ? {
        maKhuyenMai: selectedVariant.sanPham.khuyenMai.maKhuyenMai,
        giaTriGiam: selectedVariant.sanPham.khuyenMai.giaTriGiam,
        hinhThucGiam: selectedVariant.sanPham.khuyenMai.hinhThucGiam,
        ngayKetThuc: selectedVariant.sanPham.khuyenMai.ngayKetThuc,
      } : null,
    };

    addToCart(cartItem);
    console.log('Đã thêm vào giỏ hàng:', cartItem);
    navigate('/cart');
  }
};

  return (
    <div className="bg-gray-100 p-6 mt-10">
      <div className="bg-white rounded-lg shadow-lg max-w-7xl mx-auto flex">
        <div className="grid grid-cols-2 gap-4 p-4">
          {displayProduct.sanPham.hinhAnh.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={displayProduct.sanPham.tensp}
              className="w-[300px] h-auto rounded-lg"
            />
          ))}
        </div>
        <div className="p-6 flex-1">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-bold">{displayProduct.sanPham.tensp}</h2>
            {hasPromotion && (
              <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Giảm {displayProduct.sanPham.khuyenMai.giaTriGiam}%
              </span>
            )}
          </div>
          <div className="mb-4">
            {hasPromotion ? (
              <div className="flex items-center">
                <p className="text-red-500 text-lg font-semibold">
                  {finalPrice.toLocaleString('vi-VN')} VND
                </p>
                <p className="text-gray-500 line-through ml-2">
                  {originalPrice.toLocaleString('vi-VN')} VND
                </p>
              </div>
            ) : (
              <p className="text-red-500 text-lg">
                {originalPrice.toLocaleString('vi-VN')} VND
              </p>
            )}
          </div>
          <div className="mb-4">
            <p className="font-semibold mb-2">Màu sắc:</p>
            <div className="flex space-x-2">
              {uniqueColors.map((color) => {
                const availableColorsForSelectedSize = selectedSize ? getAvailableColorsForSize(selectedSize) : uniqueColors;
                const isColorDisabled = selectedSize && !availableColorsForSelectedSize.includes(color);
                return (
                  <button
                    key={color}
                    className={`w-6 h-6 rounded-full border ${
                      selectedColor === color ? 'ring-2 ring-gray-400' : ''
                    } ${isColorDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: colorMap[color] || 'gray' }}
                    onClick={() => !isColorDisabled && handleColorSelect(color)}
                    disabled={isColorDisabled}
                  ></button>
                );
              })}
            </div>
          </div>
          <div className="mb-4">
            <p className="font-semibold mb-2">Kích thước:</p>
            <div className="flex space-x-2">
              {uniqueSizes.map((size) => {
                const availableSizesForSelectedColor = selectedColor ? getAvailableSizesForColor(selectedColor) : uniqueSizes;
                const isSizeDisabled = selectedColor && !availableSizesForSelectedColor.includes(size);
                return (
                  <button
                    key={size}
                    className={`px-3 py-1 border rounded ${
                      selectedSize === size ? 'bg-gray-200' : 'bg-white'
                    } ${isSizeDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !isSizeDisabled && handleSizeSelect(size)}
                    disabled={isSizeDisabled}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
          {variantError && <p className="text-red-500 mb-4">{variantError}</p>}
          <div className="mb-4">
            <p className="font-semibold mb-2">Số lượng:</p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange('decrease')}
                className="px-3 py-1 border rounded"
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                onClick={() => handleQuantityChange('increase')}
                className="px-3 py-1 border rounded"
              >
                +
              </button>
            </div>
          </div>
          <button
            className={`cursor-pointer w-full py-2 mt-4 rounded text-white ${
              selectedVariant ? 'bg-black' : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={!selectedVariant}
            onClick={handleAddToCart}
          >
            Thêm vào giỏ hàng
          </button>
          <div className="mt-6">
            <h3 className="text-lg font-semibold">CHI TIẾT SẢN PHẨM</h3>
            <p className="text-gray-600 mt-2">{displayProduct.sanPham.moTa}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;