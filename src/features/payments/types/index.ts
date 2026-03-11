export interface PaymentTransaction {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payerName: string;
  payerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentFilters {
  status?: PaymentTransaction['status'];
  startDate?: string;
  endDate?: string;
}
