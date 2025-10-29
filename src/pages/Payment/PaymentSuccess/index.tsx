import { HomeFilled } from "@ant-design/icons";
import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PostPackage } from "../../../entities/PostPackage";

const PaymentSuccess = () => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [packageInfo, setPackageInfo] = useState<PostPackage>();

  const navigate = useNavigate();

  const handleBacktoHome = () => {
    sessionStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    try {
      const storedPackage = JSON.parse(
        sessionStorage.getItem("selectedPackage") || ""
      ) as PostPackage;
      if (storedPackage) {
        setPackageInfo(storedPackage);
        console.log("Selected Package Info:", storedPackage);
      }
    } catch (error) {
      console.error("Error loading package info:", error);
    }
  }, []);

  // Format ngày giờ
  const formatDate = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear();
    const time = now.toLocaleTimeString("en-US", { hour12: false });
    return `${day} ${month} ${year}, ${time}`;
  };

  if (!packageInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-700 to-sky-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-700 to-sky-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-full"></div>
        <div className="absolute bottom-40 right-32 w-24 h-24 border border-white/10 rounded-lg transform rotate-45"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 border border-white/10 rounded-lg transform -rotate-12"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10"></div>
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Payment Completed!
              </h1>
              <p className="text-green-50 text-lg">
                Your transaction has been processed successfully
              </p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Transaction Summary */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-sky-700">
                  Transaction Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 font-medium">
                      Amount Paid
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {packageInfo.postPrice + " VND"}
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Date & Time
                    </span>
                    <span className="text-gray-900 text-right">
                      {formatDate()}
                    </span>
                  </div>

                  <div className="bg-sky-50 rounded-lg p-4 mt-6">
                    <p className="text-sm font-semibold text-sky-900 mb-2">
                      Package Details
                    </p>
                    <p className="text-gray-800 font-medium text-lg">
                      {packageInfo.packageName}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      {packageInfo.description}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      Thời hạn: {packageInfo.postDuration} ngày
                    </p>
                  </div>
                </div>
              </div>

              {/* Package Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-sky-700">
                  Package Information
                </h2>

                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div>
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      {packageInfo.packageName}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        packageInfo.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {packageInfo.status}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Package ID:</span>
                      <span className="text-sm font-mono bg-gray-200 px-2 py-1 rounded">
                        #{packageInfo.postPackageId}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Duration:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {packageInfo.postDuration} days
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Currency:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {packageInfo.currency}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price:</span>
                      <span className="text-lg font-bold text-sky-700">
                        {packageInfo.postPrice + " VND"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-900">
                    <span className="font-semibold">Next Steps:</span> Your post
                    will be activated within 24 hours. You can manage your posts
                    from the dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t text-white border-gray-200">
              <button
                onClick={handleBacktoHome}
                className="flex-1 bg-sky-600 hover:bg-sky-800 font-semibold py-4 rounded-xl transition-all transform flex items-center justify-center gap-2"
              >
                <HomeFilled className="w-5 h-5" />
                Back to home
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                A confirmation email with all details has been sent to your
                registered email address.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Questions? Contact our support team 24/7 at
                support@evmanagement.com
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-6 text-center">
          <p className="text-white/90 text-sm">
            Thank you for choosing EV Management. We're excited to be part of
            your journey!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
