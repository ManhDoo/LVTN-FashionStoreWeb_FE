import React, { useState, useEffect } from "react";
import logo from "../../../assets/images/logoStore.png";
import { useParams } from "react-router-dom";
import axiosAdmin from "../../utils/axiosAdmin";
import { fetchBillById } from "../../adminHooks/useBillAdmin";

const BillCreate = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [senderName, setSenderName] = useState("Fashion Store");
  const [senderAddress, setSenderAddress] = useState("180 Cao Lỗ, phường 4, Quận 8, Thành phố Hồ Chí Minh");
  const [recipientName, setRecipientName] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [hubCode, setHubCode] = useState("MB-15-04-TN10");
  const [orderItems, setOrderItems] = useState([]); // State mới cho chi tiết đơn hàng
  const [codAmount, setCodAmount] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [cashOnDelivery, setCashOnDelivery] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("Xác nhận hàng nguyên vẹn, kiểm móp/méo, bể/vỡ");
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosAdmin.get(`/api/bill/${id}`);
        const data = res.data;

        setOrderNumber("SPX" + id);
        setTrackingNumber("TRACK" + id);
        setRecipientName(data.tenNguoiNhan);
        setRecipientAddress(data.diaChi);
        setCodAmount(
          data.trangThai === "DA_THANH_TOAN"
            ? "0 VND"
            : data.thanhTien.toLocaleString() + " VND"
        );
        setOrderDate(new Date(data.ngayTao).toLocaleString());
        setCashOnDelivery(data.tenNguoiNhan);
        setOrderItems(data.chiTietDonHang); // Lưu chi tiết đơn hàng
      } catch (err) {
        console.error("Lỗi khi tải hóa đơn:", err);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl p-6 rounded-lg shadow-lg border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <img src={logo} alt="Logo" />
          </div>
          <div className="text-right">
            <p className="font-medium">
              Mã vận đơn:{" "}
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="border-b border-gray-300 w-40 inline-block"
              />
            </p>
            <p className="font-medium">
              Mã đơn hàng:{" "}
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="border-b border-gray-300 w-40 inline-block"
              />
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-medium">Từ:</p>
            <textarea
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows="2"
            />
            <textarea
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows="3"
            />
          </div>
          <div>
            <p className="font-medium">Đến: (Chỉ giao đến hàng chính)</p>
            <textarea
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows="2"
            />
            <textarea
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              rows="3"
            />
          </div>
        </div>

        <div className="border-t border-dashed border-gray-400 my-4"></div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-xl font-bold">{hubCode}</div>
          <div className="w-24 h-24 bg-gray-200 flex items-center justify-center">QR Code</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-medium">Thông tin sản phẩm (Tổng SL sản phẩm: {orderItems.length})</p>
            <textarea
              value={orderItems
                .map(
                  (item, index) =>
                    `${index + 1}. ${item.tenSanPham} (${item.mauSac}, ${item.kichCo}, SL: ${item.soLuong})`
                )
                .join("\n")}
              readOnly
              className="w-full border border-gray-300 p-2 rounded"
              rows="3"
            />
          </div>
          <div className="text-right">
            <p className="font-medium">Ngày đặt hàng:</p>
            <input
              type="text"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="border-b border-gray-300 w-40 inline-block text-right"
            />
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="font-medium">Tiền thu người nhận:</p>
            
          </div>
          <div className="text-4xl font-bold text-orange-600">{codAmount}</div>
        </div>

        <div className="border-t border-dashed border-gray-400 my-4"></div>

        <div className="text-center text-sm text-gray-600">
          <p>Chú ý giao hàng: Không đóng kiểm: Chuyển hoàn sau 3 lần phát, Lưu kho tối đa 5 ngày</p>
          <p>Tuyển dụng Tài xế/Điều phối kho SPX - Thu nhập 8-20 triệu - Gọi 1900 6885</p>
        </div>
      </div>
    </div>
  );
};

export default BillCreate;