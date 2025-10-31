import { Calendar, Clock, Gauge } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Auction } from "../../../entities/Auction.ts";
import type { Vehicle } from "../../../entities/Vehicle.ts";
import { getConnection, startConnection } from "../../../shared/api/signalR.js";
import { CheckEligibilityJoinAuction } from "../../../features/Auction/AuctionFee/index.tsx";
import PayAuctionFeeModal from "./PayAuctionFeeModal.tsx";

type AuctionCardProps = {
  auctions: {
    auction: Auction;
    vehicle: Vehicle;
  }[];
  auctionTimeLeft?: Record<number, string>;
};

export const AuctionCard: React.FC<AuctionCardProps> = ({ auctions, auctionTimeLeft }) => {
  const [localAuctions, setLocalAuctions] = useState(auctions);
  const [openPayModal, setOpenPayModal] = useState(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    setLocalAuctions(auctions);
  }, [auctions]);

  // Khởi tạo SignalR để lắng nghe cập nhật giá
  useEffect(() => {
    const initSignalR = async () => {
      try {
        await startConnection();
        const conn = getConnection();

        // Lắng nghe sự kiện ReceiveBid
        conn.on(
          "ReceiveBid",
          (auctionId: number, bidderId: string, bidderAmount: number) => {
            console.log("AuctionCard nhận bid mới:", auctionId, bidderAmount);

            // Cập nhật giá trong local state
            setLocalAuctions((prev) =>
              prev.map((item) =>
                item.auction.auctionId === auctionId
                  ? {
                    ...item,
                    auction: {
                      ...item.auction,
                      currentPrice: bidderAmount,
                    },
                  }
                  : item
              )
            );
          }
        );

        // Join tất cả auction rooms
        localAuctions.forEach((item) => {
          conn
            .invoke("JoinAuction", item.auction.auctionId)
            .then(() =>
              console.log(`AuctionCard joined room: ${item.auction.auctionId}`)
            )
            .catch((err) => console.error("Join error:", err));
        });
      } catch (error) {
        console.error("AuctionCard SignalR error:", error);
      }
    };

    initSignalR();

    return () => {
      const conn = getConnection();
      if (conn) {
        conn.off("ReceiveBid");
      }
    };
  }, [localAuctions]);

  const formatPrice = (price?: number) =>
    price ? new Intl.NumberFormat("vi-VN").format(price) : "0";

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-blue-500 text-white";
      case "ended":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-300 text-black";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "Đang diễn ra";
      case "pending":
        return "Sắp diễn ra";
      case "ended":
        return "Đã kết thúc";
      default:
        return "Không xác định";
    }
  };


 const calculateTimeLeft = (endTime?: string) => {
  if (!endTime) return { hours: 0, minutes: 0 }; // thêm dòng này

  const end = new Date(endTime).getTime();
  if (isNaN(end)) return { hours: 0, minutes: 0 }; // kiểm tra định dạng sai

  const now = Date.now();
  const timeLeft = Math.max(0, end - now);
  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  return { hours, minutes };
};

  const handlejoinAuction = async (auctionId: number) => {
    const check : boolean = await CheckEligibilityJoinAuction(auctionId, localStorage.getItem("userId") || "");
    if (check) {
      navigate(`/auction/${auctionId}`);
    } else {
      setSelectedAuctionId(auctionId); 
      setOpenPayModal(true);
    }
  };

  if (!localAuctions || localAuctions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Không có dữ liệu đấu giá
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {localAuctions.map(({ auction, vehicle }) => {
const { hours, minutes } = calculateTimeLeft(auction.end_time || auction.endTime || "");
        // Sử dụng currentPrice nếu có, không thì dùng start_price
        const currentPrice = auction.currentPrice || auction.start_price ||  0;

        return (
          <article
            key={auction.auctionId}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
          >
            {/* Vehicle image */}
            <div className="relative">
              <img
                src={auction.images?.[0] ||           // ✅ Ảnh đầu tiên từ AuctionCustom (BE)
                  vehicle.images?.[0] || "/images/default-car.jpg"}
                alt={vehicle.vehicleName}
                className="h-56 w-full object-cover transform group-hover:scale-105 transition duration-500"
                loading="lazy"
              />
              <span
                className={`absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full shadow-md ${getStatusBadge(
                  auction.status
                )}`}
              >
                {getStatusText(auction.status)}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <h3
                className="text-xl font-bold text-gray-900 line-clamp-1"
                title={vehicle.vehicleName}
              >
                {vehicle.vehicleName}
              </h3>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {vehicle.year}
                </span>
                {vehicle.km !== undefined && (
                  <span className="flex items-center gap-1">
                    <Gauge className="w-4 h-4" /> {vehicle.km.toLocaleString()}{" "}
                    km
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-2">
                <span className="text-emerald-600 font-bold text-lg">
                  {formatPrice(currentPrice)} VNĐ
                </span>

                {auction.status.toLowerCase() === "active" && (
                  <span className="flex items-center gap-1 text-red-500 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    Còn lại:{" "}
                    {auctionTimeLeft?.[auction.auctionId]
                      ? auctionTimeLeft[auction.auctionId]
                      : `${hours}h ${minutes}m`}                  </span>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handlejoinAuction(auction.auctionId)}
                  className="flex-1 bg-blue-600 text-white font-semibold py-2 rounded-xl hover:bg-blue-700 transition text-center"
                >
                  Tham gia đấu giá
                </button>
                <Link
                  to={`/auction/${auction.auctionId}`}
                  className="flex-1 border border-blue-600 text-blue-600 font-semibold py-2 rounded-xl text-center hover:bg-blue-50 transition"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </article>
        );
      })}
      {selectedAuctionId && (
        <PayAuctionFeeModal
          isOpen={openPayModal}
          onClose={() => setOpenPayModal(false)}
          auctionId={selectedAuctionId}
        />
      )}
    </div>
  );
};
