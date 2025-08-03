import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useCategoryStore from "../hooks/useCategoryStore";
import useScrollVisibility from "./ScrollVisibility";
import { slugify } from "../utils/slugify";

const Menu = () => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("TRANG CHỦ");
  const [hoverGender, setHoverGender] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const { categories } = useCategoryStore(hoverGender);
  const isHeaderVisible = useScrollVisibility(80);
  const timeoutRef = useRef(null);

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

  const handleCategoryClick = (cat) => {
    setShowPopup(false);
    const slug = slugify(cat.tendm);
    navigate(`/category/${slug}-${cat.maDanhMuc}`);
  };

  const handleMouseEnter = (item) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (item.label === "NAM") {
      setHoverGender("Nam");
      setShowPopup(true);
    } else if (item.label === "NỮ") {
      setHoverGender("Nu");
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 200);
  };

  const handlePopupMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handlePopupMouseLeave = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav
      className={`fixed w-full bg-white shadow-md border-b border-pink-100/50 z-[999] transition-transform duration-300 ${
        isHeaderVisible ? "top-[76px] translate-y-0" : "top-0 -translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center py-4">
          <div className="flex space-x-8">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={handleMouseLeave}
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
                  {(item.label === "NAM" || item.label === "NỮ") && (
                    <svg
                      className="w-4 h-4 ml-2 inline-block transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{
                        transform: showPopup && 
                          ((hoverGender === "Nam" && item.label === "NAM") ||
                           (hoverGender === "Nu" && item.label === "NỮ")) 
                          ? "rotate(180deg)" : "rotate(0deg)"
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {showPopup &&
                  ((hoverGender === "Nam" && item.label === "NAM") ||
                    (hoverGender === "Nu" && item.label === "NỮ")) &&
                  categories.length > 0 && (
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-white shadow-2xl rounded-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
                      onMouseEnter={handlePopupMouseEnter}
                      onMouseLeave={handlePopupMouseLeave}
                    >
                      {/* Header của popup */}
                      <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-800 flex items-center">
                          <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                          Danh mục {item.label.toLowerCase()}
                        </h3>
                      </div>

                      {/* Danh sách categories */}
                      <div className="max-h-80 overflow-y-auto">
                        <ul className="py-2">
                          {categories.map((cat, catIndex) => (
                            <li
                              key={cat.maDanhMuc}
                              className="group relative"
                            >
                              <button
                                onClick={() => handleCategoryClick(cat)}
                                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:text-pink-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 transition-all duration-200 flex items-center justify-between group"
                              >
                                <span className="font-medium">{cat.tendm}</span>
                                <svg
                                  className="w-4 h-4 text-gray-400 group-hover:text-pink-500 transform group-hover:translate-x-1 transition-all duration-200"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                              {catIndex < categories.length - 1 && (
                                <div className="mx-4 border-b border-gray-100"></div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Footer của popup */}
                      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500 text-center">
                          {categories.length} danh mục có sẵn
                        </p>
                      </div>

                      {/* Mũi tên chỉ lên */}
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-4 h-4 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                      </div>
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