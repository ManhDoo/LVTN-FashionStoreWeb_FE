import React, { useEffect, useState } from 'react';
import axiosAdmin from '../../utils/axiosAdmin';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const IncomePage = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [phai, setPhai] = useState('');
  const [doanhThuData, setDoanhThuData] = useState([]);
  const [topSanPhamData, setTopSanPhamData] = useState([]);
  const [transformedTopData, setTransformedTopData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchThongKeData = async () => {
    try {
      setLoading(true);

      const [doanhThuRes, topSanPhamRes] = await Promise.all([
        axiosAdmin.get(`/api/thong-ke/doanh-thu-theo-thang?year=${year}`),
        axiosAdmin.get(`/api/thong-ke/top-3-san-pham?year=${year}${phai ? `&phai=${phai}` : ''}`)
      ]);

      setDoanhThuData(doanhThuRes.data);
      setTopSanPhamData(topSanPhamRes.data);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu thống kê:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThongKeData();
  }, [year, phai]);

  useEffect(() => {
    const transformed = topSanPhamData.map((item) => ({
      thang: `Th${item.thang}`,
      top1: item.topSanPhams[0]?.soLuongMua || 0,
      top2: item.topSanPhams[1]?.soLuongMua || 0,
      top3: item.topSanPhams[2]?.soLuongMua || 0,
      names: {
        top1: item.topSanPhams[0]?.tenSanPham || '',
        top2: item.topSanPhams[1]?.tenSanPham || '',
        top3: item.topSanPhams[2]?.tenSanPham || ''
      }
    }));
    setTransformedTopData(transformed);
  }, [topSanPhamData]);

  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
  };

  const handlePhaiChange = (e) => {
    setPhai(e.target.value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const names = payload[0].payload.names;
      return (
        <div className="bg-white p-2 shadow rounded text-sm">
          <p className="font-bold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-gray-700">
              {entry.name}: {entry.value} (
              {names[entry.dataKey]})
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Thống kê doanh thu theo tháng - Năm {year}</h2>

      {/* Bộ lọc */}
      <div className="mb-6 flex items-center space-x-4">
        <div>
          <label className="mr-2 font-medium">Chọn năm:</label>
          <select
            value={year}
            onChange={handleYearChange}
            className="border rounded px-3 py-1"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = currentYear - i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Giới tính:</label>
          <select
            value={phai}
            onChange={handlePhaiChange}
            className="border rounded px-3 py-1"
          >
            <option value="">Tất cả</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
      </div>

      {/* Biểu đồ doanh thu */}
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={doanhThuData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="thang" label={{ value: 'Tháng', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Doanh thu (VNĐ)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => new Intl.NumberFormat('vi-VN').format(value)} />
              <Legend />
              <Bar dataKey="doanhThu" fill="#4F46E5" name="Doanh thu" />
            </BarChart>
          </ResponsiveContainer>

          {/* Biểu đồ top 3 sản phẩm mỗi tháng (gộp) */}
          <h3 className="text-xl font-semibold mt-10 mb-4">Top 3 sản phẩm bán chạy mỗi tháng</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={transformedTopData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="thang" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="top1" name="Top 1" fill="#6366F1" />
              <Bar dataKey="top2" name="Top 2" fill="#10B981" />
              <Bar dataKey="top3" name="Top 3" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default IncomePage;
