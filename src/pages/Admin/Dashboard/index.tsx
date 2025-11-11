import React, { useState, useEffect, useCallback, useMemo } from "react";
import { TrendingUp, TrendingDown, Users, FileText, Gavel, DollarSign, Calendar, Activity, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { 
    getDashboardOverview, 
    getPackageStatistics, 
    getPostStatistics, 
    getPackageRevenueReport, 
    getAuctionReport, 
    getRevenueByTime,
    getDateRange,
} from "../../../features/Dashboard/index";
import type {
    AuctionReport,
    DashboardOverview,
    PackageStatistic,
    PostStatistic,
    PackageRevenueReport,
    RevenueByTime,
} from "../../../entities/DashBoard"; 

// --- HÀM TIỆN ÍCH CHUNG ---

const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null) return 'N/A';
    if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)} Tỷ`;
    } else if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)} Tr`;
    } 
    return new Intl.NumberFormat('vi-VN').format(value);
};

const formatFullCurrency = (value: number | undefined): string => {
    if (value === undefined || value === null) return '0 VND';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value);
};

// --- Dashboard Card Component ---

interface DashboardCardProps {
    title: string;
    value: number | undefined;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    trend?: number;
    isCurrency?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
    title, 
    value, 
    isCurrency = false, 
    icon: Icon, 
    iconBg, 
    iconColor
}) => {
    const displayValue = value === undefined || value === null ? "N/A" : (isCurrency ? formatCurrency(value) : new Intl.NumberFormat('vi-VN').format(value));
    
    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden group">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`${iconBg} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-7 h-7 ${iconColor}`} />
                    </div>
                </div>
                <h3 className="text-sm text-gray-500 mb-2 font-medium uppercase tracking-wide">{title}</h3>
                <p className="text-3xl font-bold text-gray-900 tracking-tight" title={formatFullCurrency(value)}>
                    {displayValue}
                    {isCurrency && <span className="text-base text-gray-500 ml-1 font-normal">VND</span>}
                </p>
            </div>
        </div>
    );
};

// --- Main Dashboard Component ---

type PeriodType = "today" | "week" | "month" | "year";

