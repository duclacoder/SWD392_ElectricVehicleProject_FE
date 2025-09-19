import { ChevronDown, Phone, User } from "lucide-react";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "../../features/AuthModal";
import logo from "../../shared/assets/logo.png";

export const Header: FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { name: "Mua xe", href: "/#" },
    { name: "Bán xe", href: "/#", hasDropdown: true },
    { name: "Thông tin & Sự kiện", href: "/#" },
  ];

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="logo" className="h-9 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          {navItems.map((item, index) => (
            <div key={index} className="relative group">
              <a
                href={item.href}
                className="flex items-center hover:text-blue-600 transition"
                onClick={(e) => {
                  if (item.hasDropdown) {
                    e.preventDefault();
                    setDropdownOpen(!dropdownOpen);
                  }
                }}
              >
                {item.name}
                {item.hasDropdown && (
                  <ChevronDown
                    className={`w-4 h-4 ml-1 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </a>
              {item.hasDropdown && dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute left-0 bg-white shadow-lg mt-2 rounded-md py-2 w-48 z-10"
                >
                  <a href="/#" className="block px-4 py-2 hover:bg-gray-100">
                    Sản phẩm
                  </a>
                  <a href="/#" className="block px-4 py-2 hover:bg-gray-100">
                    Dịch vụ
                  </a>
                </div>
              )}
            </div>
          ))}
          <a
            href="/#"
            className="flex items-center bg-blue-100 text-blue-600 font-semibold px-4 py-2 rounded-lg hover:bg-blue-200 transition"
          >
            Bán xe xăng - Lên xe điện
            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-md font-bold">
              MỚI
            </span>
          </a>
        </nav>

        <div className="flex items-center space-x-6">
          <Link to="/login" className="hidden md:flex items-center space-x-2">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium hover:text-blue-600 transition">
              Đăng nhập
            </span>
          </Link>

          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-gray-600" />
            <div className="text-right">
              <div className="text-sm text-gray-500">Hotline:</div>
              <div className="text-blue-600 font-bold">1800 0000</div>
            </div>
          </div>
        </div>
      </div>
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </header>
  );
};
