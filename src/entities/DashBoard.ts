export interface AuctionReportDetail {
  auctionId: number;
  vehicleId: number;
  sellerName: string;
  startPrice: number;
  finalPrice: number;
  totalBids: number;
  startTime: string;
  endTime: string;
  status: string;
  winnerName: string;
  revenue: number;
}

export interface AuctionReport {
  reportDate: string;
  startDate: string | null;
  endDate: string | null;
  totalAuctions: number;
  successfulAuctions: number;
  failedAuctions: number;
  totalRevenue: number;
  auctionDetails: AuctionReportDetail[];
}

export interface DashboardOverview {
  totalUsers: number;
  totalActiveAuctions: number;
  totalActivePosts: number;
  totalRevenue: number;
  packageRevenue: number;
  auctionRevenue: number;
}

export interface PackageRevenueDetail {
  packageId: number;
  packageName: string;
  pricePerPackage: number;
  totalSold: number;
  totalRevenue: number;
}

export interface PackageRevenueReport {
  reportDate: string;
  startDate: string | null;
  endDate: string | null;
  totalRevenue: number;
  totalPackagesSold: number;
  packageDetails: PackageRevenueDetail[];
}

export interface PackageStatistic {
  packageId: number;
  packageName: string;
  postPrice: number;
  totalSold: number;
  totalRevenue: number;
  status: string;
}

export interface PostStatistic {
  totalPosts: number;
  activePosts: number;
  inactivePosts: number;
  vehiclePosts: number;
  batteryPosts: number;
}

export interface RevenueByTime {
  year: number;
  month: number;
  packageRevenue: number;
  auctionRevenue: number;
  totalRevenue: number;
}