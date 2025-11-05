import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { GoogleLoginForm, LoginForm } from "../../../entities/Form";
import { Login, LoginGoogle } from "../../../features/Login";
import AuthLayout from "../../../Widgets/Layouts/Auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // <-- loading state
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const loginData: LoginForm = {
        email: email,
        password: password,
      };
      const result: boolean = await Login(loginData);
      if (result) {
        if (localStorage.getItem("role") === "Admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      // If navigation happened the component will unmount, but in case of failure reset loading
      setIsLoading(false);
    }
  };

  const handleLoginGoogle = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      if (credentialResponse?.credential)
        sessionStorage.setItem("tokenId", credentialResponse.credential);

      const googleLoginData: GoogleLoginForm = {
        tokenId: credentialResponse?.credential || "",
        password: "12345678",
        confirmPassword: "12345678",
      };
      const result: boolean = await LoginGoogle(googleLoginData);
      if (result) {
        sessionStorage.clear();
        navigate("/");
      } else {
        console.log(credentialResponse);
        navigate("/google-info");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Welcome Text */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
        <p className="text-gray-600 text-sm">Please enter log in details below</p>
      </div>

      {/* Login Form */}
      <form
        onSubmit={async (e) => {
          e.preventDefault(); // tránh reload page
          if (isLoading) return; // tránh submit nhiều lần
          await handleLogin();
        }}
        className="space-y-6"
      >
        {/* Email */}
        <div>
          <div className="block text-gray-700 text-sm font-medium mb-2">Email</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your mail"
            disabled={isLoading}
            className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Password */}
        <div>
          <div className="block text-gray-700 text-sm font-medium mb-2">Password</div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
              className="w-full px-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Remember me + forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 text-sky-600 border-gray-300 rounded focus:ring-sky-500"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </div>
          <button
            type="button"
            onClick={() => console.log("Forgot password")}
            className="text-sm text-sky-600 hover:text-sky-700"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center bg-sky-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-sky-800"
          }`}
        >
          {/* simple inline spinner */}
          {isLoading && (
            <svg
              className="animate-spin h-4 w-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}

          <span className="text-sm text-white">{isLoading ? "Logging in..." : "Log In"}</span>
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="px-4 text-sm text-gray-500">Or</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Social Login */}
      <div className="space-y-3">
        {/* while loading we make the google button look disabled */}
        <div className={isLoading ? "pointer-events-none opacity-60" : ""}>
          <GoogleLogin onSuccess={handleLoginGoogle} onError={() => console.error("Google login failed")} />
        </div>

        <button
          className={`w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-lg transition-colors duration-200 ${
            isLoading ? "pointer-events-none opacity-60" : "hover:bg-gray-50"
          }`}
        >
          <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Facebook</span>
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/register" className="text-sky-600 hover:text-sky-700 font-medium">
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
