import React, { useState } from "react";
import {
  HomeIcon,
  ShoppingBagIcon,
  ChevronRightIcon,
  BriefcaseIcon,
  TagIcon,
  ArrowPathIcon,
  BanknotesIcon
} from "@heroicons/react/24/outline";
import { useLocation, Link } from "react-router-dom";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const location = useLocation();
  const currentPath = location.pathname;
  const queryParams = new URLSearchParams(location.search);
  const currentStatus = queryParams.get("status") || "";
  const userName = localStorage.getItem('email');

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  // Helper function to check if a status link is active
  const isStatusActive = (status) => {
    return currentPath === "/order" && currentStatus === status;
  };

  const isStatusActiveReturns = (status) => {
    return currentPath === "/return-request-page" && currentStatus === status;
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg">
      <div className="h-full overflow-y-auto">
        {/* User Profile Section */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div>
              <h5 className="text-lg font-medium">
                <span className="font-normal">Chào,</span> Admin
              </h5>
              <p className="text-sm text-gray-600">{userName}</p>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <ul className="mt-4">
          {/* Tổng quan */}
          <li className="mb-2">
            <button
              onClick={() => toggleMenu("overview")}
              className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100"
            >
              <HomeIcon className="w-6 h-6 mr-3" />
              <span>Tổng quan</span>
              <ChevronRightIcon
                className={`w-4 h-4 ml-auto transform ${
                  openMenus["overview"] ? "rotate-90" : ""
                }`}
              />
            </button>
            {openMenus["overview"] && (
              <ul className="pl-10 text-sm text-gray-600">
                <Link
                    to="/income-page"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      currentPath === "/income-page"
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Thống kê doanh thu
                  </Link>
              </ul>
            )}
          </li>

          {/* Sản phẩm */}
          <li className="mt-4">
            <div className="px-3 text-xs font-semibold text-gray-500">
              Thông tin
            </div>
            <button
              onClick={() => toggleMenu("trips")}
              className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100"
            >
              <BriefcaseIcon className="w-6 h-6 mr-3" />
              <span>Sản phẩm</span>
              <ChevronRightIcon
                className={`w-4 h-4 ml-auto transform ${
                  openMenus["trips"] ? "rotate-90" : ""
                }`}
              />
            </button>
            {openMenus["trips"] && (
              <ul className="pl-10 text-sm text-gray-600">
                <li>
                  <Link
                    to="/category"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      currentPath === "/category"
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Danh sách danh mục
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      currentPath === "/product"
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Danh sách sản phẩm
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Đơn hàng */}
          <li className="mt-2">
            <button
              onClick={() => toggleMenu("orders")}
              className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100"
            >
              <ShoppingBagIcon className="w-6 h-6 mr-3" />
              <span>Đơn hàng</span>
              <ChevronRightIcon
                className={`w-4 h-4 ml-auto transform ${
                  openMenus["orders"] ? "rotate-90" : ""
                }`}
              />
            </button>
            {openMenus["orders"] && (
              <ul className="pl-10 text-sm text-gray-600">
                <li>
                  <Link
                    to="/order"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      currentPath === "/order" && !currentStatus
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Danh sách đơn hàng
                  </Link>
                </li>
                <li>
                  <Link
                    to="/order?status=CHO_XAC_NHAN"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      isStatusActive("CHO_XAC_NHAN")
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Chưa giải quyết
                  </Link>
                </li>
                <li>
                  <Link
                    to="/order?status=DA_XAC_NHAN"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      isStatusActive("DA_XAC_NHAN")
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Đã xác nhận
                  </Link>
                </li>
                <li>
                  <Link
                    to="/order?status=DANG_GIAO"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      isStatusActive("DANG_GIAO")
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Đang giao
                  </Link>
                </li>
                <li>
                  <Link
                    to="/order?status=DA_GIAO"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      isStatusActive("DA_GIAO")
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Đã giao
                  </Link>
                </li>
                <li>
                  <Link
                    to="/order?status=DA_HUY"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      isStatusActive("DA_HUY")
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Đã hủy
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Khuyến mãi */}
          <li className="mt-2">
            <button
              onClick={() => toggleMenu("promotions")}
              className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100"
            >
              <TagIcon className="w-6 h-6 mr-3" />
              <span>Khuyến mãi</span>
              <ChevronRightIcon
                className={`w-4 h-4 ml-auto transform ${
                  openMenus["promotions"] ? "rotate-90" : ""
                }`}
              />
            </button>
            {openMenus["promotions"] && (
              <ul className="pl-10 text-sm text-gray-600">
                <li>
                 <Link
                    to="/promotion-page"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      currentPath === "/promotion-page"
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Danh sách khuyến mãi
                  </Link>
                </li>
                <li>
                  <Link
                    to="/promotion-products"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      currentPath === "/promotion-products"
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Sản phẩm khuyến mãi
                  </Link>
                </li>
                <li>
                  <a href="#" className="block p-2 hover:bg-gray-100">
                    Khuyến mãi sắp hết hạn
                  </a>
                </li>
              </ul>
            )}
          </li>

          {/* Đơn hoàn trả */}
          <li className="mt-2">
            <button
              onClick={() => toggleMenu("returns")}
              className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100"
            >
              <ArrowPathIcon className="w-6 h-6 mr-3" />
              <span>Đơn hoàn trả</span>
              <ChevronRightIcon
                className={`w-4 h-4 ml-auto transform ${
                  openMenus["returns"] ? "rotate-90" : ""
                }`}
              />
            </button>
            {openMenus["returns"] && (
              <ul className="pl-10 text-sm text-gray-600">
                <li>
                 <Link
                    to="/return-request-page"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      currentPath === "/return-request-page"
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Danh sách đơn hoàn trả
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to="/return-request-page?trangThai=CHO_XAC_NHAN"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      isStatusActiveReturns("CHO_XAC_NHAN")
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Chưa giải quyết
                  </Link>
                </li>
                <li>
                  <a href="#" className="block p-2 hover:bg-gray-100">
                    Đã xác nhận
                  </a>
                </li> */}
              </ul>
            )}
          </li>

          {/* Hóa đơn */}
          <li className="mt-2">
            <button
              onClick={() => toggleMenu("bills")}
              className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100"
            >
              <BanknotesIcon className="w-6 h-6 mr-3" />
              <span>Hóa đơn</span>
              <ChevronRightIcon
                className={`w-4 h-4 ml-auto transform ${
                  openMenus["bills"] ? "rotate-90" : ""
                }`}
              />
            </button>
            {openMenus["bills"] && (
              <ul className="pl-10 text-sm text-gray-600">
                <li>
                 <Link
                    to="/bills"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      currentPath === "/bills"
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Danh sách hóa đơn
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Copyright Footer */}
          <div className="p-4 mt-4 border-t text-center text-sm text-gray-500">
            <p>© 2025 Bship. All Rights Reserved.</p>
            <p>Version 2.0.9</p>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;