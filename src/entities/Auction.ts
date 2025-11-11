export interface Auction {
  auctionId: number;
  vehicleId: number;
  sellerId: number;
  startPrice: number;
  currentPrice?: number;
  startTime: string;
  endTime: string;
  status: string;
  entryFee?: number;
  feePerMinute?: number;
}

export interface AuctionBid {
  id?: number;
  auctionId: number;
  bidderId: number;
  bidAmount: number;
  bidTime: string;
  status: string;
}

export interface AuctionCustom {
  auctionId: number;
  sellerUserName: string;
  vehicleId: number;
  startPrice: number;
  startTime: string;
  endTime: string;
  auctionsFeeId?: number;
  feePerMinute?: number;
  openFee?: number;
  entryFee?: number;
  bids?: AuctionBidCustom[];
  status?: string;
  images?: string[];
}

export interface AuctionBidCustom {
  bidderFullName: string;
  bidAmount: number;
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
