import api from "../../shared/api/axios";
import type { ResponseDTO, PagedResult, AuctionCustom, AuctionVehicleDetails } from "../../entities/Auction";

export const auctionApi = {
    async getAllAuctions(page: number = 1, pageSize: number = 50) {
        const response = await api.get<ResponseDTO<PagedResult<AuctionCustom>>>("/auctions", {
            params: { page, pageSize }
        });
        return response.data;
    },

    async getAuctionById(id: number) {
        const response = await api.get<ResponseDTO<AuctionCustom>>(`/auctions/${id}`);
        return response.data;
    }
};

export const vehicleApi = {
    async getVehicleById(vehicleId: number) {
        const response = await api.get<ResponseDTO<AuctionVehicleDetails>>(`/car/vehicle/${vehicleId}`);
        return response.data;
    }
};