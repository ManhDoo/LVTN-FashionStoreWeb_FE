import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Heart,
  ArrowRight
} from 'lucide-react';
import logo from "../../assets/images/logoStore.png";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-6">
                
                
                <img className="h-20 w-auto" src={logo} alt="" />
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Thời trang hiện đại dành cho mọi người. Chúng tôi mang đến những sản phẩm chất lượng cao với thiết kế độc đáo và phong cách riêng biệt.
              </p>
              
              {/* Social Media */}
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, color: 'hover:text-blue-400' },
                  { icon: Instagram, color: 'hover:text-pink-400' },
                  { icon: Twitter, color: 'hover:text-blue-300' },
                  { icon: Youtube, color: 'hover:text-red-400' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center transition-all duration-300 ${social.color} hover:bg-slate-600 hover:scale-110`}
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Liên kết nhanh</h4>
              <ul className="space-y-3">
                {[
                  { text: 'Trang chủ', href: '/' },
                  { text: 'Sản phẩm Nam', href: '/all/FOR MAN' },
                  { text: 'Sản phẩm Nữ', href: '/all/FOR WOMEN' },
                  { text: 'Bộ sưu tập mới', href: '/new-collection' },
                  { text: 'Giỏ hàng', href: '/cart' },
                  { text: 'Về chúng tôi', href: '/about' }
                ].map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Dịch vụ khách hàng</h4>
              <ul className="space-y-3">
                {[
                  'Hướng dẫn mua hàng',
                  'Chính sách đổi trả',
                  'Chính sách bảo hành',
                  'Câu hỏi thường gặp',
                  'Hỗ trợ khách hàng',
                  'Tuyển dụng'
                ].map((item, index) => (
                  <li key={index}>
                    <a 
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group"
                    >
                      <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Thông tin liên hệ</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <MapPin size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      123 Lê Lợi, Quận 1<br />
                      TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Phone size={16} className="text-white" />
                  </div>
                  <p className="text-gray-300 text-sm">0123 456 789</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Mail size={16} className="text-white" />
                  </div>
                  <p className="text-gray-300 text-sm">fashion@example.com</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <Clock size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm">
                      Thứ 2 - Thứ 6: 8:00 - 22:00<br />
                      Thứ 7 - CN: 9:00 - 21:00
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h4 className="text-lg font-semibold text-white mb-2">Đăng ký nhận tin tức</h4>
                <p className="text-gray-300 text-sm">Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt</p>
              </div>
              <div className="flex w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Nhập email của bạn..."
                  className="flex-1 md:w-64 px-4 py-2 bg-slate-700 border border-slate-600 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors duration-200"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-r-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Fashion Store. Tất cả quyền được bảo lưu.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Điều khoản sử dụng
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Chính sách bảo mật
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;