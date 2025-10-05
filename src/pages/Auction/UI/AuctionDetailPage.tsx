// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Header } from "../../../Widgets/Headers/Header";
// import { Footer } from "../../../Widgets/Footers/Footer";
// import { Clock, Gauge, Calendar, User, Shield, Zap, Award, MapPin, RefreshCw } from "lucide-react";
// import type { AuctionCustom } from "../../../entities/Auction";
// import type { AuctionVehicleDetails } from "../../../entities/Auction";
// import api from "../../../shared/api/axios.ts";

// const AuctionDetail: React.FC = () => {
//     const { id } = useParams();
//     const [auction, setAuction] = useState<AuctionCustom | null>(null);
//     const [vehicle, setVehicle] = useState<AuctionVehicleDetails | null>(null);
//     const [bidPrice, setBidPrice] = useState("");
//     const [selectedImage, setSelectedImage] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (id) {
//             fetchAuctionDetail();
//         }
//     }, [id]);

//     const fetchAuctionDetail = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             console.log("🔄 Bắt đầu fetch auction detail...");

//             // ✅ Fetch auction details
//             const auctionResponse = await api.get(`/Auctions/${id}`);

//             if (auctionResponse.data && auctionResponse.data.isSuccess && auctionResponse.data.result) {
//                 const auctionData: AuctionCustom = auctionResponse.data.result;
//                 setAuction(auctionData);
//                 console.log("✅ Nhận được auction:", auctionData);

