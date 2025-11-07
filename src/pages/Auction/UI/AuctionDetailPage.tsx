import {
  Calendar,
  Clock,
  Eye,
  Gauge,
  Home,
  MessageSquare,
  RefreshCw,
  Share2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type {
  AuctionCustom,
  AuctionVehicleDetails,
  BidWithName,
} from "../../../entities/Auction";
import { auctionApi, vehicleApi } from "../../../features/Auction/index";
import { getConnection, startConnection } from "../../../shared/api/signalR";
import { Footer } from "../../../Widgets/Footers/Footer";
import { Header } from "../../../Widgets/Headers/Header";
import { getBidsByAuctionId } from "../../../features/Auction/AuctionBids";
import WinnerModal from "../../../Widgets/components/WinnerAuctionModal";
import type { AuctionWinnerDTO } from "../../../entities/AuctionWinnerDto";



type AuctionDetailProps = {
  onTimeLeftChange?: (auctionId: number, timeLeft: string) => void;
};

const AuctionDetail: React.FC<AuctionDetailProps> = ({ onTimeLeftChange }) => {
  const { id } = useParams();
  const [auction, setAuction] = useState<AuctionCustom | null>(null);
  const [vehicle, setVehicle] = useState<AuctionVehicleDetails | null>(null);
  const [bidPrice, setBidPrice] = useState("");
  const [bids, setBids] = useState<BidWithName[]>([]);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [auctionStatus, setAuctionStatus] = useState<string>("ĐANG DIỄN RA");
  const [userInfor, setUserInfor] = useState<Map<number, string>>(new Map());
  const [showShareLink, setShowShareLink] = useState(false);
  const [copied, setCopied] = useState(false);
const [winnerModalOpen, setWinnerModalOpen] = useState(false);
const [auctionWinner, setAuctionWinner] = useState<AuctionWinnerDTO | null>(null);
  useEffect(() => {
    if (id) {
      fetchAuctionDetail();
      initSignalR();
    }
  }, [id]);

  const initSignalR = async () => {
    try {
      await startConnection();
      const conn = getConnection();
      setConnectionStatus(conn.state);

      conn.off("ReceiveBid");
      conn.off("BidRejected");

      conn.onclose(() => setConnectionStatus("Disconnected"));
      conn.onreconnected(() => setConnectionStatus("Connected"));

      conn.on("ReceiveBid", async (bidderFullName, bidderAmount) => {
        try {
          const newBid: BidWithName = {
            bidderId: 0,
            bidderName: bidderFullName || `Unknow User`,
            amount: bidderAmount,
            time: new Date().toLocaleString("vi-VN"),
          };
          setBids((prev) => [newBid, ...prev]);
          setCurrentPrice(bidderAmount);
          // conn.on("BidRejected", (message) => alert(`Đặt giá thất bại: ${message}`));
        } catch (err) {
          console.error("SignalR error:", err);
          setConnectionStatus("Error");
        }
      });
      conn.on("BidRejected", (message) =>
        alert(`Đặt giá thất bại: ${message}`)
      );
    } catch (error) {
      console.error("Lỗi kết nối SignalR:", error);
      setConnectionStatus("Error");
    }
  };
  const processBids = async (auctionId: number) => {
    try {
      const bidResult = await getBidsByAuctionId(auctionId);

      if (bidResult?.items && bidResult.items.length > 0) {
        const maxBid = Math.max(...bidResult.items.map(b => b.bidAmount));
        setCurrentPrice(maxBid);

        const processedBids: BidWithName[] = bidResult.items.map(b => ({
          bidderId: 0,
          bidderName: (b as any).bidderFullName || "Unknown",
          amount: b.bidAmount,
          time: new Date().toLocaleString("vi-VN"),
        }));

        setBids(processedBids.reverse());
      } else {
        setCurrentPrice(auction?.startPrice || 0);
        setBids([]);
      }
    } catch (err) {
      console.error("Lỗi xử lý bids:", err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  // useEffect(() => {
  //   if (!auction?.auctionId || !auction?.endTime) return;

  //   if (timeLeft === "00:00:00" && auctionStatus !== "ĐÃ HOÀN TIỀN") {
  //     console.log("Phiên đấu giá đã hết hạn, tiến hành hoàn tiền...");
  //     setAuctionStatus("ĐANG HOÀN TIỀN");

  //     (async () => {
  //       const success = await auctionApi.refundAuction(auction.auctionId);
  //       if (success) {
  //         setAuctionStatus("ĐÃ HOÀN TIỀN");
  //       } else {
  //         setAuctionStatus("LỖI HOÀN TIỀN");
  //       }
  //     })();
  //   }
  // }, [timeLeft]);

  useEffect(() => {
  if (!auction?.auctionId || !auction?.endTime) return;

  // Khi hết thời gian
  if (timeLeft === "00:00:00" && auctionStatus !== "KẾT THÚC") {
    console.log("Phiên đấu giá đã hết hạn, tiến hành xác định người thắng...");

    (async () => {
      try {
        // Gọi hoàn tiền
        const refundSuccess = await auctionApi.refundAuction(auction.auctionId);

        if (refundSuccess) {
          setAuctionStatus("KẾT THÚC");

          // Gọi API lấy người thắng
          const winnerData = await auctionApi.getAuctionWinner(auction.auctionId);

          if (winnerData) {
            setAuctionWinner(winnerData);
            setWinnerModalOpen(true);
          } else {
            console.warn("Không tìm thấy người thắng cuộc!");
          }
        } else {
          setAuctionStatus("LỖI HOÀN TIỀN");
        }
      } catch (error) {
        console.error("Lỗi khi xác định người thắng:", error);
        setAuctionStatus("LỖI");
      }
    })();
  }
}, [timeLeft]);



  const fetchAuctionDetail = async () => {
    try {
      setLoading(true);
      const auctionId = Number(id);

      const auctionData = await auctionApi.getAuctionById(Number(id));
      if (!auctionData) throw new Error("Không thể tải thông tin đấu giá");

      setAuction(auctionData);
      await processBids(auctionId);

      const initPrice = auctionData.bids?.length
        ? Math.max(...auctionData.bids.map((b) => b.bidAmount || 0))
        : (auctionData.startPrice || 0);
      setCurrentPrice(initPrice);
      await processBids(auctionId);

      const vehicleData = await vehicleApi.getVehicleById(
        auctionData.vehicleId
      );
      if (vehicleData) setVehicle(vehicleData);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || "Lỗi tải dữ liệu đấu giá");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinAuction = async () => {
    if (!id) return;
    const conn = getConnection();
    if (conn.state !== "Connected") {
      alert("Chưa kết nối tới máy chủ. Vui lòng thử lại!");
      return;
    }

    try {
      await conn.invoke("JoinAuction", parseInt(id));
      setJoined(true);
      console.log("Joined auction:", id);
      await refreshBidHistory();
    } catch (err) {
      console.error("❌ Lỗi tham gia đấu giá:", err);
      alert("Không thể tham gia đấu giá. Vui lòng thử lại!");
    }
  };

  const handleBid = async () => {
    if (!bidPrice || !joined || !id) return;
    const conn = getConnection();
    if (conn.state !== "Connected") {
      alert("Mất kết nối tới máy chủ!");
      return;
    }

    const bidAmount = parseFloat(bidPrice);
    if (isNaN(bidAmount) || bidAmount <= 0) {
      alert("Vui lòng nhập giá hợp lệ");
      return;
    }

    if (bidAmount <= currentPrice) {
      alert(
        `Giá đặt phải cao hơn giá hiện tại (${formatPrice(currentPrice)} VNĐ)`
      );
      return;
    }

    try {
      const userId = parseInt(localStorage.getItem("userId") || "1");
      await conn.invoke("SendBid", parseInt(id), userId, bidAmount);
      setBidPrice("");
      console.log("Bid sent:", bidAmount);
    } catch (err) {
      console.error("❌ Lỗi gửi bid:", err);
      alert("Không thể đặt giá. Vui lòng thử lại!");
    }
  };
  const calculateTimeLeft = () => {
    if (!auction?.endTime) return "";

    const endTime = new Date(auction.endTime).getTime();
    const now = new Date().getTime();
    const difference = endTime - now;

    if (difference <= 0) {
      setAuctionStatus("KẾT THÚC");
      return "00:00:00";
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!auction?.endTime) return;

    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);

      if (auction?.auctionId && onTimeLeftChange) {
        onTimeLeftChange(auction.auctionId, newTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [auction]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);
  const formatPriceShort = (price?: number | null): string => {
    if (price === undefined || price === null || isNaN(price)) {
      return "0";
    }
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  const retryFetch = () => fetchAuctionDetail();

  const formatPriceAuction = (price: number): string => {
    if (price === undefined || price === null || isNaN(price) || price === 0) {
      return "0";
    }
    if (price >= 1_000_000_000_000) {
      return (price / 1_000_000_000_000).toFixed(1).replace(/\.0$/, '') + " nghìn tỷ";
    } else if (price >= 1_000_000_000) {
      return (price / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + " tỷ";
    } else if (price >= 1_000_000) {
      return (price / 1_000_000).toFixed(1).replace(/\.0$/, '') + " triệu";
    } else if (price >= 1_000) {
      return (price / 1_000).toFixed(1).replace(/\.0$/, '') + " nghìn";
    } else {
      return price.toString();
    }
  };

  const refreshBidHistory = async () => {
    await processBids(Number(id));
  };


  if (loading)
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              Lỗi tải dữ liệu
            </h3>
            <p className="mb-4 text-gray-600">{error}</p>
            <button
              onClick={retryFetch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" /> Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </>
    );

  if (!auction || !vehicle) return null;

  return (
    <>
      <Header />

      <div className="bg-gray-50 min-h-screen py-6">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Home className="w-4 h-4" />
            <span>›</span>
            <span className="hover:text-blue-600 cursor-pointer">
              Phiên đấu giá
            </span>
            <span>›</span>
            <span className="font-medium">{vehicle.brand}</span>
          </div>

          {/* Location & Title */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold mb-2">{vehicle.vehicleName}</h1>
            <div className="flex gap-3 text-sm">
              <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-md">
                Đời xe: {vehicle.brand}
              </span>{" "}
            </div>
          </div>

          {/* Main Layout: 2 columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Images & Details (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery với border xanh */}
              <div className="bg-white rounded-2xl border-2 border-blue-400 overflow-hidden shadow-lg">
                <img
                  src={vehicle.vehicleImages?.[0] || "/images/default-car.jpg"}
                  alt={vehicle.vehicleName}
                  className="w-full h-96 object-cover"
                />

                {/* Thumbnail row */}
                {vehicle.vehicleImages && vehicle.vehicleImages.length > 1 && (
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-3">
                      {vehicle.vehicleImages.slice(1, 5).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`thumb-${idx}`}
                          className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition border-2 border-transparent hover:border-blue-400"
                        />
                      ))}
                    </div>
                    {vehicle.vehicleImages.length > 5 && (
                      <button className="mt-3 text-blue-600 text-sm flex items-center gap-1 hover:underline">
                        <Eye className="w-4 h-4" />
                        Xem tất cả ảnh
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Thông tin xe cơ bản */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-5">
                  Thông tin xe cơ bản
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Gauge className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Công tơ mét</div>
                      <div className="font-semibold text-gray-900">
                        {formatPrice(vehicle.km)} km
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Calendar className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Năm sản xuất</div>
                      <div className="font-semibold text-gray-900">
                        {vehicle.year}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Gauge className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Nhiên liệu</div>
                      <div className="font-semibold text-gray-900">
                        Xăng 1.5 L
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Gauge className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Hộp số</div>
                      <div className="font-semibold text-gray-900">
                        Số tự động
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Gauge className="text-blue-600 w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-gray-500 text-sm">Kiểu dáng</div>
                      <div className="font-semibold text-gray-900">
                        {vehicle.bodyType || "Sedan"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar (1/3 width) */}
            <div className="space-y-6">
              {/* Card thông tin phiên đấu giá */}
              <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 sticky top-4 relative">
                <h3 className="font-semibold text-lg mb-4 text-gray-900">
                  Thông tin phiên
                </h3>

                <div className="flex items-center justify-between mb-5">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium shadow-sm ${auctionStatus === "ĐANG DIỄN RA"
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                      }`}
                  >
                    {auctionStatus}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-gray-700">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Còn lại {timeLeft}</span>
                  </div>
                </div>

                {/* Giá hiện tại */}
                <div className="mb-8">
                  <div className="text-sm text-gray-600 mb-2">
                    Hiện cao nhất
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-1">
                    {formatPriceShort(currentPrice)}{" "}
                    <span className="text-xl md:text-2xl">triệu</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Khởi điểm:{" "}
                    <span className="font-medium">
                      {formatPriceShort(auction.startPrice)} triệu
                    </span>
                  </div>
                </div>

                {/* Nút đặt giá hoặc input */}
                <div className="mb-6">
                  {!joined ? (
                    <button
                      onClick={handleJoinAuction}
                      disabled={
                        connectionStatus !== "Connected" ||
                        auctionStatus === "KẾT THÚC"
                      }
                      className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {connectionStatus !== "Connected"
                        ? "Đang kết nối..."
                        : auctionStatus === "KẾT THÚC"
                          ? "Phiên đã kết thúc"
                          : "Đặt giá của bạn"}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={bidPrice ? formatPrice(parseFloat(bidPrice)) : ""}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/\./g, "");
                          if (rawValue === "" || /^\d+$/.test(rawValue)) {
                            setBidPrice(rawValue);
                          }
                        }}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition bg-white"
                        placeholder="Nhập bình luận..."
                      />
                      <button
                        onClick={handleBid}
                        disabled={!bidPrice || connectionStatus !== "Connected"}
                        className="w-full h-12 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Gửi
                      </button>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-white rounded-xl shadow-sm p-4 text-center">
                    <MessageSquare className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                    <div className="text-xs text-gray-600 mb-1">
                      Lượt đặt giá
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {bids.length}
                    </div>
                  </div>
                </div>

                {/* <div className="relative">
  <button
    onClick={() => setShowShareLink(!showShareLink)}
    className="w-full mt-4 h-10 border-2 border-gray-200 rounded-xl hover:bg-white hover:border-blue-400 transition flex items-center justify-center gap-2 text-gray-700 font-medium"
  >
    <Share2 className="w-4 h-4" />
    Chia sẻ phiên
  </button>

  {showShareLink && (
    <div className="absolute top-12 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50 animate-fadeIn">
      <div className="text-sm text-gray-600 mb-2">Link chia sẻ:</div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={window.location.href}
          readOnly
          className="flex-1 px-3 py-2 border rounded-lg text-sm text-gray-700 bg-gray-50"
        />
        <button
          onClick={handleCopyLink}
          className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
        >
          {copied ? "✅ Copied" : "Copy"}
        </button>
      </div>
    </div>
  )}
</div> */}

                <div className="relative mt-5 border-t border-gray-200 pt-4">
                  <button
                    onClick={() => setShowShareLink(!showShareLink)}
                    className="w-full h-10 border-2 border-amber-200 rounded-xl hover:bg-amber-50 hover:border-amber-500 transition flex items-center justify-center gap-2 text-amber-600 font-semibold shadow-sm"
                  >
                    <Share2 className="w-4 h-4 text-amber-500" />
                    Chia sẻ phiên
                  </button>

                 {showShareLink && (
  <div className="mt-3 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3 animate-fadeIn">
                      <div className="text-sm text-gray-700 mb-1 font-medium">
                        🔗 Link chia sẻ
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={window.location.href}
                          readOnly
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 bg-gray-50 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400"
                        />
                        <button
                          onClick={handleCopyLink}
                          className="px-3 py-2 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition font-semibold shadow-md"
                        >
                          {copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {bids.length > 0 && (
                  <div className="bg-white rounded-xl shadow p-4 mt-6 max-h-60 overflow-y-auto">
                    <h3 className="font-semibold mb-3">📜 Lịch sử đặt giá</h3>
                    {bids.map((bid, i) => (
                      <div
                        key={i}
                        className="flex justify-between py-2 border-b last:border-0"
                      >
                        <span>{bid.bidderName}</span>
                        <span className="font-semibold text-green-600">
                          {formatPrice(bid.amount)} VNĐ
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <WinnerModal
  auctionId={auction.auctionId}
  isOpen={winnerModalOpen}
  onClose={() => setWinnerModalOpen(false)}
/>
      <Footer />
    </>
  );
};

export default AuctionDetail;