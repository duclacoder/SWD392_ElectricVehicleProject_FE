import { HomeFilled } from "@ant-design/icons";
import { CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PostPackage } from "../../../entities/PostPackage";
import type { AuctionsFee } from "../../../entities/AuctionsFee";

const PaymentSuccess = () => {
  const [dataInfo, setDataInfo] = useState<PostPackage | AuctionsFee | undefined>(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedPackageStr = sessionStorage.getItem("selectedPackage");
      const storedAuctionFeeStr = sessionStorage.getItem("AuctionFee");

      if (storedPackageStr) {
        const storedPackage = JSON.parse(storedPackageStr) as PostPackage;
        setDataInfo(storedPackage);
        console.log("Selected Package Info:", storedPackage);
      } else if (storedAuctionFeeStr) {
        const storedAuctionFee = JSON.parse(storedAuctionFeeStr) as AuctionsFee;
        setDataInfo(storedAuctionFee);
        console.log("Auction Fee Info:", storedAuctionFee);
      }
    } catch (error) {
      console.error("Error loading package info:", error);
    }
  }, []);

const handleBacktoHome = () => { 
  if(dataInfo?.postPackageId) 
    navigate("/post"); 
  else if(dataInfo?.auctionId) 
    navigate(`/auction/${dataInfo?.auctionId}`);
  else 
    navigate("/");
  sessionStorage.clear(); 
};

  // Format ngày giờ
  const formatDate = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString("en-US", { month: "short" });
    const year = now.getFullYear();
    const time = now.toLocaleTimeString("en-US", { hour12: false });
    return `${day} ${month} ${year}, ${time}`;
  };

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
              <h1 className="text-4xl font-bold text-white mb-2">Payment Completed!</h1>
              <p className="text-green-50 text-lg">Your transaction has been processed successfully</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Transaction Summary */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-sky-700">Transaction Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 font-medium">Amount Paid</span>
                    <span className="text-2xl font-bold text-green-600">
                      {(typeof (dataInfo as any)?.postPrice === "number"
                        ? (dataInfo as any)?.postPrice
                        : (dataInfo as any)?.entryFee) || 0}{" "}
                      VND
                    </span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 font-medium flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Date & Time
                    </span>
                    <span className="text-gray-900 text-right">{formatDate()}</span>
                  </div>

                  <div className="bg-sky-50 rounded-lg p-4 mt-6">
                    <p className="text-sm font-semibold text-sky-900 mb-2">Infomation</p>
                    <p className="text-gray-800 font-medium text-lg">Mã giao dịch: {sessionStorage.getItem("paymentId")}</p>
                    <p className="text-gray-600 text-sm mt-2">Miêu tả: { (dataInfo as any)?.description || "-" }</p>
                  </div>
                </div>
              </div>

              {/* Package Information */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-sky-700">Information</h2>

                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div>
                    <p className="text-lg font-bold text-gray-900 mb-1">
                      {(dataInfo as any)?.packageName || `Mã phiên đấu giá: ${(dataInfo as any)?.auctionId || "-"}`}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        (dataInfo as any)?.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      Trạng thái: {(dataInfo as any)?.status || "-"}
                    </span>

                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm text-gray-600">Giá tiền thanh toán:</span>
                      <span className="text-lg font-bold text-sky-700">
                        {(typeof (dataInfo as any)?.postPrice === "number"
                          ? (dataInfo as any)?.postPrice
                          : (dataInfo as any)?.entryFee) || 0}{" "}
                        VND
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-sm text-amber-900">
                      <span className="font-semibold">Next Steps:</span> Chuyển hướng để tiếp tục
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action + Additional Info */}
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={handleBacktoHome}
                className="w-full bg-sky-600 hover:bg-sky-800 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <HomeFilled className="w-5 h-5" />
                Chuyển hướng
              </button>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  A confirmation email with all details has been sent to your registered email address.
                </p>
                <p className="text-xs text-gray-400 mt-2">Questions? Contact our support team 24/7 at support@evmanagement.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-6 text-center">
          <p className="text-white/90 text-sm">Thank you for choosing EV Management. We're excited to be part of your journey!</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
