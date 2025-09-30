import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginForm, RegisterForm } from "../../../entities/Form";
import { Login } from "../../../features/Login";
import AuthLayout from "../../../Widgets/Layouts/Auth";
import { register } from "../../../features/Register";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    const registerData: RegisterForm = {
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };
    sessionStorage.setItem("registerData", JSON.stringify(registerData));        
    if(await register(registerData))
      navigate("/otp-confirm");
  };

  return (
    <AuthLayout>
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
          onClick={handleRegister}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleRegister();
            }
          }}
          className="w-full bg-sky-700 px-4 rounded-lg hover:bg-sky-800 transition-colors duration-200 font-medium"
        >
          <p className="text-white pt-3">Register</p>
        </button>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
