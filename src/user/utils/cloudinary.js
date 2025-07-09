import axios from 'axios';

const uploadImageToCloudinary = async (file, setUploading, setError) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'fashionstore'); // Thay bằng upload preset của bạn
  formData.append('cloud_name', 'dhdomiqlt'); // Thay bằng cloud name của bạn

  try {
    setUploading(true);
    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dhdomiqlt/image/upload', // Thay bằng cloud name
      formData
    );
    return response.data.secure_url;
  } catch (err) {
    setError('Lỗi khi upload ảnh lên Cloudinary');
    return null;
  } finally {
    setUploading(false);
  }
};

const uploadMultipleImages = async (files, setUploading, setError) => {
  if (files.length === 0) return [];
  setUploading(true);
  const urls = await Promise.all(
    Array.from(files).map(async (file) => await uploadImageToCloudinary(file, setUploading, setError))
  );
  setUploading(false);
  return urls.filter((url) => url !== null);
};

export { uploadImageToCloudinary, uploadMultipleImages };