export interface Auction {
  id: number;
  vehicle_id: number;
  seller_id: number;
  start_price: number;
  current_price?: number;
  start_time: string;
  end_time: string;
  status: string;
  entry_fee?: number;
  fee_per_minute?: number;
}

export interface AuctionBid {
  id?: number;
  auction_id: number;
  bidder_id: number;
  bid_amount: number;
  bid_time: string;
  status: string;
}

export interface AuctionCustom {
  auctionId: number;
  sellerUserName: string;
  vehicleId: number;
  startPrice: number;
  startTime: string;
  endTime: string;
  status: string;
  auctionsFeeId?: number;
  feePerMinute?: number;
  openFee?: number;
  entryFee?: number;
  bids?: AuctionBidCustom[];
}

export interface AuctionBidCustom {
  auctionBidId: number;
  bidderUserName: string;
  bidAmount: number;
  bidTime: string;
}

export interface AuctionVehicleDetails {
  vehiclesId: number;
  vehicleName: string;
  description?: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  color?: string;
  seats?: number;
  bodyType?: string;
  fastChargingSupport?: boolean;
  price: number;
  currency: string;
  status: string;
  warrantyMonths?: number;
  vehicleImages: string[];
}

export interface CombinedData {
  auction: AuctionCustom;
  vehicle: AuctionVehicleDetails;
}
export interface BidWithName {
  bidderId: number;
  bidderName: string;
  amount: number;
  time: string;
}