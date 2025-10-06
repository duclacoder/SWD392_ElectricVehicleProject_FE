import React, { useState, useEffect } from "react";
import { Footer } from "../../Widgets/Footers/Footer.tsx";
import { Header } from "../../Widgets/Headers/Header.tsx";
import { AuctionCard } from "../Auction/UI/AuctionCard.tsx";
import {
    Search,
    Filter as FilterIcon,
    TrendingUp,
    Clock,
    Sparkles,
    RefreshCw
} from "lucide-react";
import { getConnection, startConnection } from "../../shared/api/signalR.js";
import api from "../../shared/api/axios.ts";
import type { AuctionCustom, AuctionVehicleDetails, CombinedData } from "../../entities/Auction.ts";
import type { PaginatedResult } from "../../entities/Response.ts";

const AuctionPage: React.FC = () => {
    const [brandFilter, setBrandFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [combinedData, setCombinedData] = useState<CombinedData[]>([]);

    useEffect(() => {
        async function initSignalR() {
            try {
                await startConnection();
                const conn = getConnection();
                console.log("SignalR state:", conn.state);
                console.log("SignalR connectionId:", conn.connectionId);
            } catch (error) {
                console.error("SignalR connection failed:", error);
            }
        }
        initSignalR();
    }, []);

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get("/Auctions", {
                params: {
                    page: 1,
                    pageSize: 10
                }
            });


            if (response.data && response.data.isSuccess && response.data.result) {
                const pagedResult: PaginatedResult<AuctionCustom> = response.data.result;
                const fetchedAuctions: AuctionCustom[] = pagedResult.items;

                if (fetchedAuctions.length === 0) {
                    setCombinedData([]);
                    setLoading(false);
                    return;
                }

                await fetchVehiclesForAuctions(fetchedAuctions);
            } else {
                throw new Error(response.data?.message || "Failed to fetch auctions");
            }
        } catch (err: any) {
            console.error("Lỗi fetch auctions:", err);
            setError(err.message || "Không thể tải danh sách đấu giá");
            setLoading(false);
        }
    };

    const fetchVehiclesForAuctions = async (fetchedAuctions: AuctionCustom[]) => {
        try {
            const vehiclePromises = fetchedAuctions.map(async (auction) => {
                try {
                    // ✅ API Vehicle: /vehicle/{id} (KHÔNG có /api/)
                    const vehicleResponse = await fetchVehicleDirectly(auction.vehicleId);

                    if (vehicleResponse) {
                        const vehicle: AuctionVehicleDetails = vehicleResponse;

                        // Tính currentPrice từ bids nếu có
                        const currentPrice = auction.bids && auction.bids.length > 0
                            ? Math.max(...auction.bids.map(b => b.bidAmount))
                            : auction.startPrice;

                        // Augment auction với currentPrice
                        const augmentedAuction = {
                            ...auction,
                            currentPrice
                        };

                        return {
                            auction: augmentedAuction,
                            vehicle
                        } as CombinedData;
                    } else {
                        console.warn(`Không nhận được vehicle data cho vehicleId: ${auction.vehicleId}`);
                        return null;
                    }
                } catch (vehicleError) {
                    console.error(`Lỗi fetch vehicle ${auction.vehicleId}:`, vehicleError);
                    return null;
                }
            });

            const combinedResults = await Promise.all(vehiclePromises);
            const validCombined = combinedResults.filter((item): item is CombinedData => item !== null);

            console.log(`✅ Hoàn thành fetch ${validCombined.length}/${fetchedAuctions.length} vehicles`);
            setCombinedData(validCombined);

        } catch (err: any) {
            console.error("Lỗi fetch vehicles:", err);
            setError(err.message || "Không thể tải thông tin xe");
        } finally {
            setLoading(false);
        }
    };

    const fetchVehicleDirectly = async (vehicleId: number): Promise<AuctionVehicleDetails | null> => {
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data && data.isSuccess && data.result) {
                return data.result;
            } else {
                console.warn(`Vehicle API returned no data for ID: ${vehicleId}`);
                return null;
            }
        } catch (error) {
            console.error(`Lỗi fetch vehicle ${vehicleId}:`, error);
            return null;
        }
    };

    const retryFetch = () => {
        fetchAuctions();
    };

    const resetFilters = () => {
        setBrandFilter("");
        setYearFilter("");
        setKeyword("");
        setStatusFilter("all");
        setSortBy("newest");
    };

    // Lọc dữ liệu
    const filteredData = combinedData.filter(({ auction, vehicle }) => {
        const normalizedStatus = auction.status.toLowerCase();
        const matchesBrand = !brandFilter || vehicle.brand === brandFilter;
        const matchesYear = !yearFilter || vehicle.year.toString() === yearFilter;
        const matchesKeyword = !keyword ||
            vehicle.vehicleName.toLowerCase().includes(keyword.toLowerCase()) ||
            vehicle.brand.toLowerCase().includes(keyword.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(keyword.toLowerCase());
        const matchesStatus = statusFilter === "all" || normalizedStatus === statusFilter;

        return matchesBrand && matchesYear && matchesKeyword && matchesStatus;
    });

    // Sort dữ liệu
    const sortedData = [...filteredData].sort((a, b) => {
        const priceA = a.auction.currentPrice ?? a.auction.startPrice;
        const priceB = b.auction.currentPrice ?? b.auction.startPrice;

        switch (sortBy) {
            case "price-low":
                return priceA - priceB;
            case "price-high":
                return priceB - priceA;
            case "ending-soon":
                return new Date(a.auction.endTime).getTime() - new Date(b.auction.endTime).getTime();
            case "newest":
            default:
                return new Date(b.auction.startTime).getTime() - new Date(a.auction.startTime).getTime();
        }
    });

    const activeAuctionsCount = combinedData.filter(item =>
        item.auction.status.toLowerCase() === "active"
    ).length;

    const totalBids = combinedData.reduce((sum, item) =>
        sum + (item.auction.bids?.length || 0), 0
    );

    const availableBrands = Array.from(new Set(combinedData.map(item => item.vehicle.brand)))
        .filter(brand => brand)
        .sort();

    const availableYears = Array.from(new Set(combinedData.map(item => item.vehicle.year)))
        .filter(year => year)
        .sort((a, b) => b - a);

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Đang tải dữ liệu đấu giá...</p>
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
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto">
                        <div className="text-red-500 text-6xl mb-4">❌</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">Lỗi tải dữ liệu</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={retryFetch}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Thử lại
                            </button>
                            <button
                                onClick={resetFilters}
                                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                            >
                                Reset bộ lọc
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white py-16">
                <div className="absolute inset-0 bg-white opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Đấu Giá Xe Ô Tô Cao Cấp
                    </h1>
                    <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                        Khám phá những chiếc xe tốt nhất với mức giá hợp lý thông qua đấu giá trực tuyến
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30">
                            <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{combinedData.length}</div>
                            <div className="text-blue-100">Phiên đấu giá</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30">
                            <Clock className="w-8 h-8 text-white mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{activeAuctionsCount}</div>
                            <div className="text-blue-100">Đang diễn ra</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 border border-white/30">
                            <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white">{totalBids}+</div>
                            <div className="text-blue-100">Lượt đặt giá</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="sticky top-0 z-40 bg-white shadow-lg border-b border-blue-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                            >
                                <FilterIcon className="w-4 h-4" />
                                Bộ lọc
                            </button>

                            <div className="text-sm text-gray-700">
                                Tìm thấy <span className="font-bold text-blue-600">{sortedData.length}</span> kết quả
                                {combinedData.length > 0 && (
                                    <span className="text-gray-500 ml-2">
                                        (tổng cộng {combinedData.length} phiên đấu giá)
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 items-center">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Đang diễn ra</option>
                                <option value="pending">Sắp diễn ra</option>
                                <option value="ended">Đã kết thúc</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="ending-soon">Sắp kết thúc</option>
                                <option value="price-low">Giá thấp đến cao</option>
                                <option value="price-high">Giá cao đến thấp</option>
                            </select>

                            {error && (
                                <button
                                    onClick={retryFetch}
                                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Thử lại
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Brand */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hãng xe
                                    </label>
                                    <select
                                        value={brandFilter}
                                        onChange={(e) => setBrandFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Tất cả hãng xe</option>
                                        {availableBrands.map(brand => (
                                            <option key={brand} value={brand}>{brand}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Year */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Năm sản xuất
                                    </label>
                                    <select
                                        value={yearFilter}
                                        onChange={(e) => setYearFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Tất cả năm</option>
                                        {availableYears.map(year => (
                                            <option key={year} value={year.toString()}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Keyword */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Từ khóa
                                    </label>
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        placeholder="Tìm theo tên, hãng xe, model..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-4">
                                <button
                                    onClick={resetFilters}
                                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                                >
                                    Reset bộ lọc
                                </button>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 bg-white">
                {sortedData.length === 0 ? (
                    <div className="text-center py-16">
                        <Search className="w-24 h-24 text-blue-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">
                            {combinedData.length === 0 ? 'Không có phiên đấu giá nào' : 'Không tìm thấy kết quả'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {combinedData.length === 0
                                ? 'Hiện tại chưa có phiên đấu giá nào. Vui lòng quay lại sau.'
                                : 'Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm'
                            }
                        </p>
                        {combinedData.length > 0 ? (
                            <button
                                onClick={resetFilters}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                            >
                                Reset bộ lọc
                            </button>
                        ) : (
                            <button
                                onClick={retryFetch}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md flex items-center gap-2 mx-auto"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Tải lại
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Gọi AuctionCard với sortedData */}
                        <AuctionCard auctions={sortedData} />

                        {/* Load More (placeholder) */}
                        {sortedData.length >= 10 && (
                            <div className="text-center mt-12">
                                <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold shadow-sm">
                                    Xem thêm phiên đấu giá
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </>
    );
};

export default AuctionPage;