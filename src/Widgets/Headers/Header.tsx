import { ChevronDown, LogOut, Phone, Settings, User } from "lucide-react";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthModal from "../../features/AuthModal";
import { Logout } from "../../features/Logout";
import logo from "../../shared/assets/logo.png";

export const Header: FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [userImageUrl, setUserImageUrl] = useState(
    localStorage.getItem("imageUrl") || null
  );

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
    { name: "Mua xe", href: "/auction" },
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

        <div className="flex items-center space-x-2">
          <Phone className="w-5 h-5 text-gray-600" />
          <div className="text-right">
            <div className="text-sm text-gray-500">Hotline:</div>
            <div className="text-blue-600 font-bold">1800 0000</div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {!token && (
            <Link to="/login" className="hidden md:flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700 font-medium hover:text-blue-600 transition">
                Đăng nhập
              </span>
            </Link>
          )}

          {token && (
            <div>
              {/* Avatar Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                <div className="relative">
                  {userImageUrl ? (
                    <img
                      src={localStorage.getItem("imageUrl") || ""}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute right-10 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      {userImageUrl ? (
                        <img
                          src={localStorage.getItem("imageUrl") || ""}
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                        />
                      ) : (
                        <User className="w-8 h-8 text-gray-400" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Xin chào, {localStorage.getItem("userName")}!
                        </p>
                        <p className="text-xs text-gray-500">
                          Chào mừng bạn trở lại
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                      <Link to="/profile" className="flex items-center mb-8">
                        <User className="w-4 h-4 mr-3 text-gray-400" />
                        Hồ sơ cá nhân
                      </Link>
                    </button>

                    <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                      <Settings className="w-4 h-4 mr-3 text-gray-400" />
                      Cài đặt
                    </button>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 my-1"></div>

                  {/* Logout */}
                  <button
                    onClick={Logout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </header>
  );
};
