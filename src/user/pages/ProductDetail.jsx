import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProductDetail from '../hooks/useProductDetail';
import { addToCart } from '../utils/cartStorage';
import ImagePopup from '../../admin/utils/ImagePopup';
import LoadingSpinner from '../components/LoadingSpinner';

function ProductDetail() {
  const navigate = useNavigate();
  const { slugWithId } = useParams();
  const maSanPham = slugWithId.split('-').pop(); // Tách id từ cuối
  const { products, reviews, loading, error, refetch } = useProductDetail(maSanPham);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [variantError, setVariantError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const scrollToReviews = () => {
    const reviewSection = document.querySelector('.review-section');
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: 'smooth' });
    }
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

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-red-500 text-center py-6">
        {error}
        <button
          onClick={() => refetch()}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Thử lại
        </button>
      </div>
    );
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
    'Xanh dương': 'blue',
    'Đỏ': 'red',
    'Vàng': 'yellow',
    'Trắng': 'white',
    'Nâu': 'brown'
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
        price: finalPrice,
        originalPrice: originalPrice,
        khuyenMai: selectedVariant.sanPham.khuyenMai ? {
          maKhuyenMai: selectedVariant.sanPham.khuyenMai.maKhuyenMai,
          giaTriGiam: selectedVariant.sanPham.khuyenMai.giaTriGiam,
          hinhThucGiam: selectedVariant.sanPham.khuyenMai.hinhThucGiam,
          ngayKetThuc: selectedVariant.sanPham.khuyenMai.ngayKetThuc,
        } : null,
      };

      addToCart(cartItem);
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
              alt={`${displayProduct.sanPham.tensp} - ${index + 1}`}
              className="w-[300px] h-auto rounded-lg cursor-pointer hover:opacity-80"
              onClick={() => handleImageClick(img)}
            />
          ))}
        </div>
        <div className="p-6 flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <h2 className="text-xl font-bold">{displayProduct.sanPham.tensp}</h2>
              {hasPromotion && (
                <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  Giảm {displayProduct.sanPham.khuyenMai.giaTriGiam}%
                </span>
              )}
            </div>
            
          </div>
          {reviews && reviews.tongSoDanhGia > 0 && (
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {Array(5)
                  .fill()
                  .map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${i < Math.round(reviews.diemTrungBinh) ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
              </div>
              <span className="text-sm text-gray-600 mr-2">({reviews.diemTrungBinh.toFixed(1)})</span>
              <span className="text-sm text-gray-600 cursor-pointer hover:underline" onClick={scrollToReviews}>
                | {reviews.tongSoDanhGia} đánh giá
              </span>
            </div>
          )}
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

      {reviews && reviews.tongSoDanhGia > 0 && (
        <div className="bg-white rounded-lg shadow-lg max-w-7xl mx-auto mt-6 p-6 review-section">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Đánh giá sản phẩm</h3>
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300">
                Viết đánh giá
              </button>
              <button className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path d="M4 10a6 6 0 1112 0 6 6 0 01-12 0zm6-8a8 8 0 100 16 8 8 0 000-16z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <span className="text-3xl font-bold mr-2">{reviews.diemTrungBinh.toFixed(1)}</span>
                <div className="flex">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${i < Math.round(reviews.diemTrungBinh) ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">{reviews.tongSoDanhGia} đánh giá</p>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                  <div key={star} className="flex items-center">
                    <span className="w-6 text-sm">{star} ★</span>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-yellow-400 h-2.5 rounded-full"
                        style={{ width: `${(reviews.thongKeSoSao[star] / reviews.tongSoDanhGia) * 100 || 0}%` }}
                      ></div>
                    </div>
                    <span className="w-10 text-sm text-right">{reviews.thongKeSoSao[star]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              {reviews.danhSachDanhGia.map((review, index) => (
                <div key={index} className="border-t pt-4 mt-4 first:mt-0">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <span className="text-lg font-semibold">{review.hoTenKhachHang.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-semibold">{review.hoTenKhachHang}</p>
                      <p className="text-sm text-gray-500">{new Date(review.ngayDanhGia).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    {Array(5)
                      .fill()
                      .map((_, i) => (
                        <span
                          key={i}
                          className={`text-xl ${i < review.soSao ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                  </div>
                  <p className="text-gray-600 mb-2">{review.noiDung}</p>
                  <div className="flex space-x-2 mb-2">
                    {review.hinhAnh.map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img}
                        alt={`Review image ${imgIndex}`}
                        className="h-25 object-cover rounded-lg cursor-pointer hover:opacity-80"
                        onClick={() => handleImageClick(img)}
                      />
                    ))}
                  </div>
                  <div className="flex space-x-2 mb-2">
                    {review.hinhAnhSanPham[0] && (
                      <>
                        <img
                          src={review.hinhAnhSanPham[0]}
                          alt={review.tenSanPham}
                          className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80"
                          onClick={() => handleImageClick(review.hinhAnhSanPham[0])}
                        />
                        <p className="pt-5 text-sm text-gray-500">Sản phẩm: {review.tenSanPham} - {review.mauSac}</p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <ImagePopup
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}

export default ProductDetail;
