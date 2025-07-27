import React, { useState } from "react";

const ImagePopup = ({ imageUrl, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3)); // Max zoom: 3x
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5)); // Min zoom: 0.5x
  };

  const handleOverlayClick = (e) => {
    // Only close if the click is on the overlay, not on the image or buttons
    if (e.target.classList.contains('overlay')) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overlay"
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-4xl w-full">
        <img
          src={imageUrl}
          alt="Zoomed image"
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-xl"
          style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.2s ease-in-out' }}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg hover:bg-red-600"
          title="Đóng"
        >
          ×
        </button>
        <div className="absolute bottom-2 left-2 flex space-x-2">
          <button
            onClick={handleZoomIn}
            className="bg-black/60 text-white px-3 py-1 rounded hover:bg-blue-600"
            title="Phóng to"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-black/60 text-white px-3 py-1 rounded hover:bg-blue-600"
            title="Thu nhỏ"
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;