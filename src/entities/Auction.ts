export interface Auction {
    id: number;
    vehicle_id: number;
    seller_id: number;
    start_price: number;
    current_price?: number;
    start_time: string;
    end_time: string;
    status: "active" | "ended" | "pending";
    entry_fee?: number;
    fee_per_minute?: number;
}

export interface AuctionBid {
    id: number;
    auction_id: number;
    bidder_id: number;
    bid_amount: number;
    bid_time: string;
    status: string;
}