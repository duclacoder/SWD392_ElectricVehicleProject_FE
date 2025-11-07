import {
  Calendar,
  Clock,
  Gauge,
  TrendingUp,
  ArrowRight,
  Shield,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Auction } from "../../../entities/Auction";
import type { Vehicle } from "../../../entities/Vehicle";
import { getConnection, startConnection } from "../../../shared/api/signalR";
import { CheckEligibilityJoinAuction } from "../../../features/Auction/AuctionFee";
import PayAuctionFeeModal from "./PayAuctionFeeModal";

type AuctionCardProps = {
  auctions: {
    auction: Auction;
    vehicle: Vehicle;
  }[];
  auctionTimeLeft?: Record<number, string>;
};

export const AuctionCard: React.FC<AuctionCardProps> = ({
  auctions,
  auctionTimeLeft,
}) => {
  const [localAuctions, setLocalAuctions] = useState(auctions);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState<number>();
  const navigate = useNavigate();
  useEffect(() => {
    setLocalAuctions(auctions);
  }, [auctions]);
  useEffect(() => {
    const initSignalR = async () => {
      try {
        await startConnection();
        const conn = getConnection();

        conn.on("ReceiveBid", (auctionId: number, bidderId: string, bidderAmount: number) => {
          setLocalAuctions((prev) =>
            prev.map((item) =>
              item.auction.auctionId === auctionId
                ? {
                    ...item,
                    auction: { ...item.auction, currentPrice: bidderAmount },
                  }
                : item
            )
          );
        });

        localAuctions.forEach((item) => {
          conn.invoke("JoinAuction", item.auction.auctionId).catch(console.error);
        });
      } catch (error) {
        console.error("AuctionCard SignalR error:", error);
      }
    };

    initSignalR();
    return () => {
      const conn = getConnection();
      if (conn) conn.off("ReceiveBid");
    };
  }, [localAuctions]);
  const formatPrice = (price?: number) =>
    price ? new Intl.NumberFormat("vi-VN").format(price) : "0";

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-gradient-to-r from-emerald-500 to-green-600";
      case "pending":
        return "bg-gradient-to-r from-blue-500 to-indigo-600";
      case "ended":
        return "bg-gradient-to-r from-gray-400 to-gray-500";
      default:
        return "bg-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "🔴 ĐANG DIỄN RA";
      case "pending":
        return "⏳ SẮP DIỄN RA";
      case "ended":
        return "✓ ĐÃ KẾT THÚC";
      default:
        return "Không xác định";
    }
  };

  const calculateTimeLeft = (endTime?: string) => {
    if (!endTime) return { hours: 0, minutes: 0 };
    const end = new Date(endTime).getTime();
    if (isNaN(end)) return { hours: 0, minutes: 0 };
    const now = Date.now();
    const timeLeft = Math.max(0, end - now);
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    return { hours, minutes };
  };
  const handlejoinAuction = async (auctionId: number) => {
    const check: boolean = await CheckEligibilityJoinAuction(
      auctionId,
      localStorage.getItem("userId") || ""
    );
    if (check) {
      navigate(`/auction/${auctionId}`);
    } else {
      setSelectedAuctionId(auctionId);
      setOpenPayModal(true);
    }
  };
  if (!localAuctions || localAuctions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <p className="text-2xl font-bold text-gray-700">Chưa có phiên đấu giá nào</p>
        <p className="text-gray-500">Hãy quay lại sau nhé!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {localAuctions.map(({ auction, vehicle }) => {
          const { hours, minutes } = calculateTimeLeft(auction.endTime);
          const currentPrice = auction.currentPrice || auction.startPrice || 0;

          return (
            <article
              key={auction.auctionId}
              className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:scale-[1.02] hover:-translate-y-2"
            >
              {/* ===== HÌNH ẢNH XE ===== */}
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <img
                  src={
                    auction.images?.[0] ||
                    vehicle.images?.[0] ||
                    "/images/default-car.jpg"
                  }
                  alt={vehicle.vehicleName}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute top-5 left-5 z-10">
                  <div
                    className={`${getStatusBadge(
                      auction.status
                    )} text-white text-xs font-bold px-4 py-2.5 rounded-full flex items-center gap-2 border border-white/20`}
                  >
                    {auction.status.toLowerCase() === "active" && (
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                    {getStatusText(auction.status)}
                  </div>
                </div>
              </div>

              {/* ===== NỘI DUNG CARD ===== */}
              <div className="p-6 space-y-5">
                {/* Tên xe */}
                <h3
                  className="text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors"
                  title={vehicle.vehicleName}
                >
                  {vehicle.vehicleName}
                </h3>

                {/* Thông tin */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-2xl px-4 py-3 border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-600 text-xs font-semibold uppercase">
                      <Calendar className="w-4 h-4" /> Năm
                    </div>
                    <p className="text-lg font-bold">{vehicle.year}</p>
                  </div>

                  {vehicle.km !== undefined && (
                    <div className="bg-purple-50 rounded-2xl px-4 py-3 border border-purple-100">
                      <div className="flex items-center gap-2 text-purple-600 text-xs font-semibold uppercase">
                        <Gauge className="w-4 h-4" /> Km
                      </div>
                      <p className="text-lg font-bold">
                        {(vehicle.km / 1000).toFixed(0)}K
                      </p>
                    </div>
                  )}
                </div>

                {/* Giá + thời gian */}
                <div className="bg-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-5 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs opacity-80">Giá hiện tại</p>
                      <p className="text-3xl font-black">{formatPrice(currentPrice)} VNĐ</p>
                    </div>
                    {auction.status.toLowerCase() === "active" && (
                      <div className="bg-white/20 rounded-xl px-3 py-2 text-sm font-semibold">
                        <Clock className="inline-block w-4 h-4 mr-1 text-yellow-300" />
                        {auctionTimeLeft?.[auction.auctionId] ||
                          `${hours}h ${minutes}m`}
                      </div>
                    )}
                  </div>
                  {auction.bids && auction.bids.length > 0 && (
                    <div className="flex items-center gap-2 mt-3 text-sm opacity-90">
                      <TrendingUp className="w-4 h-4" />
                      {auction.bids.length} lượt đặt giá
                    </div>
                  )}
                </div>

                {/* Button */}
                <button
                  onClick={() => handlejoinAuction(auction.auctionId)}
                  className="w-full bg-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-3 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
                >
                   <span className="text-white">Tham gia đấu giá</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Footer */}
                {/* <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-xs text-gray-500">
                  {auction.entryFee && (
                    <span className="font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                      Phí: {formatPrice(auction.entryFee)} VNĐ
                    </span>
                  )}
                </div> */}
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal giữ nguyên */}
      {selectedAuctionId && (
        <PayAuctionFeeModal
          isOpen={openPayModal}
          onClose={() => setOpenPayModal(false)}
          auctionId={selectedAuctionId}
        />
      )}
    </>
  );
};