//                 // ✅ Fetch vehicle details
//                 await fetchVehicleDetails(auctionData.vehicleId);
//             } else {
//                 throw new Error(auctionResponse.data?.message || "Failed to fetch auction details");
//             }
//         } catch (err: any) {
//             console.error("❌ Lỗi fetch auction detail:", err);
//             setError(err.message || "Không thể tải thông tin đấu giá");
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchVehicleDetails = async (vehicleId: number) => {
//         try {
//             console.log(`🔄 Fetching vehicle ${vehicleId}...`);

//             // ✅ API Vehicle: /vehicle/{id} (KHÔNG có /api/)
//             const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//             const response = await fetch(`${API_BASE_URL}vehicle/${vehicleId}`, {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 },
//                 credentials: 'include'
//             });

//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const data = await response.json();

//             if (data && data.isSuccess && data.result) {
//                 const vehicleData: AuctionVehicleDetails = data.result;
//                 setVehicle(vehicleData);
//                 console.log("✅ Nhận được vehicle:", vehicleData);
//             } else {
//                 throw new Error("Không nhận được thông tin xe");
//             }
//         } catch (err: any) {
//             console.error("❌ Lỗi fetch vehicle:", err);
//             setError(err.message || "Không thể tải thông tin xe");
//         }
//     };

//     const retryFetch = () => {
//         fetchAuctionDetail();
//     };

//     const formatPrice = (price: number) =>
//         new Intl.NumberFormat("vi-VN").format(price);

//     const handleBid = () => {
//         if (!bidPrice) return;
//         // Xử lý đặt giá
//         console.log("Đặt giá:", bidPrice);
//         setBidPrice("");
//     };

//     if (loading) {
//         return (
//             <>
//                 <Header />
//                 <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                     <div className="flex flex-col items-center space-y-4">
//                         <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
//                         <p className="text-gray-600">Đang tải thông tin đấu giá...</p>
//                     </div>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     if (error) {
//         return (
//             <>
//                 <Header />
//                 <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                     <div className="text-center max-w-md mx-auto">
//                         <div className="text-red-500 text-6xl mb-4">❌</div>
//                         <h3 className="text-2xl font-bold text-gray-700 mb-2">Lỗi tải dữ liệu</h3>
//                         <p className="text-gray-600 mb-6">{error}</p>
//                         <button
//                             onClick={retryFetch}
//                             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
//                         >
//                             <RefreshCw className="w-4 h-4" />
//                             Thử lại
//                         </button>
//                     </div>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     if (!auction || !vehicle) {
//         return (
//             <>
//                 <Header />
//                 <div className="min-h-screen flex items-center justify-center bg-gray-50">
//                     <div className="text-center">
//                         <p className="text-gray-600">Không tìm thấy thông tin đấu giá</p>
//                     </div>
//                 </div>
//                 <Footer />
//             </>
//         );
//     }

//     // Tính thời gian còn lại
//     const timeLeft = new Date(auction.endTime).getTime() - Date.now();
//     const hours = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
//     const minutes = Math.max(0, Math.floor((timeLeft / (1000 * 60)) % 60));

//     // Tính current price từ bids nếu có
//     const currentPrice = auction.bids && auction.bids.length > 0
//         ? Math.max(...auction.bids.map(b => b.bidAmount))
//         : auction.startPrice;

//     return (
//         <>
//             <Header />
//             <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
//                 <div className="max-w-7xl mx-auto px-4 py-8">
//                     {/* Breadcrumb */}
//                     <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
//                         <span>Đấu giá</span>
//                         <span>›</span>
//                         <span>Xe hơi</span>
//                         <span>›</span>
//                         <span className="text-blue-600 font-medium">{vehicle.brand}</span>
//                     </nav>

//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//                         {/* Left: Image Gallery */}
//                         <div className="space-y-4">
//                             <div className="relative bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
//                                 <img
//                                     src={vehicle.vehicleImages?.[selectedImage] || "/images/default-car.jpg"}
//                                     alt={vehicle.vehicleName}
//                                     className="w-full h-96 object-cover rounded-xl"
//                                 />

//                                 {/* Badge */}
//                                 <div className="absolute top-6 left-6">
//                                     <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
//                                         <Shield className="w-4 h-4" />
//                                         <span>Đã xác thực</span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Thumbnail Gallery */}
//                             {vehicle.vehicleImages && vehicle.vehicleImages.length > 1 && (
//                                 <div className="grid grid-cols-4 gap-3">
//                                     {vehicle.vehicleImages.map((img, idx) => (
//                                         <button
//                                             key={idx}
//                                             onClick={() => setSelectedImage(idx)}
//                                             className={`relative h-24 rounded-xl border-2 transition-all duration-200 overflow-hidden ${selectedImage === idx
//                                                 ? "border-blue-500 shadow-md"
//                                                 : "border-gray-200 hover:border-gray-300"
//                                                 }`}
//                                         >
//                                             <img
//                                                 src={img}
//                                                 alt={`${vehicle.vehicleName}-${idx}`}
//                                                 className="w-full h-full object-cover"
//                                             />
//                                         </button>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Right: Auction Details */}
//                         <div className="space-y-6">
//                             {/* Header */}
//                             <div>
//                                 <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
//                                     {vehicle.vehicleName}
//                                 </h1>
//                                 <p className="text-gray-600 mt-3 text-lg leading-relaxed">
//                                     {`${vehicle.brand} ${vehicle.model} - ${vehicle.year} - ${vehicle.color}`}
//                                 </p>
//                             </div>

//                             {/* Vehicle Specs */}
//                             <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
//                                 <div className="text-center">
//                                     <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
//                                     <div className="text-sm text-gray-600">Năm sản xuất</div>
//                                     <div className="font-semibold text-gray-900">{vehicle.year}</div>
//                                 </div>
//                                 <div className="text-center">
//                                     <Gauge className="w-8 h-8 text-blue-600 mx-auto mb-2" />
//                                     <div className="text-sm text-gray-600">Số km</div>
//                                     <div className="font-semibold text-gray-900">{vehicle.km?.toLocaleString()} km</div>
//                                 </div>
//                                 <div className="text-center">
//                                     <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
//                                     <div className="text-sm text-gray-600">Số chỗ</div>
//                                     <div className="font-semibold text-gray-900">{vehicle.seats} chỗ</div>
//                                 </div>
//                             </div>

//                             {/* Auction Info */}
//                             <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <div className="flex items-center space-x-2">
//                                         <Zap className="w-6 h-6" />
//                                         <span className="font-semibold">ĐANG ĐẤU GIÁ</span>
//                                     </div>
//                                     <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
//                                         <Clock className="w-4 h-4" />
//                                         <span className="font-medium">{hours}h {minutes}m</span>
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-6">
//                                     <div>
//                                         <div className="text-blue-100 text-sm">Giá khởi điểm</div>
//                                         <div className="text-2xl font-bold">
//                                             {formatPrice(auction.startPrice)} VNĐ
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <div className="text-blue-100 text-sm">Giá hiện tại</div>
//                                         <div className="text-3xl font-bold text-yellow-300">
//                                             {formatPrice(currentPrice)} VNĐ
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Bid Section */}
//                             <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//                                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
//                                     <Award className="w-5 h-5 text-blue-600" />
//                                     <span>Đặt giá của bạn</span>
//                                 </h3>

