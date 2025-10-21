import { RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type {
  AuctionCustom,
  AuctionVehicleDetails,
} from "../../../entities/Auction";
import { auctionApi, vehicleApi } from "../../../features/Auction/index";
import { getConnection, startConnection } from "../../../shared/api/signalR";
import { Footer } from "../../../Widgets/Footers/Footer";
import { Header } from "../../../Widgets/Headers/Header";

const AuctionDetail: React.FC = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState<AuctionCustom | null>(null);
  const [vehicle, setVehicle] = useState<AuctionVehicleDetails | null>(null);
  const [bidPrice, setBidPrice] = useState("");
  const [bids, setBids] = useState<
    { bidderId: number; amount: number; time: string }[]
  >([]);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Disconnected");
  const [currentPrice, setCurrentPrice] = useState<number>(0);

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

      conn.onclose(() => setConnectionStatus("Disconnected"));
      conn.onreconnected(() => setConnectionStatus("Connected"));

      conn.on("ReceiveBid", (auctionId, bidderId, bidderAmount) => {
        console.log(" New bid:", bidderId, bidderAmount);
        setBids((prev) => [
          {
            bidderId,
            amount: bidderAmount,
            time: new Date().toLocaleString("vi-VN"),
          },
          ...prev,
        ]);
        setCurrentPrice(bidderAmount);
      });

      conn.on("BidRejected", (message) =>
        alert(`Đặt giá thất bại: ${message}`)
      );
    } catch (err) {
      setConnectionStatus("Error");
    }
  };

  const fetchAuctionDetail = async () => {
    try {
      setLoading(true);
      const auctionData = await auctionApi.getAuctionById(Number(id));
      if (!auctionData) throw new Error("Không thể tải thông tin đấu giá");

      setAuction(auctionData);

      const initPrice = auctionData.bids?.length
        ? Math.max(...auctionData.bids.map((b) => b.bidAmount))
        : auctionData.startPrice;
      setCurrentPrice(initPrice);

      if (auctionData.bids) {
        const initialBids = auctionData.bids.map((b) => ({
          bidderId: b.bidderId,
          amount: b.bidAmount,
          time: new Date(b.bidTime).toLocaleString("vi-VN"),
        }));
        setBids(initialBids.reverse());
      }

      const vehicleData = await vehicleApi.getVehicleById(
        auctionData.vehicleId
      );
      if (vehicleData) setVehicle(vehicleData);
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu đấu giá");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinAuction = async () => {
    if (!id) return;
    const conn = getConnection();
    if (conn.state !== "Connected") return;

    try {
      await conn.invoke("JoinAuction", parseInt(id));
      setJoined(true);
    } catch (err) {
      console.error("❌ Lỗi tham gia đấu giá:", err);
    }
  };

  const handleBid = async () => {
    if (!bidPrice || !joined || !id) return;
    const conn = getConnection();
    if (conn.state !== "Connected") return;

    const bidAmount = parseFloat(bidPrice);
    if (isNaN(bidAmount) || bidAmount <= 0)
      return alert("Vui lòng nhập giá hợp lệ");

    try {
      const userId = parseInt(localStorage.getItem("userId") || "1");
      await conn.invoke("SendBid", parseInt(id), userId, bidAmount);
      setBidPrice("");
    } catch (err) {
      console.error("❌ Lỗi gửi bid:", err);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);
  const retryFetch = () => fetchAuctionDetail();

  if (loading)
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-red-600">
              Lỗi tải dữ liệu
            </h3>
            <p className="mb-4">{error}</p>
            <button
              onClick={retryFetch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="inline-block w-4 h-4 mr-1" /> Thử lại
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
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10">
          {/* Hình ảnh xe */}
          <img
            src={vehicle.vehicleImages?.[0] || "/images/default-car.jpg"}
            alt={vehicle.vehicleName}
            className="rounded-2xl shadow-lg w-full h-96 object-cover"
          />

          {/* Thông tin đấu giá */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{vehicle.vehicleName}</h1>
            <p className="text-gray-600 mb-6">
              {vehicle.brand} - {vehicle.model} - {vehicle.year}
            </p>

            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-2xl">
              <p>Giá khởi điểm: {formatPrice(auction.startPrice)} VNĐ</p>
              <p className="text-2xl font-bold mt-2">
                Giá hiện tại: {formatPrice(currentPrice)} VNĐ
              </p>
            </div>

            {!joined ? (
              <button
                onClick={handleJoinAuction}
                className="w-full mt-4 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                disabled={connectionStatus !== "Connected"}
              >
                Tham gia đấu giá
              </button>
            ) : (
              <div className="flex gap-3 mt-4">
                <input
                  type="number"
                  value={bidPrice}
                  onChange={(e) => setBidPrice(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
                  placeholder="Nhập giá của bạn"
                />
                <button
                  onClick={handleBid}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                  disabled={!bidPrice}
                >
                  Đặt giá
                </button>
              </div>
            )}

            {bids.length > 0 && (
              <div className="bg-white rounded-xl shadow p-4 mt-6 max-h-60 overflow-y-auto">
                <h3 className="font-semibold mb-3">📜 Lịch sử đặt giá</h3>
                {bids.map((bid, i) => (
                  <div
                    key={i}
                    className="flex justify-between py-2 border-b last:border-0"
                  >
                    <span>Người {bid.bidderId}</span>
                    <span className="font-semibold text-green-600">
                      {formatPrice(bid.amount)} VNĐ
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AuctionDetail;
