import { message } from "antd";
import type { AuctionsFee } from "../../../entities/AuctionsFee";
import type { ResponseDTO } from "../../../entities/Response";
import api from "../../../shared/api/axios";

export const CheckEligibilityJoinAuction = async (auctionId: number, userId: string): Promise<boolean> => {
  try {
    const response = await api.get(`AuctionParticipant/Check-eligibility?UserId=${userId}&AuctionsId=${auctionId}`);
    const data : ResponseDTO<boolean> = response.data;
    if (data.isSuccess) {
      if (data.result) {
        return true;
      } else {
        return false;
      }
    } else {
      message.error(data.message);
      return false;
    }
  }
  catch (error: any) {
    message.error(
      error?.response?.data?.message || "Lỗi khi kiểm tra điều kiện tham gia đấu giá."
    );
    return false;
  }
};

export const getAuctionFee = async (auctionId: number) : Promise<AuctionsFee | undefined> => {
  try {
    const response = await api.get(`AuctionsFee/GetAuctionFee/${auctionId}`);
    const data : ResponseDTO<AuctionsFee> = response.data;
    if (data.isSuccess)
      return data.result;
    else {
      message.error(data.message);
      return data.result;
    }
  } catch (error) {
    console.log(error);
    return undefined;
  }
};