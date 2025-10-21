import { ReloadOutlined } from "@ant-design/icons";
import { message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RegisterForm } from "../../../../entities/Form";
import {
  confirm_OTP_Register,
  resend_OTP,
} from "../../../../features/Register";
import AuthLayout from "../../../../Widgets/Layouts/Auth";

const ConfirmOTPPage: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  const registerData = JSON.parse(
    sessionStorage.getItem("registerData") || "{}"
  ) as RegisterForm;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  useEffect(() => {
    const otpString = otp.join("");
    if (otpString.length === 6 && !isLoading) {
      handleSubmitOTP(otpString);
    }
  }, [otp]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d$/.test(value) && value !== "") return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const pastedOtp = text.replace(/\D/g, "").slice(0, 6).split("");
        const newOtp = ["", "", "", "", "", ""];
        pastedOtp.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);

        const lastIndex = Math.min(pastedOtp.length, 5);
        setTimeout(() => inputRefs.current[lastIndex]?.focus(), 0);
      });
    }

    // Handle arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmitOTP = async (otpString: string) => {
    if (otpString.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result: boolean = await confirm_OTP_Register(
        registerData,
        otpString
      );
      if (result) {
        navigate("/login");
        sessionStorage.clear();
        message.success(
          "Tài khoản của bạn đã được tạo thành công! Vui lòng đăng nhập."
        );
      } else {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        setError("Mã OTP không đúng. Vui lòng thử lại.");
      }
    } catch (error: any) {
      setError(error.message || "Mã OTP không đúng. Vui lòng thử lại.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const result: boolean = await resend_OTP(registerData.email);
      if (result) {
        message.success("Mã OTP đã được gửi lại đến email của bạn.");
        setCountdown(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError("Không thể gửi lại OTP. Vui lòng thử lại.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      setError(error.message || "Không thể gửi lại OTP. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  // Format countdown display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Mask email for display

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-500  rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Xác thực OTP
          </h1>
          <p className="text-gray-600 text-sm">
            Chúng tôi đã gửi mã xác thực đến
          </p>
          {registerData.email && (
            <p className="text-sky-600 font-medium text-sm mt-1">
              {registerData.email}
            </p>
          )}
        </div>

        {/* OTP Input Fields */}
        <div className="mb-8">
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <div key={index} className="relative">
                <input
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  className={`
                    w-12 h-14 text-center text-lg font-bold border-2 rounded-xl
                    transition-all duration-200 outline-none
                    ${
                      error
                        ? "border-red-400 bg-red-50 text-red-600 animate-shake"
                        : digit
                        ? "border-sky-500 bg-blue-50 text-sky-700 shadow-lg scale-105"
                        : "border-gray-300 bg-white hover:border-gray-400 focus:border-sky-500 focus:bg-blue-50"
                    }
                    ${
                      isLoading
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                  disabled={isLoading}
                  autoComplete="one-time-code"
                />
                {digit && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                )}
              </div>
            ))}
          </div>

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center justify-center text-sky-600 text-sm mb-4">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-sky-600 border-t-transparent mr-2"></div>
              Đang xác thực...
            </div>
          )}

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
            <div
              className="bg-sky-500 h-1 rounded-full transition-all duration-300"
              style={{
                width: `${(otp.filter((digit) => digit).length / 6) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Timer and Resend */}
        <div className="text-center mb-8">
          {countdown > 0 ? (
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">Mã có hiệu lực trong</p>
              <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
                <svg
                  className="w-4 h-4 text-gray-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-mono font-bold text-lg text-gray-700">
                  {formatTime(countdown)}
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl mb-4">
              <p className="text-rose-800 font-bold text-lg mb-3">
                Mã OTP đã hết hạn
              </p>
              <button
                onClick={handleResendOTP}
                disabled={isLoading}
                className="inline-flex items-center px-8 py-3 bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ReloadOutlined className="mr-2 invert" />
                <span className="text-white ">Gửi lại mã OTP</span>
              </button>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center space-y-3 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center text-xs text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Mã sẽ tự động xác thực khi nhập đủ 6 số
          </div>
          <p className="text-xs text-gray-500">
            Không nhận được mã? Kiểm tra hộp thư spam của bạn
          </p>

          {/* Back to login link */}
          <button
            onClick={() => navigate("/login")}
            className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
          >
            ← Quay lại đăng nhập
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </AuthLayout>
  );
};

export default ConfirmOTPPage;
