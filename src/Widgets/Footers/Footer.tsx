import { Facebook, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import type { FC } from "react";
import logo from "../../shared/assets/logo.png";
import { Navigate, useNavigate } from "react-router-dom";

const serviceLinks = [
  { name: "Mua xe", href: "/#" },
  { name: "Bán xe xăng - Lên xe điện", href: "/#", new: true },
  { name: "Tư vấn chọn xe", href: "/#" },
  { name: "FAQ", href: "/#" },
];

const interestLinks = [
  { name: "Báo giá xe cũ", href: "/#" },
  { name: "Sự kiện ưu đãi", href: "/#" },
];

const policyLinks = [
  { name: "Chính sách bảo mật thông tin cá nhân", href: "/#" },
  { name: "Chính sách hỗ trợ khách hàng", href: "/#" },
  { name: "Chính sách hỗ trợ sau bán hàng", href: "/#" },
  { name: "Chính sách kiểm định xe", href: "/#" },
  { name: "Chính sách thanh toán", href: "/#" },
  { name: "Quy chế hoạt động", href: "/#" },
];

const contactLinks = [
  {
    name: "1800 0000 (Miễn phí)",
    href: "tel:18000000",
    icon: <Phone size={16} />,
  },
  {
    name: "Tái Nổ Zalo",
    href: "/#",
    icon: <MessageCircle size={16} />,
  },
  {
    name: "Tái Nổ Fanpage",
    href: "/#",
    icon: <Facebook size={16} />,
  },
  {
    name: "Tái Nổ Linkedin",
    href: "/#",
    icon: <Linkedin size={16} />,
  },
  {
    name: "taino@gmail.com",
    href: "mailto:taino@gmail.com",
    icon: <Mail size={16} />,
  },
];

export const Footer: FC = () => {
  const navigate = useNavigate();
  return (
    <footer className="w-full bg-white text-gray-700 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <img src={logo} alt="logo" className="h-10 w-auto mb-4" />
            <h3 className="font-bold mb-2">Tài khoản</h3>
            <button onClick={() => navigate("/register")} className="bg-sky-500 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-sky-600 transition">
              <div className="text-white">Tạo tài khoản</div>
            </button>
          </div>

          <div>
            <h3 className="font-bold mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-sky-500 hover:underline flex items-center"
                  >
                    {link.name}
                    {link.new && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-sky-500 text-white rounded-md font-bold">
                        MỚI
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Được quan tâm</h3>
            <ul className="space-y-2">
              {interestLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-sky-500 hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Chính sách</h3>
            <ul className="space-y-2">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm hover:text-sky-500 hover:underline"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2">
            <h3 className="font-bold mb-4">Liên hệ chúng tôi</h3>
            <ul className="space-y-2 mb-6">
              {contactLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-sm text-sky-500 font-semibold hover:underline"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
            <h3 className="font-bold mb-2">Nhận thông tin mới nhất</h3>
            <form className="flex">
              <input
                type="email"
                placeholder="Nhập email..."
                className="border border-gray-300 rounded-l-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-sky-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-sky-500 p-2 text-white font-semibold text-sm px-4 rounded-r-md hover:bg-sky-600 transition"
                onClick={() => navigate("/register")}
              >
                <div className="text-white">Tạo tài khoản</div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};
