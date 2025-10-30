import { message } from "antd";
import type {
  AuctionsFee,
  AuctionsFeeFormData,
} from "../../../entities/AuctionsFee";
import type { PaginatedResult, ResponseDTO } from "../../../entities/Response";
import api from "../../../shared/api/axios";

export const getAllAuctionsFees = async (
  page: number,
  pageSize: number
): Promise<PaginatedResult<AuctionsFee> | null> => {
  try {
    const response = await api.get("/AuctionsFee", {
      params: {
        Page: page,
        PageSize: pageSize,
      },
    });

    const data: ResponseDTO<PaginatedResult<AuctionsFee>> = response.data;

    if (data.isSuccess) {
      return data.result;
    } else {
      message.error(data.message || "Failed to fetch auctions fees");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message ||
        "An unexpected error occurred while fetching auctions fees."
    );
    console.error(error);
    return null;
  }
};

export const createAuctionsFee = async (
  feeData: AuctionsFeeFormData
): Promise<boolean> => {
  try {
    const response = await api.post("/AuctionsFee", feeData);
    const data: ResponseDTO<AuctionsFee> = response.data;
    if (data.isSuccess) {
      message.success("Auctions Fee created successfully!");
      return true;
    } else {
      message.error(data.message || "Failed to create fee");
      return false;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    return false;
  }
};

export const updateAuctionsFee = async (
  id: number,
  feeData: Partial<AuctionsFeeFormData>
): Promise<boolean> => {
  try {
    const response = await api.put(`/AuctionsFee/${id}`, feeData);
    const data: ResponseDTO<AuctionsFee> = response.data;
    if (data.isSuccess) {
      message.success("Auctions Fee updated successfully!");
      return true;
    } else {
      message.error(data.message || "Failed to update fee");
      return false;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    return false;
  }
};

export const deleteAuctionsFee = async (id: number): Promise<boolean> => {
  try {
    const response = await api.delete(`/AuctionsFee/${id}`);
    const data: ResponseDTO<AuctionsFee> = response.data;
    if (data.isSuccess) {
      message.success("Auctions Fee deleted successfully!");
      return true;
    } else {
      message.error(data.message || "Failed to delete fee");
      return false;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    return false;
  }
};

export const unDeleteAuctionsFee = async (id: number): Promise<boolean> => {
  try {
    const response = await api.patch(`/AuctionsFee/${id}`, null);
    const data: ResponseDTO<AuctionsFee> = response.data;
    if (data.isSuccess) {
      message.success("Auctions Fee undeleted successfully!");
      return true;
    } else {
      message.error(data.message || "Failed to undelete fee");
      return false;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    return false;
  }
};

export const getAuctionsFeeById = async (
  id: number
): Promise<AuctionsFee | null> => {
  try {
    const response = await api.get(`/AuctionsFee/${id}`);
    const data: ResponseDTO<AuctionsFee> = response.data;
    if (data.isSuccess) {
      return data.result;
    } else {
      message.error(data.message || "Failed to fetch fee details");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    return null;
  }
};

export const getAuctionsFeeByAuctionId = async (
  auctionId: number
): Promise<AuctionsFee | null> => {
  try {
    const response = await api.get(`/AuctionsFee/GetAuctionFee/${auctionId}`);
    const data: ResponseDTO<AuctionsFee> = response.data;
    if (data.isSuccess) {
      return data.result;
    } else {
      message.error(data.message || "Failed to fetch auction fee");
      return null;
    }
  } catch (error: any) {
    message.error(
      error?.response?.data?.message || "An unexpected error occurred."
    );
    console.error(error);
    return null;
  }
};