const AdminDashboard: React.FC = () => {
    // --- States ---
    const [overview, setOverview] = useState<DashboardOverview | null>(null);
    const [packageStats, setPackageStats] = useState<PackageStatistic[]>([]); 
    const [postStats, setPostStats] = useState<PostStatistic | null>(null);
    const [revenueReport, setRevenueReport] = useState<PackageRevenueReport | null>(null);
    const [auctionReport, setAuctionReport] = useState<AuctionReport | null>(null);
    const [revenueByTimeData, setRevenueByTimeData] = useState<RevenueByTime[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Date Range Logic
    const initialRange = useMemo(() => getDateRange("month"), []);
    const [dateRange, setDateRange] = useState({
        startDate: initialRange.startDate,
        endDate: initialRange.endDate,
        period: "month" as PeriodType, 
    });

    // --- Hàm gọi API chính ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                overviewRes,
                packageStatsRes,
                postStatsRes
            ] = await Promise.all([
                getDashboardOverview(),
                getPackageStatistics(),
                getPostStatistics(),
            ]);

            setOverview(overviewRes); 
            setPackageStats(packageStatsRes ?? []); 
            setPostStats(postStatsRes);

            const { startDate, endDate } = dateRange;
            
            const [
                revenueReportRes,
                auctionReportRes,
                revenueByTimeRes,
            ] = await Promise.all([
                getPackageRevenueReport(startDate, endDate),
                getAuctionReport(startDate, endDate),
                getRevenueByTime(startDate, endDate),
            ]);

            setRevenueReport(revenueReportRes);
            setAuctionReport(auctionReportRes);
            setRevenueByTimeData(revenueByTimeRes ?? []); 

        } catch (err: any) {
            console.error("Lỗi khi tải dữ liệu Dashboard:", err);
            setError(err.message || "Không thể tải dữ liệu. Vui lòng kiểm tra kết nối API.");
        } finally {
            setLoading(false);
        }
    }, [dateRange]); 

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePeriodChange = (period: PeriodType) => {
        const newRange = getDateRange(period);
        setDateRange({ ...newRange, period });
    };

    // --- Xử lý dữ liệu cho Biểu đồ ---
    const revenueChartData = useMemo(() => {
        return (revenueByTimeData ?? []).map(item => ({
            name: `${item.month}/${item.year}`, 
            'Doanh thu Gói': (item.packageRevenue || 0) / 1000000000, 
            'Doanh thu Đấu giá': (item.auctionRevenue || 0) / 1000000000,
            'Tổng Doanh thu': (item.totalRevenue || 0) / 1000000000
        }));
    }, [revenueByTimeData]);
    
    // --- Render Logic ---
    
    if (loading && !overview) return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
                <Activity className="w-12 h-12 inline-block animate-spin text-blue-600 mb-4" />
                <p className="text-xl font-semibold text-gray-700">Đang tải dữ liệu...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-red-200 max-w-md w-full text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Lỗi Tải Dữ Liệu</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                    onClick={fetchData} 
                    className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                >
                    Thử lại
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="px-6 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản Trị</h1>
                    <p className="text-gray-500 mt-1">Tổng quan hoạt động kinh doanh</p>
                </div>
            </div>

            <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
                
                {/* -------------------- 1. Tổng Quan Chung -------------------- */}
                <section>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                        <DashboardCard 
                            title="Tổng Doanh Thu" 
                            value={overview?.totalRevenue} 
                            isCurrency={true} 
                            icon={DollarSign} 
                            iconBg="bg-blue-50" 
                            iconColor="text-blue-600"
                        />
                        <DashboardCard 
                            title="Người Dùng" 
                            value={overview?.totalUsers} 
                            icon={Users} 
                            iconBg="bg-emerald-50" 
                            iconColor="text-emerald-600"
                        />
                        <DashboardCard 
                            title="Đấu Giá Active" 
                            value={overview?.totalActiveAuctions} 
                            icon={Gavel} 
                            iconBg="bg-purple-50" 
                            iconColor="text-purple-600"
                        />
                        <DashboardCard 
                            title="Bài Đăng Active" 
                            value={overview?.totalActivePosts} 
                            icon={FileText} 
                            iconBg="bg-orange-50" 
                            iconColor="text-orange-600"
                        />
                        <DashboardCard 
                            title="Doanh Thu Gói" 
                            value={overview?.packageRevenue} 
                            isCurrency={true} 
                            icon={DollarSign} 
                            iconBg="bg-amber-50" 
                            iconColor="text-amber-600"
                        />
                        <DashboardCard 
                            title="Doanh Thu Đấu Giá" 
                            value={overview?.auctionRevenue} 
                            isCurrency={true} 
                            icon={Gavel} 
                            iconBg="bg-rose-50" 
                            iconColor="text-rose-600"
                        />
                    </div>
                </section>

                {/* -------------------- 2. Biểu Đồ Doanh Thu -------------------- */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Biểu Đồ Doanh Thu</h2>
                            <p className="text-sm text-gray-500 mt-1">Theo dõi xu hướng doanh thu theo thời gian</p>
                        </div>
                        
                        <div className="flex gap-2">
                            {(["today", "week", "month", "year"] as PeriodType[]).map((p) => (
                                <button 
                                    key={p} 
                                    onClick={() => handlePeriodChange(p)} 
                                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                                        dateRange.period === p 
                                            ? 'bg-blue-600 text-white shadow-md scale-105' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {p === "today" ? "Hôm Nay" : p === "week" ? "Tuần" : p === "month" ? "Tháng" : "Năm"}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <ResponsiveContainer width="100%" height={380}>
                            <AreaChart data={revenueChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorAuction" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#9ca3af" 
                                    style={{ fontSize: '13px', fontWeight: 500 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis 
                                    stroke="#9ca3af" 
                                    style={{ fontSize: '13px', fontWeight: 500 }}
                                    tickFormatter={(value) => `${value}T`}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip 
                                    formatter={(value: number, name: string) => [formatFullCurrency(value * 1000000000), name]}
                                    contentStyle={{ 
                                        backgroundColor: '#fff', 
                                        border: '1px solid #e5e7eb', 
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    labelStyle={{ fontWeight: 600, marginBottom: '8px' }}
                                />
                                <Legend 
                                    wrapperStyle={{ paddingTop: '20px' }}
                                    iconType="circle"
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="Tổng Doanh thu" 
                                    stroke="#3b82f6" 
                                    strokeWidth={3}
                                    fill="url(#colorTotal)"
                                    dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 7 }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="Doanh thu Đấu giá" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={2}
                                    fill="url(#colorAuction)"
                                    dot={{ fill: '#8b5cf6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* -------------------- 3. Thống Kê Bài Đăng & Gói Dịch Vụ -------------------- */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Thống Kê Bài Đăng */}
                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                        <div className="p-6 border-b border-blue-100 bg-white/50">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-blue-600" />
                                Thống Kê Bài Đăng
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                                <span className="text-gray-600 font-medium">Tổng bài đăng</span>
                                <span className="text-2xl font-bold text-blue-600">{postStats?.totalPosts || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                                <span className="text-gray-700 text-sm">Active</span>
                                <span className="text-lg font-bold text-emerald-600">{postStats?.activePosts || 0}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <span className="text-gray-700 text-sm">Inactive</span>
                                <span className="text-lg font-bold text-red-600">{postStats?.inactivePosts || 0}</span>
                            </div>
                            <div className="pt-3 border-t border-blue-100 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">🚗 Xe Cộ</span>
                                    <span className="font-semibold text-gray-900">{postStats?.vehiclePosts || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">🔋 Ắc Quy</span>
                                    <span className="font-semibold text-gray-900">{postStats?.batteryPosts || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chi Tiết Gói Dịch Vụ */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-transparent">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                                Chi Tiết Gói Dịch Vụ
                            </h2>
                            <p className="text-sm">
                                Tổng doanh thu: 
                                <span className="font-bold text-purple-600 ml-2 text-lg">
                                    {formatFullCurrency(revenueReport?.totalRevenue)}
                                </span>
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tên Gói</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Giá/Gói</th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Đã Bán</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Doanh Thu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {(packageStats ?? []).map((detail) => ( 
                                        <tr key={detail.packageId} className="hover:bg-purple-50/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{detail.packageName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600">{formatCurrency(detail.postPrice)} VND</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                                    {detail.totalSold}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-emerald-600 font-bold">
                                                {formatCurrency(detail.totalRevenue)} VND
                                            </td>
                                        </tr>
                                    ))}
                                    {(packageStats ?? []).length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="text-center py-8 text-gray-500">
                                                Không có dữ liệu thống kê gói nào.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* -------------------- 4. Báo Cáo Đấu Giá -------------------- */}
                <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-transparent">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Gavel className="w-6 h-6 text-amber-600" />
                            Báo Cáo Đấu Giá
                        </h2>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl text-center">
                                <p className="text-sm text-blue-700 mb-1 font-medium">Tổng Phiên</p>
                                <p className="text-3xl font-bold text-blue-900">{auctionReport?.totalAuctions || 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-5 rounded-xl text-center">
                                <p className="text-sm text-emerald-700 mb-1 font-medium">Thành Công</p>
                                <p className="text-3xl font-bold text-emerald-900">{auctionReport?.successfulAuctions || 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-xl text-center">
                                <p className="text-sm text-red-700 mb-1 font-medium">Thất Bại</p>
                                <p className="text-3xl font-bold text-red-900">{auctionReport?.failedAuctions || 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl text-center">
                                <p className="text-sm text-amber-700 mb-1 font-medium">Doanh Thu</p>
                                <p className="text-xl font-bold text-amber-900">{formatCurrency(auctionReport?.totalRevenue)}</p>
                            </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-4 text-gray-900">Chi Tiết Phiên Đấu Giá</h3>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Người Bán</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Giá Cuối</th>
                                            <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Trạng Thái</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {(auctionReport?.auctionDetails ?? []).map((detail) => ( 
                                            <tr key={detail.auctionId} className="hover:bg-amber-50/30 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{detail.auctionId}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{detail.sellerName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                                                    {formatCurrency(detail.finalPrice)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                    <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-full ${
                                                        detail.status === 'Active' 
                                                            ? 'bg-emerald-100 text-emerald-700' 
                                                            : detail.status === 'ended' 
                                                            ? 'bg-red-100 text-red-700' 
                                                            : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {detail.status === 'Active' ? 'Đang Diễn Ra' : detail.status === 'ended' ? 'Kết Thúc' : 'Đã Hủy'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {((auctionReport?.auctionDetails ?? []).length === 0) && (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                                    Không có dữ liệu đấu giá nào trong phạm vi này.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
