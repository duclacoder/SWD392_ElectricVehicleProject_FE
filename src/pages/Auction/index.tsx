import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Footer } from "../../Widgets/Footers/Footer.tsx";
import { Header } from "../../Widgets/Headers/Header.tsx";
import { AuctionCard } from "../Auction/UI/AuctionCard.tsx";
import {
  Search,
  Filter as FilterIcon,
  TrendingUp,
  Clock,
  Sparkles,
  RefreshCw,
  XCircle,
  Car,
  Tag,
  Loader2,
  Calendar,
} from "lucide-react";
import { getConnection, startConnection } from "../../shared/api/signalR.js";
import type { CombinedData, AuctionCustom } from "../../entities/Auction.ts";
import { auctionApi, closeAuction } from "../../features/Auction";
import { vehicleApi } from "../../features/Vehicle/vehicleApi";

import { Spin, message, Select, Input, Button } from "antd";

const { Option } = Select;

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
  const PAGE_SIZE = 50;

  useEffect(() => {
    async function initSignalR() {
      try {
        await startConnection();
        const conn = getConnection();
        console.log("SignalR state:", conn.state);
      } catch (error) {
        console.error("SignalR connection failed:", error);
      }
    }
    initSignalR();
    closeAuction();
  }, []);

  const fetchVehiclesForAuctions = useCallback(async (fetchedAuctions: AuctionCustom[]) => {
    try {
      const vehicleIds = fetchedAuctions.map(auction => auction.vehicleId);
      const vehicleMap = await vehicleApi.getVehiclesByIds(vehicleIds);

      const combinedResults: CombinedData[] = fetchedAuctions
        .map(auction => {
          const vehicle = vehicleMap.get(auction.vehicleId);
          if (vehicle) {
            const currentPrice = auction.bids && auction.bids.length > 0
              ? Math.max(...auction.bids.map(b => b.bidAmount))
              : auction.startPrice;

            const augmentedAuction = {
              ...auction,
              currentPrice
            };
            return { auction: augmentedAuction, vehicle } as CombinedData;
          }
          return null;
        })
        .filter((item): item is CombinedData => item !== null);

      setCombinedData(combinedResults);
    } catch (err: any) {
      console.error("Lỗi fetch vehicles:", err);
      setError(err.message || "Không thể tải thông tin xe");
    }
  }, []);

  const fetchAuctions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const pagedResult = await auctionApi.getAllAuctions(1, PAGE_SIZE);

      if (pagedResult && pagedResult.items) {
        const fetchedAuctions: AuctionCustom[] = pagedResult.items;

        if (fetchedAuctions.length === 0) {
          setCombinedData([]);
          return;
        }

        await fetchVehiclesForAuctions(fetchedAuctions);
      } else if (pagedResult === null) {
        setError("Lỗi tải danh sách đấu giá chính.");
      } else {
        throw new Error("Failed to fetch auctions: No items returned.");
      }
    } catch (err: any) {
      console.error("Lỗi fetch auctions:", err);
      setError(err.message || "Không thể tải danh sách đấu giá");
      message.error("Đã xảy ra lỗi khi tải danh sách đấu giá chính.");
    } finally {
      setLoading(false);
    }
  }, [fetchVehiclesForAuctions]);

  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  const retryFetch = () => {
    fetchAuctions();
  };

  const resetFilters = () => {
    setBrandFilter("");
    setYearFilter("");
    setKeyword("");
    setStatusFilter("all");
    setSortBy("newest");
    message.info("Đã đặt lại tất cả bộ lọc.");
  };

  const filteredData = useMemo(() => {
    return combinedData.filter(({ auction, vehicle }) => {
      const normalizedStatus = auction.status.toLowerCase();
      const matchesBrand = !brandFilter || vehicle.brand.toLowerCase() === brandFilter.toLowerCase();
      const matchesYear = !yearFilter || vehicle.year.toString() === yearFilter;
      const matchesKeyword = !keyword ||
        vehicle.vehicleName.toLowerCase().includes(keyword.toLowerCase()) ||
        (vehicle.brand && vehicle.brand.toLowerCase().includes(keyword.toLowerCase())) ||
        (vehicle.model && vehicle.model.toLowerCase().includes(keyword.toLowerCase()));
      const matchesStatus = statusFilter === "all" || normalizedStatus === statusFilter;

      return matchesBrand && matchesYear && matchesKeyword && matchesStatus;
    });
  }, [combinedData, brandFilter, yearFilter, keyword, statusFilter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
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
  }, [filteredData, sortBy]);

  const activeAuctionsCount = useMemo(() => combinedData.filter(item =>
    item.auction.status.toLowerCase() === "active"
  ).length, [combinedData]);

  const totalBids = useMemo(() => combinedData.reduce((sum, item) =>
    sum + (item.auction.bids?.length || 0), 0
  ), [combinedData]);

  const availableBrands = useMemo(() => Array.from(new Set(combinedData.map(item => item.vehicle.brand)))
    .filter(brand => brand)
    .sort((a, b) => a.localeCompare(b)), [combinedData]);

  const availableYears = useMemo(() => Array.from(new Set(combinedData.map(item => item.vehicle.year)))
    .filter(year => year)
    .sort((a, b) => b - a), [combinedData]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
          <Spin indicator={<Loader2 className="animate-spin text-blue-600 w-16 h-16" />} />
          <p className="mt-6 text-xl font-semibold text-gray-700 animate-pulse">
            Đang tải danh sách đấu giá, vui lòng chờ...
          </p>
          <p className="text-gray-500 mt-2">
            Chuẩn bị những chiếc xe tốt nhất cho bạn.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  // THIẾU DẤU NGOẶC Ở ĐÂY - ĐÃ SỬA
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
          <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-red-200">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h3 className="text-3xl font-extrabold text-gray-800 mb-3">Rất tiếc! Đã xảy ra lỗi</h3>
            <p className="text-lg text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="primary"
                icon={<RefreshCw className="w-4 h-4 mr-2" />}
                onClick={retryFetch}
                size="large"
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-lg"
              >
                Thử lại
              </Button>
              <Button
                icon={<FilterIcon className="w-4 h-4 mr-2" />}
                onClick={resetFilters}
                size="large"
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-300 rounded-lg"
              >
                Đặt lại bộ lọc
              </Button>
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
      <section className="relative bg-gradient-to-br from-blue-700 to-indigo-800 text-white py-20 overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10 background-pattern"></div>
        <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">
            <span className="block text-blue-200 text-3xl mb-2">Chào mừng đến với</span>
            Đấu Giá Xe Hơi Trực Tuyến
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in-up">
            Nơi những giấc mơ xe hơi của bạn trở thành hiện thực với các phiên đấu giá công bằng và minh bạch.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg">
              <TrendingUp className="w-10 h-10 text-blue-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{combinedData.length}</div>
              <div className="text-blue-100 text-lg">Tổng số phiên đấu giá</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg">
              <Clock className="w-10 h-10 text-blue-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{activeAuctionsCount}</div>
              <div className="text-blue-100 text-lg">Phiên đang diễn ra</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-lg">
              <Sparkles className="w-10 h-10 text-blue-300 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{totalBids}+</div>
              <div className="text-blue-100 text-lg">Tổng lượt đặt giá</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-5 py-2 h-auto text-base font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg"
                icon={<FilterIcon className="w-5 h-5" />}
              >
                Bộ lọc
                {showFilters ? <span className="ml-2">▲</span> : <span className="ml-2">▼</span>}
              </Button>

              <div className="text-base text-gray-700 flex items-center">
                <span className="font-bold text-blue-600 mr-1">{sortedData.length}</span> kết quả
                {combinedData.length > 0 && (
                  <span className="text-gray-500 ml-2 hidden sm:inline-block">
                    (tổng {combinedData.length} phiên)
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
              <Select
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                className="w-full sm:w-48"
                placeholder="Trạng thái"
                suffixIcon={<Tag className="w-4 h-4 text-gray-400" />}
              >
                <Option value="all">Tất cả trạng thái</Option>
                <Option value="active">Đang diễn ra</Option>
                <Option value="pending">Sắp diễn ra</Option>
                <Option value="ended">Đã kết thúc</Option>
              </Select>

              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                className="w-full sm:w-48"
                placeholder="Sắp xếp theo"
                suffixIcon={<Clock className="w-4 h-4 text-gray-400" />}
              >
                <Option value="newest">Mới nhất</Option>
                <Option value="ending-soon">Sắp kết thúc</Option>
                <Option value="price-low">Giá thấp đến cao</Option>
                <Option value="price-high">Giá cao đến thấp</Option>
              </Select>

              {error && (
                <Button
                  onClick={retryFetch}
                  className="flex items-center gap-2 h-auto px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  icon={<RefreshCw className="w-4 h-4" />}
                >
                  Thử lại
                </Button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200 shadow-inner animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Brand */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hãng xe
                  </label>
                  <Select
                    value={brandFilter}
                    onChange={(value) => setBrandFilter(value)}
                    className="w-full"
                    placeholder="Chọn hãng xe"
                    allowClear
                    suffixIcon={<Car className="w-4 h-4 text-gray-400" />}
                  >
                    <Option value="">Tất cả hãng xe</Option>
                    {availableBrands.map(brand => (
                      <Option key={brand} value={brand}>{brand}</Option>
                    ))}
                  </Select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Năm sản xuất
                  </label>
                  <Select
                    value={yearFilter}
                    onChange={(value) => setYearFilter(value)}
                    className="w-full"
                    placeholder="Chọn năm sản xuất"
                    allowClear
                    suffixIcon={<Calendar className="w-4 h-4 text-gray-400" />}
                  >
                    <Option value="">Tất cả năm</Option>
                    {availableYears.map(year => (
                      <Option key={year} value={year.toString()}>{year}</Option>
                    ))}
                  </Select>
                </div>

                {/* Keyword */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Từ khóa
                  </label>
                  <Input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm theo tên, hãng xe, model..."
                    prefix={<Search className="w-4 h-4 text-gray-400 mr-2" />}
                    className="w-full rounded-lg"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <Button
                  onClick={resetFilters}
                  size="large"
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-300 rounded-lg"
                >
                  Đặt lại bộ lọc
                </Button>
                <Button
                  type="primary"
                  onClick={() => setShowFilters(false)}
                  size="large"
                  className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-lg"
                >
                  Áp dụng
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 bg-white min-h-[60vh]">
        {sortedData.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
            <Search className="w-28 h-28 text-blue-400 mx-auto mb-6 opacity-70" />
            <h3 className="text-3xl font-extrabold text-gray-800 mb-3">
              {combinedData.length === 0 ? 'Chưa có phiên đấu giá nào' : 'Không tìm thấy kết quả phù hợp'}
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
              {combinedData.length === 0
                ? 'Hiện tại chưa có phiên đấu giá nào được tạo. Hãy quay lại sau nhé!'
                : 'Vui lòng điều chỉnh các bộ lọc hoặc từ khóa tìm kiếm để khám phá nhiều lựa chọn hơn.'
              }
            </p>
            {combinedData.length > 0 ? (
              <Button
                type="primary"
                onClick={resetFilters}
                size="large"
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-lg shadow-md"
              >
                Đặt lại bộ lọc
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={retryFetch}
                size="large"
                icon={<RefreshCw className="w-4 h-4 mr-2" />}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 rounded-lg shadow-md"
              >
                Tải lại trang
              </Button>
            )}
          </div>
        ) : (
          <>
            <AuctionCard auctions={sortedData} />

            {sortedData.length >= PAGE_SIZE && (
              <div className="text-center mt-16">
                <Button
                  size="large"
                  className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold shadow-sm text-base h-auto"
                >
                  Xem thêm phiên đấu giá
                </Button>
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