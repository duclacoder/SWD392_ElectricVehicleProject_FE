import { message } from "antd";
import type { CreateAuctionFormData } from "../../../entities/AdminAuction";
import type { AuctionCustom } from "../../../entities/Auction";
import type { AuctionsFeeFormData } from "../../../entities/AuctionsFee";
import type { PaginatedResult, ResponseDTO } from "../../../entities/Response";
import api from "../../../shared/api/axios";
import { createAuctionsFee } from "./adminAuctionsFeeApi";

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

export const getAuctionById = async (
  id: number
): Promise<AuctionCustom | null> => {
  try {
    const response = await api.get(`/Auctions/${id}`);
    const data: ResponseDTO<AuctionCustom> = response.data;

    if (data.isSuccess && data.result) {
      return data.result;
    } else {
      message.error(data.message || "Failed to fetch auction");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    console.error("Get auction by ID error:", error);
    return null;
  }
};

export const createAuction = async (
  auctionData: CreateAuctionFormData
): Promise<AuctionCustom | null> => {
  try {
    const response = await api.post("/Auctions", auctionData);
    const data: ResponseDTO<AuctionCustom> = response.data;

    if (data.isSuccess && data.result) {
      console.log(
        "Auction created successfully with ID:",
        data.result.auctionId
      );
      return data.result;
    } else {
      message.error(data.message || "Failed to create auction");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    console.error("Create auction error:", error);
    return null;
  }
};

export const updateAuction = async (
  id: number,
  auctionData: Partial<CreateAuctionFormData>
): Promise<boolean> => {
  try {
    const response = await api.put(`/Auctions/${id}`, auctionData);
    const data: ResponseDTO<AuctionCustom> = response.data;

    if (data.isSuccess) {
      message.success("Auction updated successfully!");
      return true;
    } else {
      message.error(data.message || "Failed to update auction");
      return false;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    console.error("Update auction error:", error);
    return false;
  }
};

// New interface for auction creation with automatic fee creation
export interface CreateAuctionWithAutoFeeFormData {
  userName: string;
  vehicleId: number;
  endTime: string;
  entryFee: number; // This will be the base for calculating auction fee entry fee (1%)
}

export const createAuctionWithAutoFee = async (
  auctionData: CreateAuctionWithAutoFeeFormData
): Promise<boolean> => {
  try {
    // Step 1: Create auction first with fixed values
    const auctionPayload: CreateAuctionFormData = {
      userName: auctionData.userName,
      vehicleId: auctionData.vehicleId,
      endTime: auctionData.endTime,
      feePerMinute: 0, // Fixed value
      openFee: 0, // Fixed value
      entryFee: auctionData.entryFee,
      startPrice: 0, // Fixed value
    };

    console.log("Creating auction with data:", auctionPayload);
    const createdAuction = await createAuction(auctionPayload);

    if (!createdAuction) {
      message.error("Failed to create auction");
      return false;
    }

    console.log(
      "Auction created successfully with ID:",
      createdAuction.auctionId
    );

    // Step 2: Create auction fee with the auction ID
    const auctionFeeData: AuctionsFeeFormData = {
      auctionsId: createdAuction.auctionId, // Use the auction ID from step 1
      description: "Phí tham gia",
      feePerMinute: 0, // Fixed value
      entryFee: Math.round(auctionData.entryFee * 0.01), // 1% of auction entryFee
      currency: "VND", // Fixed value
      type: "Phí tham gia", // Fixed value
      status: "Active", // Fixed value
    };

    console.log("Creating auction fee with data:", auctionFeeData);
    const feeSuccess = await createAuctionsFee(auctionFeeData);

    if (feeSuccess) {
      message.success("Auction and fee created successfully!");
      return true;
    } else {
      message.error("Auction created but auction fee creation failed");
      return false;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
        "An unexpected error occurred during auction creation."
    );
    console.error("Create auction with auto fee error:", error);
    return false;
  }
};
