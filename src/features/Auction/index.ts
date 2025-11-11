import { message } from "antd";
import type {
  AuctionCustom,
  AuctionVehicleDetails,
  // AuctionWinnerDto,
} from "../../entities/Auction";
import type { PaginatedResult, ResponseDTO } from "../../entities/Response.js";
import api from "../../shared/api/axios";
import type { AuctionWinnerDTO } from "../../entities/AuctionWinnerDto.js";

export const auctionApi = {
  async getAllAuctions(
    page = 1,
    pageSize = 50
  ): Promise<PaginatedResult<AuctionCustom> | null> {
    try {
      const response = await api.get<
        ResponseDTO<PaginatedResult<AuctionCustom>>
      >("/auctions", {
        params: { page, pageSize },
      });

      if (response.data.isSuccess) return response.data.result;
      message.error(response.data.message || "Không thể tải danh sách đấu giá");
      return null;
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Lỗi khi tải danh sách đấu giá."
      );
      return null;
    }
  },
  async getAuctionWinner(auctionId: number): Promise<AuctionWinnerDTO | null> {
    try {
      const response = await api.get(`AuctionBid/winner/${auctionId}`);
      return response.data;
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || "Lỗi khi lấy người thắng đấu giá.";
      message.error(errorMsg);
      return null;
    }
  },


  async getAuctionById(id: number): Promise<AuctionCustom | null> {
    try {
      const response = await api.get<ResponseDTO<AuctionCustom>>(
        `/auctions/${id}`
      );
      if (response.data.isSuccess) return response.data.result;

      message.error(response.data.message || "Không thể tải chi tiết đấu giá");
      return null;
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Lỗi khi tải chi tiết đấu giá."
      );
      return null;
    }
  },
  async refundAuction(auctionId: number): Promise<boolean> {
    try {
      const response = await api.get<ResponseDTO<any>>(
        `Auctions/Refund?auctionId=${auctionId}`
      );
      const data = response.data;

      if (data.isSuccess) {
        message.success(
          data.message || "Hoàn tiền và kết thúc phiên đấu giá thành công!"
        );
        return true;
      } else {
        message.error(data.message || "Không thể hoàn tiền phiên đấu giá.");
        return false;
      }
    } catch (error: any) {
      message.error(
        error?.response?.data?.message ||
        "Lỗi khi gọi API hoàn tiền đấu giá."
      );
      return false;
    }
  },


  // async getAuctionWinner(auctionId: number): Promise<AuctionWinnerDto | null> {
  //     try {
  //       const response = await api.get<ResponseDTO<AuctionWinnerDto>>(`/auctions/${auctionId}/winner`);
  //       if (response.data.isSuccess) return response.data.result;
  //       message.error(response.data.message || "Không thể lấy người thắng đấu giá");
  //       return null;
  //     } catch (error: any) {
  //       message.error(error?.response?.data?.message || "Lỗi khi lấy người thắng đấu giá");
  //       return null;
  //     }
  //   },
};

export const closeAuction = async () => {
  try {
    const response = await api.get("Auctions");
    const data: ResponseDTO<AuctionCustom[]> = response.data;
    const result: AuctionCustom[] = data.result;

    const validItems = result.filter(item =>
      item.status !== "ended" &&
      item.endTime &&
      new Date(item.endTime).getTime() >= Date.now()
    );

    for (const item of validItems) {
      refund(item.auctionId.toString());
    }

  } catch (error) {
    console.error(error);
  }
}

const refund = async (auctionId : string) => {
  await api.get(`Auctions/Refund?auctionId=${auctionId}`);
}



export const vehicleApi = {
  async getVehicleById(
    vehicleId: number
  ): Promise<AuctionVehicleDetails | null> {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await api.get<ResponseDTO<AuctionVehicleDetails>>(
        `${API_BASE_URL}vehicle/${vehicleId}`
      );
      if (response.data.isSuccess) return response.data.result;

      message.error(response.data.message || "Không thể tải thông tin xe");
      return null;
    } catch (error: any) {
      message.error(
        error?.response?.data?.message || "Lỗi khi tải thông tin xe."
      );
      return null;
    }
  },

  async getVehicleByIdSilent(
    vehicleId: number
  ): Promise<AuctionVehicleDetails | null> {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const response = await api.get<ResponseDTO<AuctionVehicleDetails>>(
        `${API_BASE_URL}vehicle/${vehicleId}`
      );
      if (response.data.isSuccess) return response.data.result;

      return null;
    } catch (error: any) {
      return null;
    }
  },

  async getVehiclesByIds(
    vehicleIds: number[]
  ): Promise<Map<number, AuctionVehicleDetails>> {
    const vehicleMap = new Map<number, AuctionVehicleDetails>();

    try {
      const promises = vehicleIds.map((id) => this.getVehicleByIdSilent(id));
      const results = await Promise.all(promises);

      results.forEach((vehicle, index) => {
        if (vehicle) {
          vehicleMap.set(vehicleIds[index], vehicle);
        }
      });

      return vehicleMap;
    } catch (error: any) {
      return vehicleMap;
    }
  },
};

export default { auctionApi, vehicleApi };
