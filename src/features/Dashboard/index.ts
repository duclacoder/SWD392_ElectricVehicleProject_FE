import type { AuctionReport, DashboardOverview, PackageRevenueReport, PackageStatistic, PostStatistic, RevenueByTime } from "../../entities/DashBoard";
import type { ResponseDTO } from "../../entities/Response";
import api from "../../shared/api/axios";

export const getDashboardOverview = async (): Promise<DashboardOverview> => {
  const response = await api.get<ResponseDTO<DashboardOverview>>(
    "/Dashboard/overview"
  );
  return response.data.result;
};
export const getPackageStatistics = async (): Promise<PackageStatistic[]> => {
  const response = await api.get<ResponseDTO<PackageStatistic[]>>(
    "/Dashboard/package-statistics"
  );
  return response.data.result;
};
export const getPostStatistics = async (): Promise<PostStatistic> => {
  const response = await api.get<ResponseDTO<PostStatistic>>(
    "/Dashboard/post-statistics"
  );
  return response.data.result;
};
export const getPackageRevenueReport = async (
  startDate?: string,
  endDate?: string
): Promise<PackageRevenueReport> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await api.get<ResponseDTO<PackageRevenueReport>>(
    `/Dashboard/package-revenue?${params.toString()}`
  );
  return response.data.result;
};
export const getAuctionReport = async (
  startDate?: string,
  endDate?: string
): Promise<AuctionReport> => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await api.get<ResponseDTO<AuctionReport>>(
    `/Dashboard/auction-report?${params.toString()}`
  );
  return response.data.result;
};
export const getRevenueByTime = async (
  startDate: string,
  endDate: string
): Promise<RevenueByTime[]> => {
  const params = new URLSearchParams();
  params.append("startDate", startDate);
  params.append("endDate", endDate);

  const response = await api.get<ResponseDTO<RevenueByTime[]>>(
    `/Dashboard/revenue-by-time?${params.toString()}`
  );
  return response.data.result;
};
export const formatDateForApi = (date: Date): string => {
  return date.toISOString();
};
export const getDateRange = (period: "today" | "week" | "month" | "year") => {
  const endDate = new Date();
  const startDate = new Date();

  switch (period) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "week":
      startDate.setDate(startDate.getDate() - 7);
      break;
    case "month":
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case "year":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
  }
  return {
    startDate: formatDateForApi(startDate),
    endDate: formatDateForApi(endDate),
  };
};