// export interface Auction {
//     id: number;
//     vehicle_id: number;
//     seller_id: number;
//     start_price: number;
//     current_price?: number;
//     start_time: string;
//     end_time: string;
//     status: "active" | "ended" | "pending";
//     entry_fee?: number;
//     fee_per_minute?: number;
// }

// export interface AuctionBid {
//     id: number;
//     auction_id: number;
//     bidder_id: number;
//     bid_amount: number;
//     bid_time: string;
//     status: string;
// }



// Basic Auction (nếu dùng cho props khác)
export interface Auction {
    id: number;
    vehicle_id: number;
    seller_id: number;
    start_price: number;
    current_price?: number; // Fallback to start_price in logic
    start_time: string; // ISO string
    end_time: string; // ISO string
    status: string; // "Active" | "Pending" | "Ended" | "InActive" (from backend)
    entry_fee?: number;
    fee_per_minute?: number;
}

// Basic AuctionBid (nếu cần)
export interface AuctionBid {
    id: number;
    auction_id: number;
    bidder_id: number;
    bid_amount: number;
    bid_time: string; // ISO string
    status: string;
}

// AuctionCustom (từ backend AuctionRepository - auction data)
export interface AuctionCustom {
    auctionId: number;
    sellerUserName: string; // Fixed: no space
    vehicleId: number;
    startPrice: number;
    startTime: string; // ISO string
    endTime: string; // ISO string
    status: string; // e.g., "Active", "Pending"
    auctionsFeeId?: number;
    feePerMinute?: number;
    openFee?: number;
    entryFee?: number;
    bids?: AuctionBidCustom[]; // List of bids for totalBids calculation
}

// AuctionBidCustom (từ backend, cho bids trong AuctionCustom)
export interface AuctionBidCustom {
    auctionBidId: number;
    bidderUserName: string;
    bidAmount: number;
    bidTime: string; // ISO string
}

// AuctionVehicleDetails (từ backend CarRepository - vehicle data, fixed from your first AuctionCustom)
export interface AuctionVehicleDetails {
    vehiclesId: number;
    vehicleName: string; // Use as title
    description?: string;
    brand: string;
    model: string;
    year: number;
    km: number; // Fixed: was duplicated as 'year' in your code
    color?: string;
    seats?: number;
    bodyType?: string;
    fastChargingSupport?: boolean;
    price: number;
    currency: string;
    status: string;
    warrantyMonths?: number;
    vehicleImages: string[]; // Array of image URLs
}

// CombinedData (for component logic: auction + vehicle)
export interface CombinedData {
    auction: AuctionCustom;
    vehicle: AuctionVehicleDetails;
}

// PagedResult (từ backend ResponseDTOs, nếu dùng pagination)
export interface PagedResult<T> {
    items: T[];
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// ResponseDTO (generic response from API)
export interface ResponseDTO<T> {
    message: string;
    isSuccess: boolean;
    result?: T;
}
