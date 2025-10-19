import api from "../../shared/api/axios";
import type { AuctionVehicleDetails } from "../../entities/Auction";
import type { ResponseDTO } from "../../entities/Response";

export const vehicleApi = {
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
            results.forEach((v, i) => { if (v) vehicleMap.set(vehicleIds[i], v); });
            return vehicleMap;
        } catch (error: any) {
            return vehicleMap;
        }
    }
};
