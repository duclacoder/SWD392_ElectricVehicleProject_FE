import { message } from "antd";
import api from "../../shared/api/axios";
import type { AuctionCustom, AuctionVehicleDetails } from "../../entities/Auction";
import type { PaginatedResult, ResponseDTO } from "../../entities/Response.js";

export const auctionApi = {
    async getAllAuctions(page = 1, pageSize = 50): Promise<PaginatedResult<AuctionCustom> | null> {
        try {
            const response = await api.get<ResponseDTO<PaginatedResult<AuctionCustom>>>("/auctions", {
                params: { page, pageSize },
            });

            if (response.data.isSuccess) return response.data.result;
            message.error(response.data.message || "Không thể tải danh sách đấu giá");
            return null;
        } catch (error: any) {
            message.error(error?.response?.data?.message || "Lỗi khi tải danh sách đấu giá.");
            return null;
        }
    },

    async getAuctionById(id: number): Promise<AuctionCustom | null> {
        try {
            const response = await api.get<ResponseDTO<AuctionCustom>>(`/auctions/${id}`);
            if (response.data.isSuccess) return response.data.result;

            message.error(response.data.message || "Không thể tải chi tiết đấu giá");
            return null;
        } catch (error: any) {
            message.error(error?.response?.data?.message || "Lỗi khi tải chi tiết đấu giá.");
            return null;
        }
    },
};

export const vehicleApi = {
    async getVehicleById(vehicleId: number): Promise<AuctionVehicleDetails | null> {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await api.get<ResponseDTO<AuctionVehicleDetails>>(`${API_BASE_URL}vehicle/${vehicleId}`);
            if (response.data.isSuccess) return response.data.result;

            message.error(response.data.message || "Không thể tải thông tin xe");
            return null;
        } catch (error: any) {
            message.error(error?.response?.data?.message || "Lỗi khi tải thông tin xe.");
            return null;
        }
    },

    async getVehicleByIdSilent(vehicleId: number): Promise<AuctionVehicleDetails | null> {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
            const response = await api.get<ResponseDTO<AuctionVehicleDetails>>(`${API_BASE_URL}vehicle/${vehicleId}`);
            if (response.data.isSuccess) return response.data.result;

            return null;
        } catch (error: any) {
            return null;
        }
    },

    async getVehiclesByIds(vehicleIds: number[]): Promise<Map<number, AuctionVehicleDetails>> {
        const vehicleMap = new Map<number, AuctionVehicleDetails>();

        try {
            const promises = vehicleIds.map(id => this.getVehicleByIdSilent(id));
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
    }
};

export default { auctionApi, vehicleApi };