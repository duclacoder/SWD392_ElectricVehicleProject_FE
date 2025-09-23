import React, { useState, useEffect } from "react";
import { Footer } from "../../Widgets/Footers/Footer.tsx";
import { Header } from "../../Widgets/Headers/Header.tsx";
import { AuctionCard } from "../Auction/UI/AuctionCard.tsx";
import type { Auction } from "../../entities/Auction.ts";
import type { Vehicle } from "../../entities/Vehicle.ts";
import XeMercedes from "../../shared/assets/banner.png";
import { Filter } from "./UI/Filter.tsx";
import {
    Search,
    Filter as FilterIcon,
    TrendingUp,
    Clock,
    Sparkles
} from "lucide-react";

// Tao fake data
const vehicleData: Vehicle[] = [
    {
        id: 1,
        user_id: 10,
        title: "Toyota Camry 2.5Q 2020",
        description: "Sedan hạng D, nội thất da sang trọng, camera 360",
        brand: "Toyota",
        model: "Camry",
        year: 2020,
        km: 35000,
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "available",
        images: [XeMercedes],
    },
    {
        id: 2,
        user_id: 11,
        title: "Honda Civic RS 2022",
        description: "Phiên bản thể thao, màu trắng ngọc trai",
        brand: "Honda",
        model: "Civic",
        year: 2022,
        km: 15000,
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "available",
        images: [XeMercedes],
    },
    {
        id: 3,
        user_id: 12,
        title: "Mercedes C300 AMG 2021",
        description: "Bản full option, màu đen bóng",
        brand: "Mercedes",
        model: "C-Class",
        year: 2021,
        km: 20000,
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "available",
        images: [XeMercedes],
    },
    {
        id: 4,
        user_id: 13,
        title: "Ford Ranger Raptor 2023",
        description: "Bản thể thao off-road, động cơ 2.0L",
        brand: "Ford",
        model: "Ranger",
        year: 2023,
        km: 8000,
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "available",
        images: [XeMercedes],
    },
    {
        id: 5,
        user_id: 14,
        title: "Hyundai Santa Fe 2021",
        description: "SUV 7 chỗ, công nghệ tiên tiến",
        brand: "Hyundai",
        model: "Santa Fe",
        year: 2021,
        km: 28000,
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "available",
        images: [XeMercedes],
    },
    {
        id: 6,
        user_id: 15,
        title: "BMW X5 2022",
        description: "SUV hạng sang, nội thất cao cấp",
        brand: "BMW",
        model: "X5",
        year: 2022,
        km: 12000,
        verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "available",
        images: [XeMercedes],
    },
];

const auctionData: Auction[] = [
    {
        id: 1,
        vehicle_id: 1,
        seller_id: 101,
        start_price: 800_000_000,
        current_price: 850_000_000,
        start_time: new Date(Date.now() - 3600 * 1000).toISOString(),
        end_time: new Date(Date.now() + 7200 * 1000).toISOString(),
        status: "active",
        entry_fee: 1_000_000,
        fee_per_minute: 5000,
    },
    {
        id: 2,
        vehicle_id: 2,
        seller_id: 102,
        start_price: 700_000_000,
        current_price: 720_000_000,
        start_time: new Date(Date.now() + 3600 * 1000).toISOString(),
        end_time: new Date(Date.now() + 86400 * 1000).toISOString(),
        status: "pending",
        entry_fee: 800_000,
        fee_per_minute: 3000,
    },
    {
        id: 3,
        vehicle_id: 3,
        seller_id: 103,
        start_price: 1_200_000_000,
        current_price: 1_350_000_000,
        start_time: new Date(Date.now() - 7200 * 1000).toISOString(),
        end_time: new Date(Date.now() + 1800 * 1000).toISOString(),
        status: "active",
        entry_fee: 2_000_000,
        fee_per_minute: 8000,
    },
    {
        id: 4,
        vehicle_id: 4,
        seller_id: 104,
        start_price: 900_000_000,
        current_price: 950_000_000,
        start_time: new Date(Date.now() - 1800 * 1000).toISOString(),
        end_time: new Date(Date.now() + 5400 * 1000).toISOString(),
        status: "active",
        entry_fee: 1_500_000,
        fee_per_minute: 6000,
    },
    {
        id: 5,
        vehicle_id: 5,
        seller_id: 105,
        start_price: 600_000_000,
        current_price: 620_000_000,
        start_time: new Date(Date.now() + 10800 * 1000).toISOString(),
        end_time: new Date(Date.now() + 172800 * 1000).toISOString(),
        status: "pending",
        entry_fee: 700_000,
        fee_per_minute: 2500,
    },
    {
        id: 6,
        vehicle_id: 6,
        seller_id: 106,
        start_price: 1_500_000_000,
        current_price: 1_650_000_000,
        start_time: new Date(Date.now() - 14400 * 1000).toISOString(),
        end_time: new Date(Date.now() + 3600 * 1000).toISOString(),
        status: "active",
        entry_fee: 3_000_000,
        fee_per_minute: 10000,
    },
];

