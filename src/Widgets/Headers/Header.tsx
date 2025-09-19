import type { FC } from "react";
import { useState, useRef, useEffect } from "react";
import logo from "../../shared/assets/logo.png";
import { Link } from "react-router-dom";


export const Header: FC = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <header className="w-full shadow-md bg-blue-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <img src={logo} alt="Logo" className="h-8 w-auto" />
                    <span className="text-xl font-bold text-gray-800">EVCMS</span>
                </div>

                {/* Navigation */}
                <nav className="flex items-center space-x-6 text-gray-700 font-medium">
                    <a href="#" className="hover:text-blue-600 transition">
                        Trang chủ
                    </a>
                    <a href="#" className="hover:text-blue-600 transition">
                        Bán xe
                    </a>
                    <a href="#" className="hover:text-blue-600 transition">
                        Mua xe
                    </a>
                    <a href="#" className="hover:text-blue-600 transition">
                        Đăng tin bán xe
                    </a>
                    <div className="relative">
                        <button className="hover:text-sky-600">Thông tin & sự kiện ▾</button>
                        <div className="absolute hidden group-hover:block bg-white shadow-lg mt-2 rounded-md py-2 w-48">
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                                Tin tức
                            </a>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                                Sự kiện
                            </a>
                        </div>
                    </div>
                </nav>

                {/* Account + Hotline */}
                <div className="flex items-center space-x-6">
                    {/* Dropdown Account */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setOpen(!open)}
                            className="flex items-center space-x-1 border rounded px-3 py-1 bg-white hover:bg-gray-50 shadow-sm"
                        >
                            <span>Tài khoản ▾</span>
                        </button>
                        {open && (
                            <div className="absolute right-0 bg-white shadow-lg mt-2 rounded-md py-2 w-40 border border-gray-200 z-50">
                                <Link
                                    to="/login"
                                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                                >
                                    Đăng nhập
                                </Link>

                                <Link
                                    to="/Register"
                                    className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Hotline */}
                    <div className="text-right">
                        <div className="text-sm text-gray-500">Hotline:</div>
                        <div className="text-sky-600 font-bold">1800 000 000</div>
                    </div>
                </div>
            </div>
        </header>
    );
};
