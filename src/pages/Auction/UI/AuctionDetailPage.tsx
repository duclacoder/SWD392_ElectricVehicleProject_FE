import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../../../Widgets/Headers/Header";
import { Footer } from "../../../Widgets/Footers/Footer";
import { Clock, Gauge, Calendar, User, Shield, Zap, Award, MapPin, RefreshCw, LogIn } from "lucide-react";
import type { AuctionCustom } from "../../../entities/Auction";
import type { AuctionVehicleDetails } from "../../../entities/Auction";
import api from "../../../shared/api/axios.ts";
import { getConnection, startConnection } from "../../../shared/api/signalR.js";

const AuctionDetail: React.FC = () => {
    const { id } = useParams();
    const [auction, setAuction] = useState<AuctionCustom | null>(null);
    const [vehicle, setVehicle] = useState<AuctionVehicleDetails | null>(null);
    const [bidPrice, setBidPrice] = useState("");
    const [selectedImage, setSelectedImage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joined, setJoined] = useState(false);
    const [bids, setBids] = useState<{ bidderId: number; amount: number; time: string }[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
    const [currentPrice, setCurrentPrice] = useState<number>(0);

    useEffect(() => {
        if (id) {
            fetchAuctionDetail();
            initSignalR();
        }
    }, [id]);

    // Khởi tạo kết nối SignalR
    const initSignalR = async () => {
        try {
            await startConnection();
            const conn = getConnection();  // goi ben shared/api/signalR.ts

            setConnectionStatus(conn.state);
            conn.onclose(() => setConnectionStatus("Disconnected"));
            conn.onreconnected(() => setConnectionStatus("Connected"));

            // Lang nghe event cua server
            conn.on("ReceiveBid", (auctionId, bidderId, bidderAmount) => {
                console.log("Nhận bid mới:", bidderId, bidderAmount);

                setBids(prev => [
                    { bidderId, amount: bidderAmount, time: new Date().toLocaleString('vi-VN') },
                    ...prev
                ]);

                setCurrentPrice(bidderAmount); // cập nhật giá hiện tại 
            });

            // Nhận lỗi khi bid bị từ chối
            conn.on("BidRejected", (message) => {
                alert(`Đặt giá thất bại: ${message}`);
            });

        } catch (error) {
            console.error("Lỗi kết nối SignalR:", error);
            setConnectionStatus("Error");
        }
    };

    // Lấy thông tin chi tiết đấu giá
    const fetchAuctionDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            const auctionResponse = await api.get(`/Auctions/${id}`);

            if (auctionResponse.data?.isSuccess && auctionResponse.data.result) {
                const auctionData: AuctionCustom = auctionResponse.data.result;
                setAuction(auctionData);

                // Tính giá khởi tạo
                const initPrice = auctionData.bids?.length
                    ? Math.max(...auctionData.bids.map(b => b.bidAmount))
                    : auctionData.startPrice;
                setCurrentPrice(initPrice);

                // Load lịch sử bid
                if (auctionData.bids) {
                    const initialBids = auctionData.bids.map(bid => ({
                        bidderId: bid.bidderId,
                        amount: bid.bidAmount,
                        time: new Date(bid.bidTime).toLocaleString('vi-VN')
                    }));
                    setBids(initialBids.reverse()); // Hiển thị bid mới nhất trên cùng
                }

                // Lấy thông tin xe
                await fetchVehicleDetails(auctionData.vehicleId);
            } else {
                throw new Error(auctionResponse.data?.message || "Không thể tải thông tin đấu giá");
            }
        } catch (err: any) {
            console.error("❌ Lỗi fetch auction detail:", err);
            setError(err.message || "Không thể tải thông tin đấu giá");
        } finally {
            setLoading(false);
        }
    };

    // Lấy thông tin chi tiết xe
    const fetchVehicleDetails = async (vehicleId: number) => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}vehicle/${vehicleId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (data?.isSuccess && data.result) {
                setVehicle(data.result);
            } else {
                throw new Error("Không nhận được thông tin xe");
            }
        } catch (err: any) {
            console.error("❌ Lỗi fetch vehicle:", err);
            setError(err.message || "Không thể tải thông tin xe");
        }
    };

    // Tham gia phòng đấu giá
    const handleJoinAuction = async () => {
        if (!id) return;
        const conn = getConnection();

        if (conn.state !== "Connected") {
            // alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
            return;
        }

        try {
            await conn.invoke("JoinAuction", parseInt(id));
            setJoined(true);
        } catch (err: any) {
            console.error("Lỗi tham gia đấu giá:", err);
            // alert("Tham gia đấu giá thất bại. Vui lòng thử lại.");
        }
    };

    // Gửi giá đấu
    const handleBid = async () => {
        if (!bidPrice || !id || !joined) return;

        const conn = getConnection();
        if (conn.state !== "Connected") {
            return;
        }

        const bidAmount = parseFloat(bidPrice);
        if (isNaN(bidAmount) || bidAmount <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ");
            return;
        }

        try {
            const userId = localStorage.getItem("userId") || "1";
            await conn.invoke("SendBid", parseInt(id), parseInt(userId), bidAmount);
            setBidPrice("");
        } catch (err: any) {
            console.error("Lỗi gửi bid:", err);
        }
    };

    const retryFetch = () => fetchAuctionDetail();

    const formatPrice = (price: number) => new Intl.NumberFormat("vi-VN").format(price);

    // Loading
    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                </div>
                <Footer />
            </>
        );
    }

    // Error
    if (error) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-4 text-red-600">Lỗi tải dữ liệu</h3>
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
    }

    if (!auction || !vehicle) return null;

    const timeLeft = new Date(auction.endTime).getTime() - Date.now();
    const hours = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((timeLeft / (1000 * 60)) % 60));

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${connectionStatus === "Connected"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}>
                        Trạng thái kết nối: {connectionStatus}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Ảnh xe */}
                        <div>
                            <img
                                src={vehicle.vehicleImages?.[selectedImage] || "/images/default-car.jpg"}
                                alt={vehicle.vehicleName}
                                className="rounded-2xl shadow-lg w-full h-96 object-cover"
                            />
                        </div>

                        {/* Thông tin đấu giá */}
                        <div className="space-y-6">
                            <h1 className="text-3xl font-bold text-gray-900">{vehicle.vehicleName}</h1>
                            <p className="text-gray-600">{vehicle.brand} - {vehicle.model} - {vehicle.year}</p>

                            <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-2xl text-white">
                                <div className="flex justify-between mb-4">
                                    <span>Còn lại: {hours}h {minutes}m</span>
                                    <span>Đang đấu giá</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-blue-100">Giá khởi điểm</p>
                                        <p className="text-xl font-semibold">{formatPrice(auction.startPrice)} VNĐ</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-blue-100">Giá hiện tại</p>
                                        <p className="text-2xl font-bold text-yellow-300">
                                            {formatPrice(currentPrice)} VNĐ
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Nếu chưa join thì hiển thị nút join */}
                            {!joined ? (
                                <button
                                    onClick={handleJoinAuction}
                                    disabled={connectionStatus !== "Connected"}
                                    className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                                >
                                    Tham gia đấu giá
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        value={bidPrice}
                                        onChange={(e) => setBidPrice(e.target.value)}
                                        placeholder="Nhập giá của bạn"
                                        className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-lg"
                                    />
                                    <button
                                        onClick={handleBid}
                                        disabled={!bidPrice || connectionStatus !== "Connected"}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                                    >
                                        Đặt giá
                                    </button>
                                </div>
                            )}

                            {/* Lịch sử bid */}
                            {bids.length > 0 && (
                                <div className="bg-white rounded-xl shadow p-4 max-h-60 overflow-y-auto">
                                    <h3 className="font-semibold mb-3">📜 Lịch sử đặt giá</h3>
                                    {bids.map((bid, i) => (
                                        <div key={i} className="flex justify-between py-2 border-b last:border-0">
                                            <span>Người {bid.bidderId}</span>
                                            <span className="font-semibold text-green-600">{formatPrice(bid.amount)} VNĐ</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default AuctionDetail;
