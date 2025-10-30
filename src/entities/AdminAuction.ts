export interface CreateAuctionFormData {
  userName: string;
  vehicleId: number;
  endTime: string;
  feePerMinute: number;
  openFee: number;
  entryFee: number;
  startPrice: number;
  status?: string;
}
