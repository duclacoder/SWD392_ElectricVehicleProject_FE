import {
  AlertCircle,
  Check,
  Crown,
  Loader2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import type { AuctionsFee } from "../../entities/AuctionsFee";
import { getAuctionsFeeByAuctionId } from "../../features/Admin/api/adminAuctionsFeeApi";

interface AuctionFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (fee: AuctionsFee) => void;
  auctionId: number;
}

const AuctionFeeModal: React.FC<AuctionFeeModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  auctionId,
}) => {
  const [fee, setFee] = useState<AuctionsFee | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && auctionId) fetchAuctionFee();
  }, [isOpen, auctionId]);

  const fetchAuctionFee = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAuctionsFeeByAuctionId(auctionId);
      if (result) {
        setFee(result);
      } else {
        setError("Không tìm thấy thông tin phí cho phiên đấu giá này");
        setFee(null);
      }
    } catch (error) {
      console.error("Error fetching fee:", error);
      setError("Có lỗi xảy ra khi tải thông tin phí");
      setFee(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!fee) return;
    setProcessing(true);
    try {
      // TODO: Gọi API thanh toán phí thật
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onPaymentSuccess(fee);
      onClose();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Thanh toán thất bại. Vui lòng thử lại!");
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (price?: number) =>
    price != null ? new Intl.NumberFormat("vi-VN").format(price) : "—";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white px-8 py-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all hover:rotate-90 duration-300"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Thanh toán phí tham gia
              </h2>
              <p className="text-blue-100 text-sm">
                Để tham gia đấu giá, bạn cần thanh toán phí tham gia dưới đây
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-220px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-500">Đang tải thông tin phí...</p>
            </div>
          ) : error || !fee ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <p className="text-gray-700 font-medium mb-2">
                {error || "Không tìm thấy thông tin phí"}
              </p>
              <button
                onClick={fetchAuctionFee}
                className="text-blue-600 hover:underline text-sm"
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Fee Card */}
              <div className="rounded-2xl border-2 border-blue-500 shadow-xl shadow-blue-100 overflow-hidden">
                <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-cyan-50 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                      <Crown className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
                      BẮT BUỘC
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {fee.description || "Phí tham gia đấu giá"}
                  </h3>

                  <div className="mb-4">
                    <span className="text-5xl font-bold text-blue-600">
                      {formatPrice(fee.entryFee)}
                    </span>
                    <span className="text-xl text-gray-600 ml-2">
                      {fee.currency || "VNĐ"}
                    </span>
                  </div>

                  {fee.type && (
                    <p className="text-gray-600 mb-4">{fee.type}</p>
                  )}

                  {fee.feePerMinute > 0 && (
                    <div className="bg-white/50 rounded-lg p-3 mt-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Phí mỗi phút:</span>{" "}
                        {formatPrice(fee.feePerMinute)} {fee.currency || "VNĐ"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-white p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Quyền lợi khi tham gia:
                  </h4>
                  <div className="space-y-3">
                    {[
                      "Tham gia đấu giá xe",
                      "Hoàn tiền 100% nếu không thắng đấu giá",
                      "Hỗ trợ khách hàng 24/7",
                      "Bảo mật thông tin tuyệt đối",
                      "Quy trình thanh toán nhanh chóng",
                    ].map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        Phí này sẽ được hoàn lại 100% nếu bạn không thắng đấu
                        giá
                      </li>
                      <li>Nếu thắng đấu giá, phí sẽ được trừ vào giá trị xe</li>
                      <li>
                        Sau khi thanh toán, bạn có thể tham gia đấu giá ngay
                        lập tức
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-8 py-6 bg-gray-50">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              {fee && (
                <>
                  Tổng thanh toán:{" "}
                  <span className="font-bold text-xl text-blue-600">
                    {formatPrice(fee.entryFee)} {fee.currency || "VNĐ"}
                  </span>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handlePayment}
                disabled={!fee || processing}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" /> Thanh toán ngay
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionFeeModal;