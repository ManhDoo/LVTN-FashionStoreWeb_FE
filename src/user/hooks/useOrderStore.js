// src/hooks/useOrderStore.js
import { useState } from 'react';
import axios from '../utils/axios'; // đã có interceptor Bearer

const useOrderStore = () => {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const placeOrder = async ({ user, name, phone, email, address, provinceName, districtName, wardName, cart, pttt }) => {
    const orderData = {
      maKhachHang: user ? user.maKhachHang : null,
      tenNguoiNhan: name,
      soDienThoaiNguoiNhan: phone,
      emailNguoiNhan: email,
      duong: address,
      xa: wardName,
      huyen: districtName,
      tinh: provinceName,
      cart: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      pttt: pttt,
    };

    try {
      setIsPlacingOrder(true);
      const response = await axios.post('/api/order/guest/place', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Lỗi không xác định' };
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return { placeOrder, isPlacingOrder };
};

export default useOrderStore;