//                                 <div className="space-y-4">
//                                     <div className="flex space-x-3">
//                                         <div className="flex-1">
//                                             <input
//                                                 type="number"
//                                                 value={bidPrice}
//                                                 onChange={(e) => setBidPrice(e.target.value)}
//                                                 placeholder="Nhập số tiền (VNĐ)"
//                                                 className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                                             />
//                                         </div>
//                                         <button
//                                             onClick={handleBid}
//                                             disabled={!bidPrice}
//                                             className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
//                                         >
//                                             Đặt giá
//                                         </button>
//                                     </div>
//                                     <p className="text-sm text-gray-500 text-center">
//                                         Bước giá tối thiểu: 10,000,000 VNĐ
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Quick Stats */}
//                             <div className="grid grid-cols-3 gap-4">
//                                 <div className="text-center p-4 bg-white rounded-xl shadow border border-gray-100">
//                                     <div className="text-2xl font-bold text-blue-600">
//                                         {auction.bids?.length || 0}
//                                     </div>
//                                     <div className="text-sm text-gray-600">Lượt đặt</div>
//                                 </div>
//                                 <div className="text-center p-4 bg-white rounded-xl shadow border border-gray-100">
//                                     <div className="text-2xl font-bold text-green-600">45</div>
//                                     <div className="text-sm text-gray-600">Đang theo dõi</div>
//                                 </div>
//                                 <div className="text-center p-4 bg-white rounded-xl shadow border border-gray-100">
//                                     <div className="text-2xl font-bold text-purple-600">1.2k</div>
//                                     <div className="text-sm text-gray-600">Lượt xem</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Additional Information */}
//                     <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
//                         {/* Vehicle Details */}
//                         <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//                             <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center space-x-2">
//                                 <span>📋</span>
//                                 <span>Thông tin chi tiết</span>
//                             </h2>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div className="space-y-3">
//                                     <div className="flex justify-between py-2 border-b border-gray-100">
//                                         <span className="text-gray-600">Hãng xe</span>
//                                         <span className="font-semibold">{vehicle.brand}</span>
//                                     </div>
//                                     <div className="flex justify-between py-2 border-b border-gray-100">
//                                         <span className="text-gray-600">Mẫu xe</span>
//                                         <span className="font-semibold">{vehicle.model}</span>
//                                     </div>
//                                     <div className="flex justify-between py-2 border-b border-gray-100">
//                                         <span className="text-gray-600">Màu sắc</span>
//                                         <span className="font-semibold">{vehicle.color}</span>
//                                     </div>
//                                     <div className="flex justify-between py-2 border-b border-gray-100">
//                                         <span className="text-gray-600">Kiểu dáng</span>
//                                         <span className="font-semibold">{vehicle.bodyType}</span>
//                                     </div>
//                                 </div>
//                                 <div className="space-y-3">
//                                     <div className="flex justify-between py-2 border-b border-gray-100">
//                                         <span className="text-gray-600">Số chỗ</span>
//                                         <span className="font-semibold">{vehicle.seats} chỗ</span>
//                                     </div>
//                                     <div className="flex justify-between py-2 border-b border-gray-100">
//                                         <span className="text-gray-600">Sạc nhanh</span>
//                                         <span className="font-semibold">
//                                             {vehicle.fastChargingSupport ? "Có hỗ trợ" : "Không hỗ trợ"}
//                                         </span>
//                                     </div>
//                                     <div className="flex justify-between py-2 border-b border-gray-100">
//                                         <span className="text-gray-600">Tình trạng pin</span>
//                                         <span className="font-semibold">{vehicle.batteryStatus || "Không xác định"}</span>
//                                     </div>
//                                     <div className="flex justify-between py-2 border-b border-gray-100">
//                                         <span className="text-gray-600">Bảo hành</span>
//                                         <span className="font-semibold">
//                                             {vehicle.warrantyMonths ? `${vehicle.warrantyMonths} tháng` : "Không có"}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Auction Terms */}
//                         <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
//                             <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center space-x-2">
//                                 <span>⚡</span>
//                                 <span>Thông tin đấu giá</span>
//                             </h2>
//                             <ul className="space-y-3 text-gray-700">
//                                 <li className="flex items-start space-x-3">
//                                     <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
//                                     <span>Trạng thái: <strong className="capitalize">{auction.status}</strong></span>
//                                 </li>
//                                 <li className="flex items-start space-x-3">
//                                     <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
//                                     <span>Bắt đầu: <strong>{new Date(auction.startTime).toLocaleString('vi-VN')}</strong></span>
//                                 </li>
//                                 <li className="flex items-start space-x-3">
//                                     <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
//                                     <span>Kết thúc: <strong>{new Date(auction.endTime).toLocaleString('vi-VN')}</strong></span>
//                                 </li>
//                                 <li className="flex items-start space-x-3">
//                                     <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
//                                     <span>Số lượt đặt giá: <strong>{auction.bids?.length || 0}</strong></span>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                 </div>
//             </main>
//             <Footer />
//         </>
//     );
// };

