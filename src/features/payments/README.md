# Payment Transaction Tracking Module

This module provides comprehensive payment transaction tracking functionality for the LinkedIn Awards Admin Dashboard.

## Features

- View all payment transactions in reverse chronological order
- Filter transactions by status (pending, completed, failed, refunded)
- Filter transactions by date range
- Display total revenue from completed transactions
- Real-time updates with 30-second polling
- Color-coded status badges for quick visual identification

## Components

### PaymentList
Displays all payment transactions with detailed information including:
- Transaction ID
- Amount and currency
- Date and time
- Status badge
- Payer information (name and email)

### PaymentFilters
Provides filtering capabilities:
- Status dropdown (all, pending, completed, failed, refunded)
- Date range picker (start and end dates)
- URL query parameter integration for shareable filtered views

### RevenueCard
Displays total revenue metrics:
- Sum of all completed transaction amounts
- Formatted currency display
- Loading and error states

## Hooks

### usePayments(filters?)
Fetches all payment transactions with optional filtering.
- Polls every 30 seconds for real-time updates
- Supports status and date range filtering

### usePayment(id)
Fetches a single payment transaction by ID.
- Polls every 30 seconds for status updates

### useTotalRevenue()
Fetches the total revenue from completed transactions.
- Polls every 30 seconds for real-time updates

## Services

### paymentService
Provides API communication methods:
- `getAll(filters?)`: Fetch all transactions with optional filters
- `getById(id)`: Fetch a single transaction
- `getTotalRevenue()`: Fetch total revenue from completed transactions

## Types

### PaymentTransaction
```typescript
interface PaymentTransaction {
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
```

### PaymentFilters
```typescript
interface PaymentFilters {
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
  startDate?: string;
  endDate?: string;
}
```

## Usage Example

```tsx
import { useState } from 'react';
import { PaymentList, PaymentFilters, RevenueCard } from '@/features/payments';
import type { PaymentFilters as PaymentFiltersType } from '@/features/payments';

function PaymentsPage() {
  const [filters, setFilters] = useState<PaymentFiltersType>();

  return (
    <div className="space-y-6">
      <RevenueCard />
      <PaymentFilters onFilterChange={setFilters} />
      <PaymentList filters={filters} />
    </div>
  );
}
```

## Requirements Validation

This module validates the following requirements:
- **5.1**: Display transactions in reverse chronological order
- **5.2**: Show transaction ID, amount, date, status, and payer information
- **5.3**: Filter by status
- **5.4**: Filter by date range
- **5.5**: Display total revenue from completed transactions
- **5.8**: Update display within 30 seconds when transaction status changes
