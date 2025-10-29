import { message } from "antd";
import type { CreateAuctionFormData } from "../../../entities/AdminAuction";
import type { AuctionCustom } from "../../../entities/Auction";
import type { PaginatedResult, ResponseDTO } from "../../../entities/Response";
import api from "../../../shared/api/axios";

export const getAllAuctions = async (
  page: number,
  pageSize: number
): Promise<PaginatedResult<AuctionCustom> | null> => {
  try {
    const response = await api.get("/Auctions", {
      params: {
        Page: page,
        PageSize: pageSize,
      },
    });

    const data: ResponseDTO<PaginatedResult<AuctionCustom>> = response.data;

    if (data.isSuccess) {
      return data.result;
    } else {
      message.error(data.message || "Failed to fetch auctions");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
        "An unexpected error occurred while fetching auctions."
    );
    console.error(error);
    return null;
  }
};

export const createAuction = async (
  auctionData: CreateAuctionFormData
): Promise<boolean> => {
  try {
    const response = await api.post("/Auctions", auctionData);
    const data: ResponseDTO<AuctionCustom> = response.data;

    if (data.isSuccess) {
      message.success("Auction created successfully!");
      return true;
    } else {
      message.error(data.message || "Failed to create auction");
      return false;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    return false;
  }
};