const AuctionPage: React.FC = () => {
    const [brandFilter, setBrandFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const resetFilters = () => {
        setBrandFilter("");
        setYearFilter("");
        setKeyword("");
        setStatusFilter("all");
        setSortBy("newest");
    };

    // Lấy auction map vào vehicle
    const combinedData = auctionData.map(auction => ({
        auction,
        vehicle: vehicleData.find(v => v.id === auction.vehicle_id)!
    }));

    // Lọc dữ liệu
    const filteredData = combinedData.filter(({ auction, vehicle }) => {
        const matchesBrand = !brandFilter || vehicle.brand === brandFilter;
        const matchesYear = !yearFilter || vehicle.year.toString() === yearFilter;
        const matchesKeyword = !keyword ||
            vehicle.title.toLowerCase().includes(keyword.toLowerCase()) ||
            vehicle.brand.toLowerCase().includes(keyword.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(keyword.toLowerCase());
        const matchesStatus = statusFilter === "all" || auction.status === statusFilter;

        return matchesBrand && matchesYear && matchesKeyword && matchesStatus;
    });

    const sortedData = [...filteredData].sort((a, b) => {
        const priceA = a.auction.current_price ?? a.auction.start_price;
        const priceB = b.auction.current_price ?? b.auction.start_price;

        switch (sortBy) {
            case "price-low":
                return priceA - priceB;
            case "price-high":
                return priceB - priceA;
            case "ending-soon":
                return new Date(a.auction.end_time).getTime() - new Date(b.auction.end_time).getTime();
            case "newest":
            default:
                return new Date(b.auction.start_time).getTime() - new Date(a.auction.start_time).getTime();
        }
    });

    const activeAuctions = combinedData.filter(item => item.auction.status === "active").length;
    const totalBids = combinedData.reduce((sum) => sum + 0, 0);

    if (loading) {
        return (
            <>
                <Header />
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
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
                            <div className="text-2xl font-bold text-white">{activeAuctions}</div>
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

            {/* Filter Section  */}
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
                        </div>
                    </div>

                    {/* Expanded Filters */}
                    {showFilters && (
                        <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                            <Filter
                                brandFilter={brandFilter}
                                setBrandFilter={setBrandFilter}
                                yearFilter={yearFilter}
                                setYearFilter={setYearFilter}
                                keyword={keyword}
                                setKeyword={setKeyword}
                                resetFilters={resetFilters}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 bg-white">
                {sortedData.length === 0 ? (
                    <div className="text-center py-16">
                        <Search className="w-24 h-24 text-blue-300 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">Không tìm thấy kết quả</h3>
                        <p className="text-gray-600 mb-6">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                        <button
                            onClick={resetFilters}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                        >
                            Reset bộ lọc
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Gọi auctionCard */}
                        <AuctionCard auctions={sortedData} />

                        {/* Load More (placeholder) */}
                        {sortedData.length > 6 && (
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