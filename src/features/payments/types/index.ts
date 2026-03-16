export interface PaymentTransaction {
  id: string;
  txRef: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  userId: string;
  packageId: string;
  createdAt: string;
  completedAt?: string;
}

export interface PaymentFilters {
  status?: PaymentTransaction['status'];
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
