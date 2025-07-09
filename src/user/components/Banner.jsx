import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Banner = () => {
  // Danh sách ảnh cho slideshow (bạn có thể thay đổi đường dẫn ảnh theo nhu cầu)
  const images = [
    {
      src: "https://file.hstatic.net/200000503583/article/high-fashion-la-gi-21_15eb1f9733ae4344977098b5bdcaf03f.jpg",
      alt: "Fashion Collection 1"
    },
    {
      src: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
      alt: "Fashion Collection 2"
    },
    {
      src: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2026&q=80",
      alt: "Fashion Collection 3"
    },
    {
      src: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Fashion Collection 4"
    },
    {
      src: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80",
      alt: "Fashion Collection 5"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto slide chuyển ảnh tự động
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Chuyển ảnh mỗi 4 giây

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, images.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  return (
    <div className="bg-white p-4">
      <div className="w-full relative overflow-hidden rounded-lg shadow-lg">
        <div 
          className="relative w-full h-96 md:h-[800px]"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Container chứa tất cả ảnh */}
          <div 
            className="flex transition-transform duration-500 ease-in-out h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full h-full flex-shrink-0">
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Nút điều hướng trái */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Nút điều hướng phải */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Overlay gradient cho text đẹp hơn */}
          <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent via-50% to-transparent pointer-events-none"></div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-blue-600 h-1 transition-all duration-100 ease-linear"
            style={{ 
              width: isAutoPlaying ? `${((currentIndex + 1) / images.length) * 100}%` : '0%'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;