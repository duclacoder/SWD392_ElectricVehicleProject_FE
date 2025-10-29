import { Book, Car, Lock, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../shared/assets/logo.png";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left Side - Auth Form */}
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

          {/* Content from children */}
          {children}
        </div>
      </div>

      {/* Right Side - Branding/Marketing */}
      <div className="w-1/2 bg-gradient-to-br from-sky-700 to-sky-900 flex items-center justify-center p-8 relative overflow-hidden">
        {/* Background geometric shapes */}
        <div className="absolute inset-0">
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
                <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto flex items-center justify-center">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <p className="text-xs text-white/80">Secure</p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 bg-rose-500 rounded-full mx-auto flex items-center justify-center">
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

export default AuthLayout;
