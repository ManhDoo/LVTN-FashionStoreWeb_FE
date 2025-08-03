import React, { useState, useEffect } from "react";
import {
  HomeIcon,
  ShoppingBagIcon,
  ChevronRightIcon,
  BriefcaseIcon,
  TagIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ChatBubbleBottomCenterTextIcon
} from "@heroicons/react/24/outline";
import { useLocation, Link } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const [newOrderCount, setNewOrderCount] = useState(0);
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

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");
    const stompClient = Stomp.over(socket);

    // Thêm xử lý lỗi khi kết nối
    stompClient.connect(
      {},
      (frame) => {
        // console.log("Connected: " + frame);
        // Subscribe chỉ khi kết nối thành công
        stompClient.subscribe("/topic/newOrder", (message) => {
          const orderId = message.body;
          // console.log("New order received: ", orderId);
          setNewOrderCount((prev) => prev + 1);
        });
      },
      (error) => {
        console.error("WebSocket connection error: ", error);
        // Có thể hiển thị thông báo lỗi cho người dùng nếu cần
      }
    );

    // Cleanup khi component unmount
    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log("Disconnected from WebSocket");
        });
      }
    };
  }, []);

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
                <li>
                  <Link
                    to="/product-deleted"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      currentPath === "/product-deleted"
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Sản phẩm đã xóa
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
              {newOrderCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {newOrderCount}
                </span>
              )}
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
                    {newOrderCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                        {newOrderCount}
                      </span>
                    )}
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

          {/* Đánh giá */}
          <li className="mt-2">
            <button
              onClick={() => toggleMenu("reviews")}
              className="flex items-center w-full p-3 text-gray-700 hover:bg-gray-100"
            >
              <ChatBubbleBottomCenterTextIcon className="w-6 h-6 mr-3" />
              <span>Đánh giá</span>
              <ChevronRightIcon
                className={`w-4 h-4 ml-auto transform ${
                  openMenus["reviews"] ? "rotate-90" : ""
                }`}
              />
            </button>
            {openMenus["reviews"] && (
              <ul className="pl-10 text-sm text-gray-600">
                <li>
                 <Link
                    to="/review-page"
                    className={`block p-2 rounded hover:bg-gray-100 ${
                      currentPath === "/review-page"
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : ""
                    }`}
                  >
                    Đánh giá chưa duyệt
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