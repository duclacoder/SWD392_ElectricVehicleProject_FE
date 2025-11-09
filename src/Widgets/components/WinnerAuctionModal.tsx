import React, { useEffect, useState } from "react";
import { Trophy, Mail, Phone, User, X, Sparkles, Crown, Star, Award, PartyPopper } from "lucide-react";
import { auctionApi } from "../../features/Auction";
import type { AuctionWinnerDTO } from "../../entities/AuctionWinnerDto";

interface WinnerModalProps {
  auctionId: number;
  isOpen: boolean;
  onClose: () => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ auctionId, isOpen, onClose }) => {
  const [winner, setWinner] = useState<AuctionWinnerDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadWinner();
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isOpen]);

  const loadWinner = async () => {
    setLoading(true);
    const data = await auctionApi.getAuctionWinner(auctionId);
    setWinner(data);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <Star 
                className="text-blue-400" 
                style={{ 
                  width: `${10 + Math.random() * 20}px`,
                  height: `${10 + Math.random() * 20}px`,
                  opacity: 0.6 + Math.random() * 0.4
                }} 
              />
            </div>
          ))}
        </div>
      )}

      <div className="relative max-w-xl w-full animate-scaleIn max-h-[90vh] overflow-y-auto">
        {/* Glowing background effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 rounded-3xl blur-2xl opacity-30 animate-pulse"></div>
        
        {/* Main card */}
        <div className="relative bg-gradient-to-br from-white via-blue-50 to-white rounded-3xl shadow-2xl overflow-visible border-2 border-blue-200">
          {/* Animated border glow */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/20 to-transparent animate-shimmer"></div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl"></div>
          </div>

          {/* Crown with advanced styling */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-10">
            <div className="relative">
              {/* Outer glow rings */}
              <div className="absolute inset-0 animate-ping-slow">
                <div className="w-28 h-28 rounded-full border-4 border-blue-400/40"></div>
              </div>
              <div className="absolute inset-0 animate-pulse">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-400/30 blur-xl"></div>
              </div>
              
              {/* Crown container */}
              <div className="relative">
                {/* <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 p-1 shadow-2xl">
                  {/* <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <Crown className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                </div>
                {/* Sparkles around crown */}
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-blue-400 animate-pulse" />
                <Sparkles className="absolute -bottom-1 -left-1 w-5 h-5 text-cyan-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2.5 rounded-full transition-all duration-300 group backdrop-blur-sm border border-gray-200"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Content */}
          <div className="relative px-8 pt-20 pb-8">
            {/* Header with particles */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-3 mb-3">
                <PartyPopper className="w-7 h-7 text-blue-500 animate-bounce" />
                <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
                  NGƯỜI THẮNG CUỘC
                </h2>
                <PartyPopper className="w-7 h-7 text-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-blue-400/50"></div>
                <p className="text-sm text-gray-600 font-medium tracking-wider">
                  Phiên #{auctionId} • Đã kết thúc
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-blue-400/50"></div>
              </div>
            </div>

            {/* Winner content */}
            <div className="relative">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin"></div>
                    <Trophy className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <div className="mt-6 space-y-2 text-center">
                    <p className="text-gray-700 font-semibold text-lg">Đang xác định người chiến thắng...</p>
                    <p className="text-gray-500 text-sm">Vui lòng chờ trong giây lát</p>
                  </div>
                </div>
              ) : winner ? (
                <div className="space-y-5">
                  {/* Winner badge with 3D effect */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-40"></div>
                    <div className="relative bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 p-5 rounded-2xl shadow-2xl border border-blue-300">
                      <div className="flex items-center justify-center gap-3">
                        <Award className="w-7 h-7 text-white drop-shadow-lg animate-pulse" />
                        <span className="font-black text-2xl text-white drop-shadow-lg tracking-wide">
                          CHIẾN THẮNG
                        </span>
                        <Award className="w-7 h-7 text-white drop-shadow-lg animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* Winner info cards */}
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-white/90 backdrop-blur-sm p-5 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:shadow-blue-400/20">
                        <div className="flex items-center gap-4">
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full blur-md opacity-50"></div>
                            <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                              <User className="w-7 h-7 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-blue-600/70 mb-1.5 uppercase tracking-wider">Họ và tên</div>
                            <div className="text-gray-900 font-bold text-xl truncate">{winner.fullName}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-white/90 backdrop-blur-sm p-5 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-400/20">
                        <div className="flex items-center gap-4">
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full blur-md opacity-50"></div>
                            <div className="relative w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                              <Mail className="w-7 h-7 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-indigo-600/70 mb-1.5 uppercase tracking-wider">Email liên hệ</div>
                            <div className="text-gray-900 font-semibold truncate">{winner.email}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="group relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative bg-white/90 backdrop-blur-sm p-5 rounded-xl border-2 border-cyan-200 hover:border-cyan-400 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-400/20">
                        <div className="flex items-center gap-4">
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-md opacity-50"></div>
                            <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                              <Phone className="w-7 h-7 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-medium text-cyan-600/70 mb-1.5 uppercase tracking-wider">Số điện thoại</div>
                            <div className="text-gray-900 font-semibold text-lg">{winner.phone}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Congratulations banner */}
                  <div className="relative mt-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-cyan-400/20 to-blue-400/10 animate-shimmer-slow"></div>
                    <div className="relative bg-gradient-to-r from-blue-100/80 via-cyan-100/90 to-blue-100/80 backdrop-blur-sm border-2 border-blue-300 rounded-2xl p-5 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                        <Trophy className="w-6 h-6 text-blue-600" />
                        <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                      </div>
                      <p className="text-blue-900 font-bold text-lg mb-1">
                        🎉 Chúc mừng bạn đã chiến thắng! 🎉
                      </p>
                      <p className="text-blue-700 text-sm">
                        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 backdrop-blur-sm border-2 border-gray-200 mb-6">
                    <Trophy className="w-12 h-12 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-semibold text-xl mb-2">Chưa có người thắng cuộc</p>
                  <p className="text-gray-500">Vui lòng thử lại sau</p>
                </div>
              )}
            </div>

            {/* Close button */}
            <div className="mt-8">
              <button
                onClick={onClose}
                className="relative w-full group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <span className="text-lg tracking-wide">Đóng</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes ping-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-confetti {
          animation: confetti linear infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-shimmer-slow {
          animation: shimmer-slow 3s infinite;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default WinnerModal;