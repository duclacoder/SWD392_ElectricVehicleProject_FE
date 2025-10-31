import { X, DollarSign, AlertCircle, Sparkles } from "lucide-react";
import React, { useEffect, useState } from "react";
import { getAuctionFee } from "../../../features/Auction/AuctionFee";
import type { CreatePaymentRequest } from "../../../entities/Payment";
import { CreatePayment, VnPayPayment } from "../../../features/Payment";
import { message } from "antd";
import type { AuctionsFee } from "../../../entities/AuctionsFee";


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

      setAuctionFee({ ...fee, auctionId });
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
        const paymentRequestData : CreatePaymentRequest = {
            UserId: userId,
            AuctionsFeeId: auctionFee?.auctionsFeeId.toString() || "",
        }
        const result : boolean = await CreatePayment(paymentRequestData);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-scaleIn">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        {/* Header */}
        <div className="relative px-6 pt-8 pb-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Thanh toán phí
              </h2>
              <p className="text-sm text-gray-500">Tham gia đấu giá</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-4 text-gray-600 font-medium">
                Đang tải thông tin...
              </p>
            </div>
          ) : error ? (
            <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-red-900 font-bold mb-1">Có lỗi xảy ra</p>
                  <p className="text-red-700 text-sm mb-3">{error}</p>
                  <button
                    onClick={fetchAuctionFee}
                    className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium transition-all"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Auction ID Card */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Mã phiên đấu giá
                </p>
                <p className="text-2xl font-bold text-gray-900">#{auctionId}</p>
              </div>

              {/* Fee Amount Card */}
              <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />

                <div className="relative">
                  <p className="text-blue-100 text-sm font-medium mb-2">
                    Phí tham gia đấu giá
                  </p>
                  <p className="text-4xl font-bold text-white mb-1">
                    {auctionFee ? formatPrice(auctionFee.entryFee || 0) : "0"}
                  </p>
                  <p className="text-blue-100 text-lg font-medium">VNĐ</p>
                </div>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-2xl p-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-amber-900 font-bold mb-2">
                      Thông tin quan trọng
                    </p>
                    <ul className="text-amber-800 text-sm space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>
                          Phí sẽ được hoàn lại khi phiên đấu giá kết thúc
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>
                          Sau khi thanh toán, bạn có thể tham gia đấu giá ngay
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>
                          Vui lòng kiểm tra kỹ thông tin trước khi xác nhận
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div className="px-6 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3.5 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Hủy
            </button>
            <button
              onClick={handlePayment}
              className="flex-1 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
              disabled={!auctionFee}
            >
              Xác nhận thanh toán
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}
