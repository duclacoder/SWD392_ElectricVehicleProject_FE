import { message } from "antd";
import type { ResponseDTO, PaginatedResult } from "../../../entities/Response";
import type { AuctionBidCustom } from "../../../entities/Auction";
import api from "../../../shared/api/axios";

/**
 * 🟢 Lấy danh sách bid theo AuctionId
 * @param auctionId ID của phiên đấu giá
 * @returns Danh sách bid hoặc null nếu lỗi
 */
export const getBidsByAuctionId = async (
  auctionId: number
): Promise<PaginatedResult<AuctionBidCustom> | null> => {
  try {
    const response = await api.get(`/AuctionBid/${auctionId}`);
    const data: ResponseDTO<PaginatedResult<AuctionBidCustom>> = response.data;

    if (data.isSuccess && data.result) {
      return data.result;
    } else {
      message.error(data.message || "Không thể tải danh sách bids.");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
        "Đã xảy ra lỗi không mong muốn khi tải danh sách bids."
    );
    console.error("Get bids by auction ID error:", error);
    return null;
  }
};
