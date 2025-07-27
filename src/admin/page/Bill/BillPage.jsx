import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { fetchAllBills } from '../../adminHooks/useBillAdmin';

const BillPage = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await fetchAllBills(0,10);
      setBills(response.content);
    } catch (err) {
      setError('Lỗi khi tải danh sách hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "DA_THANH_TOAN":
        return "Đã thanh toán";
      case "CHUA_THANH_TOAN":
        return "Chưa thanh toán";
      default:
        return "Không xác định";
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

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
                    <input
                      type="text"
                      placeholder="Tìm theo tên người nhận"
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                      onClick={fetchBills}
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

      {/* Bảng hóa đơn */}
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b flex justify-between items-center">
          <h4 className="text-lg font-medium">Danh sách hóa đơn</h4>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 font-bold">STT</th>
                  <th className="p-3 font-bold">Mã hóa đơn</th>
                  <th className="p-3 font-bold">Mã đơn hàng</th>
                  <th className="p-3 font-bold">Người nhận</th>
                  <th className="p-3 font-bold">SĐT</th>
                  <th className="p-3 font-bold">Địa chỉ</th>
                  <th className="p-3 font-bold">Phí giao hàng</th>
                  <th className="p-3 font-bold">Tổng giá</th>
                  <th className="p-3 font-bold">Thành tiền</th>
                  <th className="p-3 font-bold">Thanh toán  </th>
                  <th className="p-3 font-bold">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="text-center p-4">
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="11" className="text-center p-4 text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : bills.length > 0 ? (
                  bills.map((bill, index) => (
                    <tr key={bill.maHoaDon} className="border-b hover:bg-gray-50">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{bill.maHoaDon}</td>
                      <td className="p-3">{bill.maDonHang}</td>
                      <td className="p-3">{bill.tenNguoiNhan}</td>
                      <td className="p-3">{bill.soDienThoai}</td>
                      <td className="p-3">{bill.diaChi}</td>
                      <td className="p-3">{bill.phiGiaoHang.toLocaleString()}đ</td>
                      <td className="p-3">{bill.tongGia.toLocaleString()}đ</td>
                      <td className="p-3">{bill.thanhTien.toLocaleString()}đ</td>
                      <td className="p-3">{getStatusText(bill.trangThai)}</td>
                      <td className="p-3">{new Date(bill.ngayTao).toLocaleString()}</td>
                      <td className="p-3">
                        <button
                          onClick={() => navigate(`/bills-create/${bill.maHoaDon}`)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center p-4">
                      Không có hóa đơn nào.
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

export default BillPage;
