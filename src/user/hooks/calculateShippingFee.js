// src/utils/ghnApi.js
import axios from "axios";

const GHN_TOKEN = "8b5645b3-589c-11f0-9b81-222185cb68c8";

export const calculateShippingFee = async (districtId, wardCode, cart) => {
  try {
    const response = await axios.post(
      "https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
      {
        service_id: 53321,
        service_type_id: 2,
        to_district_id: parseInt(districtId),
        to_ward_code: wardCode,
        height: 50,
        length: 20,
        weight: 200,
        width: 20,
        coupon: null,
        items: cart.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          height: 200,
          weight: 1000,
          length: 200,
          width: 200
        }))
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: GHN_TOKEN
        }
      }
    );

    return response.data.data.total; // Phí ship
  } catch (error) {
    console.error("Lỗi khi tính phí vận chuyển:", error);
    return 0;
  }
};
