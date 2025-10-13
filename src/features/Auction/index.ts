// // // // import api from "../../shared/api/axios";
// // // // import type { ResponseDTO, PagedResult, AuctionCustom, AuctionVehicleDetails } from "../../entities/Auction";

// // // // export const auctionApi = {
// // // //     async getAllAuctions(page: number = 1, pageSize: number = 50) {
// // // //         const response = await api.get<ResponseDTO<PagedResult<AuctionCustom>>>("/auctions", {
// // // //             params: { page, pageSize }
// // // //         });
// // // //         return response.data;
// // // //     },

// // // //     async getAuctionById(id: number) {
// // // //         const response = await api.get<ResponseDTO<AuctionCustom>>(`/auctions/${id}`);
// // // //         return response.data;
// // // //     }
// // // // };

// // // // export const vehicleApi = {
// // // //     async getVehicleById(vehicleId: number) {
// // // //         const response = await api.get<ResponseDTO<AuctionVehicleDetails>>(`/car/vehicle/${vehicleId}`);
// // // //         return response.data;
// // // //     }
// // // // };

// // // import { message } from "antd";
// // // import api from "../../shared/api/axios";
// // // import type { AuctionCustom, AuctionVehicleDetails } from "../../entities/Auction";
// // // import type { PaginatedResult, ResponseDTO } from "../../entities/Response.js";

// // // export const auctionApi = {
// // //     async getAllAuctions(page: number = 1, pageSize: number = 50): Promise<PaginatedResult<AuctionCustom> | null> {
// // //         try {
// // //             const response = await api.get<ResponseDTO<PaginatedResult<AuctionCustom>>>("/auctions", {
// // //                 params: { page, pageSize }
// // //             });

// // //             if (response.data.isSuccess) {
// // //                 return response.data.result;
// // //             } else {
// // //                 message.error(response.data.message || "Failed to fetch auctions");
// // //                 return null;
// // //             }
// // //         } catch (error: any) {
// // //             message.error(error?.response?.data?.message || "An unexpected error occurred while fetching auctions.");
// // //             console.error(error);
// // //             return null;
// // //         }
// // //     },

// // //     async getAuctionById(id: number): Promise<AuctionCustom | null> {
// // //         try {
// // //             const response = await api.get<ResponseDTO<AuctionCustom>>(`/auctions/${id}`);

// // //             if (response.data.isSuccess) {
// // //                 return response.data.result;
// // //             } else {
// // //                 message.error(response.data.message || "Failed to fetch auction details");
// // //                 return null;
// // //             }
// // //         } catch (error: any) {
// // //             message.error(error?.response?.data?.message || "An unexpected error occurred while fetching auction details.");
// // //             console.error(error);
// // //             return null;
// // //         }
// // //     }
// // // };

// // // export const vehicleApi = {
// // //     async getVehicleById(vehicleId: number): Promise<AuctionVehicleDetails | null> {
// // //         try {
// // //             const response = await api.get<ResponseDTO<AuctionVehicleDetails>>(`/car/vehicle/${vehicleId}`);

// // //             if (response.data.isSuccess) {
// // //                 return response.data.result;
// // //             } else {
// // //                 message.error(response.data.message || "Failed to fetch vehicle details");
// // //                 return null;
// // //             }
// // //         } catch (error: any) {
// // //             message.error(error?.response?.data?.message || "An unexpected error occurred while fetching vehicle details.");
// // //             console.error(error);
// // //             return null;
// // //         }
// // //     }
// // // };

// // // // SignalR functions
// // // export const auctionSignalRApi = {
// // //     async joinAuctionRoom(auctionId: number): Promise<boolean> {
// // //         try {
// // //             const { getConnection, startConnection } = await import("../../shared/api/signalR.js");
// // //             await startConnection();
// // //             const conn = getConnection();
// // //             await conn.invoke("JoinAuction", auctionId);
// // //             console.log(`Joined auction room: ${auctionId}`);
// // //             return true;
// // //         } catch (error) {
// // //             console.error("Error joining auction room:", error);
// // //             return false;
// // //         }
// // //     },

// // //     async sendBid(auctionId: number, userId: number, bidAmount: number): Promise<boolean> {
// // //         try {
// // //             const { getConnection } = await import("../../shared/api/signalR.js");
// // //             const conn = getConnection();
// // //             await conn.invoke("SendBid", auctionId, userId, bidAmount);
// // //             return true;
// // //         } catch (error) {
// // //             console.error("Error sending bid:", error);
// // //             message.error("Failed to place bid. Please try again.");
// // //             return false;
// // //         }
// // //     }
// // // };

// // // features/Auction/api.ts
// // import { message } from "antd";
// // import api from "../../shared/api/axios";
// // import type { AuctionCustom, AuctionVehicleDetails } from "../../entities/Auction";
// // import type { PaginatedResult, ResponseDTO } from "../../entities/Response.js";

// // export const auctionApi = {
// //     async getAllAuctions(page: number = 1, pageSize: number = 50): Promise<PaginatedResult<AuctionCustom> | null> {
// //         try {
// //             const response = await api.get<ResponseDTO<PaginatedResult<AuctionCustom>>>("/auctions", {
// //                 params: { page, pageSize }
// //             });

