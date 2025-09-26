import { Book, Car, Eye, EyeOff, Lock, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { LoginForm } from "../../../entities/Form";
import { Login } from "../../../features/Login";
import logo from "../../../shared/assets/logo.png";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const loginData: LoginForm = {
      email: email,
      password: password,
    };
    const result: boolean = await Login(loginData);
    if (result) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Side - Login Form */}
      <div className="w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center mb-8">
            <div className="rounded-full flex items-center justify-center mr-2">
              <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
            </div>
            <span className="text-xl font-bold text-gray-800">
              EV Management
            </span>
          </Link>

          {/* Welcome Text */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Wellcome!
            </h1>
            <p className="text-gray-600 text-sm">
              Please enter register details below
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div>
              <div className="block text-gray-700 text-sm font-medium mb-2">
                Email
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your mail"
                className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
                
              />
            </div>

            <div>
              <div className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <div className="block text-gray-700 text-sm font-medium mb-2">
                Confirm password
              </div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLogin();
                }
              }}
              className="w-full bg-sky-700 px-4 rounded-lg hover:bg-sky-800 transition-colors duration-200 font-medium"
            >
              <p className="text-white pt-3">Register</p>
            </button>
          </div>          
        </div>
      </div>

      {/* Right Side - Inventory Management */}
      <div className="w-1/2 bg-gradient-to-br from-sky-700 to-sky-900 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Road and Background Elements */}
        <div className="absolute inset-0">
          {/* Background geometric shapes representing system efficiency */}
          <div className="absolute top-10 left-10 w-16 h-16 border-2 border-white/20 rounded-lg transform rotate-12 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-12 h-12 border-2 border-white/20 rounded-lg transform -rotate-6"></div>
          <div className="absolute bottom-32 left-16 w-8 h-8 bg-white/10 rounded-full"></div>
          <div className="absolute top-1/2 right-10 w-20 h-20 border-2 border-white/20 rounded-full transform -rotate-12"></div>
        </div>

        <div className="relative z-10 text-white max-w-md text-center">
          <h2 className="text-3xl font-bold mb-4">Car Trading Platform</h2>
          <p className="text-sky-100 mb-8 leading-relaxed">
            Join our platform to buy and sell cars efficiently, connect with
            dealers, and find your perfect vehicle.
          </p>

          {/* Animated Car System Representation */}
          <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            {/* Car Animation Container */}
            <Car
              className="w-16 h-16 text-white mx-auto mb-4"
              style={{ animation: "carMove 2s ease-in-out infinite" }}
            />

            {/* System Status Indicators */}
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                </div>
                <p className="text-xs text-white/80">Online</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-white/80">Trading</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto flex items-center justify-center ">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-white/80">Secure</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-rose-500 rounded-full mx-auto flex items-center justify-center ">
                  <Book className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-white/80">Auction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
