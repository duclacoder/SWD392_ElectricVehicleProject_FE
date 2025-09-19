import React, { useState } from "react";
import logo from "../../../shared/assets/logo.png";

const Register: React.FC = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            alert("Mật khẩu xác nhận không khớp!");
            return;
        }
        console.log("Dữ liệu đăng ký:", form);
        alert("Đăng ký thành công 🎉");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-green-50">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
                {/* Logo + Title */}
                <div className="flex flex-col items-center mb-6">
                    <img src={logo} alt="Logo" className="h-12 mb-2" />
                    <h1 className="text-2xl font-bold text-gray-800">Đăng ký tài khoản</h1>
                    <p className="text-gray-500 text-sm">Tạo tài khoản để tiếp tục</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium text-sm mb-1">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                            placeholder="Nhập họ và tên"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium text-sm mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                            placeholder="Nhập email"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium text-sm mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium text-sm mb-1">
                            Xác nhận mật khẩu
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 focus:outline-none"
                            placeholder="Nhập lại mật khẩu"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-sky-600 text-white font-semibold py-2 rounded-lg hover:bg-sky-700 transition"
                    >
                        Đăng ký
                    </button>
                </form>

                {/* Footer */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Đã có tài khoản?{" "}
                    <a
                        href="http://localhost:5174/login"
                        className="text-sky-600 font-medium hover:underline"
                    >
                        Đăng nhập ngay
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
