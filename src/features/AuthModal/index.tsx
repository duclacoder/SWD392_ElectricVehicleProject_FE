import { Eye, EyeOff, X } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: FC<AuthModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState("register");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const activeTabStyle = "bg-white text-sky-500 shadow-sm";
  const inactiveTabStyle = "bg-transparent text-gray-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-xs">
      <div className="relative bg-white p-8 rounded-2xl shadow-xl w-full max-w-md mx-4">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Chào mừng bạn đến với TáiNổ
        </h2>

        <div className="flex w-full p-1 mb-6 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-2 font-semibold transition rounded-md ${
              activeTab === "register" ? activeTabStyle : inactiveTabStyle
            }`}
          >
            Tạo tài khoản
          </button>
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-2 font-semibold transition rounded-md ${
              activeTab === "login" ? activeTabStyle : inactiveTabStyle
            }`}
          >
            Đăng nhập
          </button>
        </div>

        {activeTab === "login" ? (
          <form className="space-y-5">
            <div>
              <label className="block text-gray-800 font-semibold text-sm mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-400 focus:outline-none placeholder:text-gray-400"
                placeholder="Nhập số điện thoại của bạn"
                required
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold text-sm mb-2">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-400 focus:outline-none pr-10 placeholder:text-gray-400"
                  placeholder="Nhập mật khẩu của bạn"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                className="text-gray-800 font-semibold text-sm hover:text-sky-500"
              >
                Quên mật khẩu?
              </button>
              <button
                type="submit"
                className="bg-sky-500 text-white font-semibold py-3 px-8 rounded-lg hover:bg-sky-600 transition"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        ) : (
          <form className="space-y-5">
            <div>
              <label className="block text-gray-800 font-semibold text-sm mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border-gray-300 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-400 focus:outline-none placeholder:text-gray-400"
                placeholder="Nhập số điện thoại của bạn"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-500 text-white font-semibold py-3 rounded-lg hover:bg-sky-600 transition mt-2"
            >
              Tiếp tục
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
