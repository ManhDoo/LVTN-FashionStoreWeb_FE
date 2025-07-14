import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCategoryStore from "../hooks/useCategoryStore";

const Menu = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("TRANG CHỦ");
  const [hoverGender, setHoverGender] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const { categories } = useCategoryStore(hoverGender);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);

  const menuItems = [
    { label: "TRANG CHỦ", path: "/" },
    { label: "NAM", path: null },
    { label: "NỮ", path: null },
    { label: "KHUYẾN MÃI", path: "/promotion" },
  ];

  const handleMenuClick = (item) => {
    if (item.label === "NAM" || item.label === "NỮ") return;
    setActiveItem(item.label);
    navigate(item.path);
  };

  const handleCategoryClick = (maDanhMuc) => {
    setShowPopup(false);
    navigate(`/all/${maDanhMuc}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Cuộn xuống
        setIsHeaderVisible(false);
      } else {
        // Cuộn lên
        setIsHeaderVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full bg-white shadow-md border-b border-pink-100/50 mt-19 z-99 ${
        isHeaderVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
       {/* <nav
      className="absolute w-full bg-white shadow-md border-b border-pink-100/50 mt-19 z-99"
    > */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-4">
          <div className="flex space-x-8">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => {
                  if (item.label === "NAM") {
                    setHoverGender("Nam");
                    setShowPopup(true);
                  } else if (item.label === "NỮ") {
                    setHoverGender("Nu");
                    setShowPopup(true);
                  } else {
                    setShowPopup(false);
                  }
                }}
                onMouseLeave={() => setShowPopup(false)}
              >
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                    activeItem === item.label
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg"
                      : "text-gray-700 hover:text-pink-600 hover:bg-white/60 hover:shadow-md"
                  }`}
                >
                  {item.label}
                </button>

                {showPopup &&
                  ((hoverGender === "Nam" && item.label === "NAM") ||
                    (hoverGender === "Nu" && item.label === "NỮ")) &&
                  categories.length > 0 && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-44 bg-white shadow-lg rounded-md border border-gray-200 z-50">
                      <ul className="py-2 px-3 space-y-1">
                        {categories.map((cat) => (
                          <li
                            key={cat.maDanhMuc}
                            className="hover:text-pink-600 cursor-pointer text-sm"
                            onClick={() => handleCategoryClick(cat.maDanhMuc)}
                          >
                            {cat.tendm}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
