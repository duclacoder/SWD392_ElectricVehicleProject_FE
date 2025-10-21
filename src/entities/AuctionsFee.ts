export interface AuctionsFee {
  auctionsFeeId: number;
  description: string;
  feePerMinute: number;
  entryFee: number;
  currency: string;
  type: string;
  createdAt: string | null;
  updatedAt: string;
  status: string;
  auctions: any[];
}

export interface AuctionsFeeFormData {
  description: string;
  feePerMinute: number;
  entryFee: number;
  currency: string;
  type: string;
}