// //             if (response.data.isSuccess) {
// //                 return response.data.result;
// //             } else {
// //                 message.error(response.data.message || "Failed to fetch auctions");
// //                 return null;
// //             }
// //         } catch (error: any) {
// //             message.error(error?.response?.data?.message || "An unexpected error occurred while fetching auctions.");
// //             console.error("❌ auctionApi.getAllAuctions error:", error);
// //             return null;
// //         }
// //     },

// //     async getAuctionById(id: number): Promise<AuctionCustom | null> {
// //         try {
// //             const response = await api.get<ResponseDTO<AuctionCustom>>(`/Auctions/${id}`);

// //             if (response.data.isSuccess) {
// //                 return response.data.result;
// //             } else {
// //                 message.error(response.data.message || "Failed to fetch auction details");
// //                 return null;
// //             }
// //         } catch (error: any) {
// //             message.error(error?.response?.data?.message || "An unexpected error occurred while fetching auction details.");
// //             console.error("❌ auctionApi.getAuctionById error:", error);
// //             return null;
// //         }
// //     }
// // };

// // export const vehicleApi = {
// //     async getVehicleById(vehicleId: number): Promise<AuctionVehicleDetails | null> {
// //         try {
// //             const response = await api.get<ResponseDTO<AuctionVehicleDetails>>(`/vehicle/${vehicleId}`);

// //             if (response.data.isSuccess) {
// //                 return response.data.result;
// //             } else {
// //                 message.error(response.data.message || "Failed to fetch vehicle details");
// //                 return null;
// //             }
// //         } catch (error: any) {
// //             message.error(error?.response?.data?.message || "An unexpected error occurred while fetching vehicle details.");
// //             console.error("❌ vehicleApi.getVehicleById error:", error);
// //             return null;
// //         }
// //     }
// // };

// // // Export mặc định chỉ API
// // export default {
// //     auctionApi,
// //     vehicleApi
// // };

// import { message } from "antd";
// import api from "../../shared/api/axios";
// import type { AuctionCustom, AuctionVehicleDetails } from "../../entities/Auction";
// import type { PaginatedResult, ResponseDTO } from "../../entities/Response.js";

// export const auctionApi = {
//     async getAllAuctions(page: number = 1, pageSize: number = 50): Promise<PaginatedResult<AuctionCustom> | null> {
//         try {
//             const response = await api.get<ResponseDTO<PaginatedResult<AuctionCustom>>>("/auctions", {
//                 params: { page, pageSize }
//             });

//             if (response.data.isSuccess) {
//                 return response.data.result;
//             } else {
//                 message.error(response.data.message || "Failed to fetch auctions");
//                 return null;
//             }
//         } catch (error: any) {
//             message.error(error?.response?.data?.message || "An unexpected error occurred while fetching auctions.");
//             console.error("❌ auctionApi.getAllAuctions error:", error);
//             return null;
//         }
//     },

//     async getAuctionById(id: number): Promise<AuctionCustom | null> {
//         try {
//             const response = await api.get<ResponseDTO<AuctionCustom>>(`/Auctions/${id}`);

//             if (response.data.isSuccess) {
//                 return response.data.result;
//             } else {
//                 message.error(response.data.message || "Failed to fetch auction details");
//                 return null;
//             }
//         } catch (error: any) {
//             message.error(error?.response?.data?.message || "An unexpected error occurred while fetching auction details.");
//             console.error("❌ auctionApi.getAuctionById error:", error);
//             return null;
//         }
//     }
// };

// export const vehicleApi = {
//     async getVehicleById(vehicleId: number): Promise<AuctionVehicleDetails | null> {
//         try {
//             const response = await api.get<ResponseDTO<AuctionVehicleDetails>>(`/vehicle/${vehicleId}`);

//             if (response.data.isSuccess) {
//                 return response.data.result;
//             } else {
//                 message.error(response.data.message || "Failed to fetch vehicle details");
//                 return null;
//             }
//         } catch (error: any) {
//             message.error(error?.response?.data?.message || "An unexpected error occurred while fetching vehicle details.");
//             console.error("❌ vehicleApi.getVehicleById error:", error);
//             return null;
//         }
//     }
// };

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
            console.error("❌ auctionApi.getAllAuctions:", error);
            return null;
        }
    },

    async getAuctionById(id: number): Promise<AuctionCustom | null> {
        try {
            const response = await api.get<ResponseDTO<AuctionCustom>>(`/Auctions/${id}`);
            if (response.data.isSuccess) return response.data.result;

            message.error(response.data.message || "Không thể tải chi tiết đấu giá");
            return null;
        } catch (error: any) {
            message.error(error?.response?.data?.message || "Lỗi khi tải chi tiết đấu giá.");
            console.error("❌ auctionApi.getAuctionById:", error);
            return null;
        }
    },
};

export const vehicleApi = {
    async getVehicleById(vehicleId: number): Promise<AuctionVehicleDetails | null> {
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "/") || "https://localhost:7000/";
            const response = await api.get<ResponseDTO<AuctionVehicleDetails>>(`${baseUrl}vehicle/${vehicleId}`);
            if (response.data.isSuccess) return response.data.result;

            message.error(response.data.message || "Không thể tải thông tin xe");
            return null;
        } catch (error: any) {
            message.error(error?.response?.data?.message || "Lỗi khi tải thông tin xe.");
            console.error("❌ vehicleApi.getVehicleById:", error);
            return null;
        }
    },
};

export default { auctionApi, vehicleApi };