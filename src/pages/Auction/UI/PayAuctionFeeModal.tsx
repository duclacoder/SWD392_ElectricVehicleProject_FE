import { X, DollarSign, AlertCircle, Sparkles, Zap, ChevronRight, Gavel } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getAuctionFee } from "../../../features/Auction/AuctionFee";
import type { CreatePaymentRequest } from "../../../entities/Payment";
import { CreatePayment, VnPayPayment } from "../../../features/Payment";
import { message } from "antd";
import type { AuctionsFee } from "../../../entities/AuctionsFee";
import { auctionApi } from "../../../features/Auction";

type PayAuctionFeeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  auctionId: number;
};

export default function PayAuctionFeeModal({
  isOpen,
  onClose,
  auctionId,
}: PayAuctionFeeModalProps) {
  const [auctionFee, setAuctionFee] = useState<AuctionsFee | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [auctionDetail, setAuctionDetail] = useState<any | null>(null);


  useEffect(() => {
    if (isOpen && auctionId) {
      fetchAuctionFee();
    }
  }, [isOpen, auctionId]);

  const fetchAuctionFee = async () => {
    setLoading(true);
    setError(null);
    try {
      const fee = await getAuctionFee(auctionId);
      if (!fee) throw new Error("Auction fee not found");
      setAuctionFee({ ...fee, auctionsId: auctionId });

      const auction = await auctionApi.getAuctionById(auctionId);
      if (auction) {
      setAuctionDetail(auction);
    }
    } catch (err) {
      setError("Không thể tải thông tin phí đấu giá. Vui lòng thử lại.");
      console.error("Error fetching auction fee:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      sessionStorage.setItem("AuctionFee", JSON.stringify(auctionFee));
      const userId = localStorage.getItem("userId") || "";
      console.log(auctionFee?.auctionsFeeId);
      console.log(userId)

      const paymentRequestData: CreatePaymentRequest = {
        UserId: userId,
        AuctionsFeeId: auctionFee?.auctionsFeeId.toString() || "",
      }

      const result: boolean = await CreatePayment(paymentRequestData);
      if (result) {
        const vnpayUrl = await VnPayPayment(sessionStorage.getItem("paymentId") || "")
        if (vnpayUrl)
          window.open(vnpayUrl);
      }
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi mua gói!");
    }
    onClose();
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);

  if (!isOpen) return null;

  return (
    // Backdrop & Animation container (Sử dụng opacity/transition mượt)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 bg-black/30 dark:bg-black/70"
      style={{ opacity: isOpen ? 1 : 0 }}
      onClick={onClose}
    >

      {/* Modal - Light, Elegant, Soft Shadow */}
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-xl max-w-md w-full overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()} // Ngăn click backdrop khi click modal
      >

        {/* Decorative Top Bar: Subtle Blue/Gold Gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-sky-300 to-yellow-400 dark:from-blue-600 dark:via-sky-500 dark:to-amber-600" />

        {/* Header */}
        <div className="relative p-6 pt-8 dark:text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1.5 transition-all duration-200"
            aria-label="Đóng modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4 mb-2">
            {/* Icon Circle - Vibrant Blue Gradient */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-500 dark:from-blue-600 dark:to-sky-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/40 flex-shrink-0">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Thanh Toán Phí
              </h2>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                Tham gia Đấu Giá **VIP**
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-5 dark:text-white">
          {loading ? (
            // Loading State: Clean and Centered
            <div className="flex flex-col items-center justify-center py-10 bg-white dark:bg-gray-800">
              <div className="relative">
                <div className="w-14 h-14 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                <Sparkles className="w-5 h-5 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-3 text-gray-600 dark:text-gray-400 font-medium text-sm">
                Đang tải thông tin giao dịch...
              </p>
            </div>
          ) : error ? (
            // Error State: Soft Red Background
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-800 dark:text-red-300 font-bold mb-1">
                    Lỗi Kết Nối Dữ Liệu
                  </p>
                  <p className="text-red-600 dark:text-red-400 text-sm mb-4">
                    {error}
                  </p>
                  <button
                    onClick={fetchAuctionFee}
                    className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold transition-all shadow-md"
                  >
                    Thử lại ngay
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Transaction Detail Card: Sạch sẽ, Tối giản, White Space */}
              <div className="bg-white dark:bg-gray-700 rounded-xl p-5 border border-gray-200 dark:border-gray-700 space-y-4 shadow-inner">
                {/* Fee Per Minute (Detail) */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Phí mở phiên
                  </p>
                  <p className="text-base font-semibold text-gray-800 dark:text-gray-200">
                    {auctionFee?.entryFee ? formatPrice(auctionFee.entryFee) : '0'} VNĐ
                  </p>
                </div>

                {/* TOTAL AMOUNT - High Contrast, Blue Theme */}
                <div className="flex justify-between items-center pt-4 border-t border-dashed border-gray-300 dark:border-gray-600">
                  <p className="text-xl font-extrabold text-gray-800 dark:text-gray-200">
                    TỔNG CỘNG
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                      {auctionFee ? formatPrice(auctionFee.entryFee || 0) : "0"}
                    </p>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 ml-1.5">
                      VNĐ
                    </p>
                  </div>
                </div>

              </div>

              {/* Info Card - Light Amber/Gold Theme */}
              <div className="bg-yellow-50 dark:bg-gray-700 rounded-xl p-5 space-y-3 border border-yellow-200 dark:border-yellow-800/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                  <p className="text-yellow-800 dark:text-yellow-300 font-bold text-base">
                    Lưu Ý Quan Trọng
                  </p>
                </div>

                <ul className="text-yellow-800 dark:text-gray-300 text-sm space-y-2 ml-1">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>
                      <span className="font-bold text-orange-400">
                        Phí hoàn lại
                      </span>{" "}
                      sau khi{" "}
                      <span className="font-bold text-orange-400">
                        phiên đấu giá kết thúc
                      </span>{" "}
                      thành công.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Tham gia đấu giá{" "}
                      <span className="font-bold text-orange-400">
                        ngay lập tức
                      </span>{" "}
                      sau thanh toán.
                    </span>

                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-yellow-500 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span>
                      Sử dụng{" "}
                      <span className="font-bold text-orange-400">VNPAY</span>{" "}
                      để tối ưu tốc độ và an toàn giao dịch.
                    </span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer (Actions) */}
        {!loading && !error && (
          <div className="px-6 pb-6 pt-3 flex flex-col sm:flex-row gap-3">
            {/* Cancel Button: Secondary/Outline */}
            <button
              onClick={onClose}
              className="flex-1 w-full sm:w-auto px-5 py-3 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              <span className="text-white">Hủy</span>
            </button>

            {/* Pay Button: Primary Action - Bright Gradient */}
            <button
              onClick={handlePayment}
              className="flex-1 w-full sm:w-auto px-5 py-3 
                         bg-gradient-to-r from-blue-500 to-sky-500 
                         text-white font-extrabold text-base rounded-xl 
                         hover:from-blue-600 hover:to-sky-600 
                         transition-all duration-300 
                         shadow-lg shadow-blue-500/50 
                         hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!auctionFee}
            >
              <span className="text-white">Xác Nhận & Thanh Toán</span>
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        /* Giữ lại animation để đảm bảo tính mượt mà */
        .transition-opacity { transition: opacity 0.3s ease-in-out; }
        .transition-transform { transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); } /* Hiệu ứng springy nhẹ */
      `}</style>

    </div>
  );
}