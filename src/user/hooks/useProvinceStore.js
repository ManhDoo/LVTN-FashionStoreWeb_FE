import { useState, useEffect } from 'react';

const useProvinceStore = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // Lấy danh sách tỉnh/thành khi component mount
  useEffect(() => {
    fetch('https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1')
      .then((response) => response.json())
      .then((data) => setProvinces(data.data.data || []))
      .catch((error) => console.error('Lỗi khi lấy danh sách tỉnh:', error));
  }, []);

  // Cập nhật danh sách quận/huyện khi chọn tỉnh
  useEffect(() => {
    if (selectedProvince) {
      fetch(`https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${selectedProvince}&limit=-1`)
        .then((response) => response.json())
        .then((data) => setDistricts(data.data.data || []))
        .then(() => {
          setWards([]);
          setSelectedDistrict('');
          setSelectedWard('');
        })
        .catch((error) => console.error('Lỗi khi lấy danh sách quận:', error));
    }
  }, [selectedProvince]);

  // Cập nhật danh sách phường/xã khi chọn quận/huyện
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${selectedDistrict}&limit=-1`)
        .then((response) => response.json())
        .then((data) => setWards(data.data.data || []))
        .then(() => setSelectedWard(''))
        .catch((error) => console.error('Lỗi khi lấy danh sách phường:', error));
    }
  }, [selectedDistrict]);

  return {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
  };
};

export default useProvinceStore;