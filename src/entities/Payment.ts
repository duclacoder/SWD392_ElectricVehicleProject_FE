export interface CreatePaymentRequest {
  UserId: string;
  TransferAmount: number;
}

export interface Payment {
  paymentsId: string;
  userId: number;
  paymentMethodId: string;
  gateWay: string;
  transactionDate: Date;
  accountNumber: number;
  content: string;
  transferAmount: number;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  paymentMethod: string;
}
