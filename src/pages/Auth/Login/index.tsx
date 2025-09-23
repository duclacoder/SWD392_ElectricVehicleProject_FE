import { Book, Car, Eye, EyeOff, Lock, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { LoginForm } from "../../../entities/Form";
import { Login } from "../../../features/Login";
import logo from "../../../shared/assets/logo.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const loginData: LoginForm = {
      email: email,
      password: password,
    };
    const result : boolean = await Login(loginData);
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
              Welcome Back!
            </h1>
            <p className="text-gray-600 text-sm">
              Please enter log in details below
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </div>
              <button
                onClick={() => console.log("Forgot password")}
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-sky-700 text-white py-3 px-4 rounded-lg hover:bg-sky-800 transition-colors duration-200 font-medium"
            >
              Log in
            </button>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">Or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm font-medium text-gray-700">Google</span>
            </button>

            <button className="w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                Facebook
              </span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={() => console.log("Sign up")}
              className="text-sky-600 hover:text-sky-700 font-medium"
            >
              Sign Up
            </button>
          </p>
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

export default LoginPage;
