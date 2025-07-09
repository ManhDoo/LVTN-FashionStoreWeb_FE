import { useState, useEffect } from 'react';

const GHN_API = 'https://dev-online-gateway.ghn.vn/shiip/public-api';
const TOKEN = '8b5645b3-589c-11f0-9b81-222185cb68c8';

const headers = {
  'Content-Type': 'application/json',
  Token: TOKEN,
};

const useGHNLocationStore = () => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // Lấy danh sách tỉnh
  useEffect(() => {
    fetch(`${GHN_API}/master-data/province`, { headers })
      .then(res => res.json())
      .then(data => setProvinces(data.data || []))
      .catch(err => console.error('Lỗi lấy tỉnh GHN:', err));
  }, []);

  // Lấy danh sách quận theo tỉnh
  useEffect(() => {
    if (selectedProvince) {
      fetch(`${GHN_API}/master-data/district`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ province_id: parseInt(selectedProvince) }),
      })
        .then(res => res.json())
        .then(data => {
          setDistricts(data.data || []);
          setWards([]);
          setSelectedDistrict('');
          setSelectedWard('');
        })
        .catch(err => console.error('Lỗi lấy quận GHN:', err));
    }
  }, [selectedProvince]);

  // Lấy danh sách phường theo quận
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`${GHN_API}/master-data/ward?district_id=${selectedDistrict}`, {
        headers,
      })
        .then(res => res.json())
        .then(data => {
          setWards(data.data || []);
          setSelectedWard('');
        })
        .catch(err => console.error('Lỗi lấy phường GHN:', err));
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

export default useGHNLocationStore;