// export default AuctionDetail;

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

            // Update connection status
            setConnectionStatus(conn.state);

            // Listen for connection state changes
            conn.onclose(() => setConnectionStatus("Disconnected"));
            conn.onreconnected(() => setConnectionStatus("Connected"));

            // Listen for new bids
            conn.on("ReceiveBid", (auctionId, bidderId, bidderAmount) => {
                console.log("Nhận bid mới:", auctionId, bidderId, bidderAmount);
                setBids(prev => [
                    { bidderId, amount: bidderAmount, time: new Date().toLocaleString('vi-VN') },
                    ...prev
                ]);
                // Update current price in auction
                setAuction(prev => prev ? { ...prev, currentPrice: bidderAmount } : prev);
            });

            // Listen for bid rejections
            conn.on("BidRejected", (message) => {
                alert(`Đặt giá thất bại: ${message}`);
            });

        } catch (error) {
            console.error("❌ Lỗi kết nối SignalR:", error);
            setConnectionStatus("Error");
        }
    };

    const fetchAuctionDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log("🔄 Bắt đầu fetch auction detail...");

            // ✅ Fetch auction details
            const auctionResponse = await api.get(`/Auctions/${id}`);

            if (auctionResponse.data && auctionResponse.data.isSuccess && auctionResponse.data.result) {
                const auctionData: AuctionCustom = auctionResponse.data.result;
                setAuction(auctionData);
                console.log("✅ Nhận được auction:", auctionData);

                // Initialize bids from auction data
                if (auctionData.bids) {
                    const initialBids = auctionData.bids.map(bid => ({
                        bidderId: bid.bidderId,
                        amount: bid.bidAmount,
                        time: new Date(bid.bidTime).toLocaleString('vi-VN')
                    }));
                    setBids(initialBids);
                }

                // ✅ Fetch vehicle details
                await fetchVehicleDetails(auctionData.vehicleId);
            } else {
                throw new Error(auctionResponse.data?.message || "Failed to fetch auction details");
            }
        } catch (err: any) {
            console.error("❌ Lỗi fetch auction detail:", err);
            setError(err.message || "Không thể tải thông tin đấu giá");
        } finally {
            setLoading(false);
        }
    };

    const fetchVehicleDetails = async (vehicleId: number) => {
        try {
            console.log(`🔄 Fetching vehicle ${vehicleId}...`);

            // ✅ API Vehicle: /vehicle/{id} (KHÔNG có /api/)
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await fetch(`${API_BASE_URL}vehicle/${vehicleId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.isSuccess && data.result) {
                const vehicleData: AuctionVehicleDetails = data.result;
                setVehicle(vehicleData);
                console.log("✅ Nhận được vehicle:", vehicleData);
            } else {
                throw new Error("Không nhận được thông tin xe");
            }
        } catch (err: any) {
            console.error("❌ Lỗi fetch vehicle:", err);
            setError(err.message || "Không thể tải thông tin xe");
        }
    };

    const handleJoinAuction = async () => {
        if (!id) return;

        const conn = getConnection();
        if (conn.state !== "Connected") {
            alert("Không thể kết nối đến server. Vui lòng thử lại sau.");
            return;
        }

        try {
            await conn.invoke("JoinAuction", parseInt(id));
            setJoined(true);
            console.log("✅ Đã tham gia auction:", id);
            alert("Tham gia đấu giá thành công! Bạn có thể đặt giá ngay bây giờ.");
        } catch (err: any) {
            console.error("❌ Lỗi tham gia auction:", err);
            alert("Tham gia đấu giá thất bại. Vui lòng thử lại.");
        }
    };

    const handleBid = async () => {
        if (!bidPrice || !id || !joined) return;

        const conn = getConnection();
        if (conn.state !== "Connected") {
            alert("Mất kết nối đến server. Vui lòng thử lại.");
            return;
        }

        const bidAmount = parseFloat(bidPrice);
        if (isNaN(bidAmount) || bidAmount <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ");
            return;
        }

        try {
            // Get current user ID from localStorage or context
            const userId = localStorage.getItem("userId") || "999"; // Fallback user ID

            await conn.invoke("SendBid", parseInt(id), parseInt(userId), bidAmount);
            console.log("✅ Đã gửi bid:", bidAmount);
            setBidPrice("");
        } catch (err: any) {
            console.error("❌ Lỗi gửi bid:", err);
            // Error message will be handled by BidRejected event
        }
    };

    const retryFetch = () => {
        fetchAuctionDetail();
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("vi-VN").format(price);

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="text-gray-600">Đang tải thông tin đấu giá...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center max-w-md mx-auto">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">Lỗi tải dữ liệu</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={retryFetch}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Thử lại
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!auction || !vehicle) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <p className="text-gray-600">Không tìm thấy thông tin đấu giá</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    // Tính thời gian còn lại
    const timeLeft = new Date(auction.endTime).getTime() - Date.now();
    const hours = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((timeLeft / (1000 * 60)) % 60));

    // Tính current price từ bids nếu có
    const currentPrice = auction.bids && auction.bids.length > 0
        ? Math.max(...auction.bids.map(b => b.bidAmount))
        : auction.startPrice;

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Connection Status */}
                    <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${connectionStatus === "Connected" ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        Trạng thái kết nối: {connectionStatus === "Connected" ? "Đã kết nối" : "Mất kết nối"}
                    </div>

                    {/* Breadcrumb */}
                    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
                        <span>Đấu giá</span>
                        <span>›</span>
                        <span>Xe hơi</span>
                        <span>›</span>
                        <span className="text-blue-600 font-medium">{vehicle.brand}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left: Image Gallery */}
                        <div className="space-y-4">
                            <div className="relative bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                                <img
                                    src={vehicle.vehicleImages?.[selectedImage] || "/images/default-car.jpg"}
                                    alt={vehicle.vehicleName}
                                    className="w-full h-96 object-cover rounded-xl"
                                />

                                {/* Badge */}
                                <div className="absolute top-6 left-6">
                                    <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                                        <Shield className="w-4 h-4" />
                                        <span>Đã xác thực</span>
                                    </div>
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            {vehicle.vehicleImages && vehicle.vehicleImages.length > 1 && (
                                <div className="grid grid-cols-4 gap-3">
                                    {vehicle.vehicleImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(idx)}
                                            className={`relative h-24 rounded-xl border-2 transition-all duration-200 overflow-hidden ${selectedImage === idx
                                                ? "border-blue-500 shadow-md"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`${vehicle.vehicleName}-${idx}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Auction Details */}
                        <div className="space-y-6">
                            {/* Header */}
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                                    {vehicle.vehicleName}
                                </h1>
                                <p className="text-gray-600 mt-3 text-lg leading-relaxed">
                                    {`${vehicle.brand} ${vehicle.model} - ${vehicle.year} - ${vehicle.color}`}
                                </p>
                            </div>

                            {/* Vehicle Specs */}
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                                <div className="text-center">
                                    <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-sm text-gray-600">Năm sản xuất</div>
                                    <div className="font-semibold text-gray-900">{vehicle.year}</div>
                                </div>
                                <div className="text-center">
                                    <Gauge className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-sm text-gray-600">Số km</div>
                                    <div className="font-semibold text-gray-900">{vehicle.km?.toLocaleString()} km</div>
                                </div>
                                <div className="text-center">
                                    <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <div className="text-sm text-gray-600">Số chỗ</div>
                                    <div className="font-semibold text-gray-900">{vehicle.seats} chỗ</div>
                                </div>
                            </div>

                            {/* Auction Info */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <Zap className="w-6 h-6" />
                                        <span className="font-semibold">ĐANG ĐẤU GIÁ</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                                        <Clock className="w-4 h-4" />
                                        <span className="font-medium">{hours}h {minutes}m</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-blue-100 text-sm">Giá khởi điểm</div>
                                        <div className="text-2xl font-bold">
                                            {formatPrice(auction.startPrice)} VNĐ
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-blue-100 text-sm">Giá hiện tại</div>
                                        <div className="text-3xl font-bold text-yellow-300">
                                            {formatPrice(currentPrice)} VNĐ
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Join Auction Section */}
                            {!joined ? (
                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                        <LogIn className="w-5 h-5 text-blue-600" />
                                        <span>Tham gia đấu giá</span>
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Bạn cần tham gia đấu giá để có thể đặt giá. Phí tham gia: <strong>5,000,000 VNĐ</strong>
                                    </p>
                                    <button
                                        onClick={handleJoinAuction}
                                        disabled={connectionStatus !== "Connected"}
                                        className="w-full px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <LogIn className="w-5 h-5" />
                                        Tham gia đấu giá
                                    </button>
                                </div>
                            ) : (
                                /* Bid Section - Only show when joined */
                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                        <Award className="w-5 h-5 text-blue-600" />
                                        <span>Đặt giá của bạn</span>
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="flex space-x-3">
                                            <div className="flex-1">
                                                <input
                                                    type="number"
                                                    value={bidPrice}
                                                    onChange={(e) => setBidPrice(e.target.value)}
                                                    placeholder="Nhập số tiền (VNĐ)"
                                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <button
                                                onClick={handleBid}
                                                disabled={!bidPrice || connectionStatus !== "Connected"}
                                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                            >
                                                Đặt giá
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 text-center">
                                            Bước giá tối thiểu: 10,000,000 VNĐ
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Quick Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-white rounded-xl shadow border border-gray-100">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {bids.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Lượt đặt</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-xl shadow border border-gray-100">
                                    <div className="text-2xl font-bold text-green-600">45</div>
                                    <div className="text-sm text-gray-600">Đang theo dõi</div>
                                </div>
                                <div className="text-center p-4 bg-white rounded-xl shadow border border-gray-100">
                                    <div className="text-2xl font-bold text-purple-600">1.2k</div>
                                    <div className="text-sm text-gray-600">Lượt xem</div>
                                </div>
                            </div>

                            {/* Bids History */}
                            {bids.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                        Lịch sử đặt giá
                                    </h3>
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {bids.map((bid, index) => (
                                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                                <div>
                                                    <span className="font-medium">Người {bid.bidderId}</span>
                                                    <span className="text-gray-500 text-sm ml-2">{bid.time}</span>
                                                </div>
                                                <span className="font-bold text-green-600">
                                                    {formatPrice(bid.amount)} VNĐ
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Vehicle Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center space-x-2">
                                <span>📋</span>
                                <span>Thông tin chi tiết</span>
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Hãng xe</span>
                                        <span className="font-semibold">{vehicle.brand}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Mẫu xe</span>
                                        <span className="font-semibold">{vehicle.model}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Màu sắc</span>
                                        <span className="font-semibold">{vehicle.color}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Kiểu dáng</span>
                                        <span className="font-semibold">{vehicle.bodyType}</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Số chỗ</span>
                                        <span className="font-semibold">{vehicle.seats} chỗ</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Sạc nhanh</span>
                                        <span className="font-semibold">
                                            {vehicle.fastChargingSupport ? "Có hỗ trợ" : "Không hỗ trợ"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Tình trạng pin</span>
                                        <span className="font-semibold">{vehicle.batteryStatus || "Không xác định"}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Bảo hành</span>
                                        <span className="font-semibold">
                                            {vehicle.warrantyMonths ? `${vehicle.warrantyMonths} tháng` : "Không có"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Auction Terms */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200 flex items-center space-x-2">
                                <span>⚡</span>
                                <span>Thông tin đấu giá</span>
                            </h2>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Trạng thái: <strong className="capitalize">{auction.status}</strong></span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Bắt đầu: <strong>{new Date(auction.startTime).toLocaleString('vi-VN')}</strong></span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Kết thúc: <strong>{new Date(auction.endTime).toLocaleString('vi-VN')}</strong></span>
                                </li>
                                <li className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                                    <span>Số lượt đặt giá: <strong>{bids.length}</strong></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default AuctionDetail;