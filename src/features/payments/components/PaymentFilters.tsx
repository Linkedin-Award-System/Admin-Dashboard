import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select } from '@/shared/components/ui/select';
import type { PaymentFilters as PaymentFiltersType } from '../types';

interface PaymentFiltersProps {
  onFilterChange: (filters?: PaymentFiltersType) => void;
}

export const PaymentFiltersForm = ({ onFilterChange }: PaymentFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  useEffect(() => {
    const statusParam = searchParams.get('status');
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');

    const filters: PaymentFiltersType = {};
    
    if (statusParam) {
      filters.status = statusParam as PaymentFiltersType['status'];
    }
    
    if (startParam && endParam) {
      filters.startDate = startParam;
      filters.endDate = endParam;
    }

    if (Object.keys(filters).length > 0) {
      onFilterChange(filters);
    } else {
      onFilterChange(undefined);
    }
  }, [searchParams, onFilterChange]);

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams);
    
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    
    if (startDate && endDate) {
      params.set('startDate', startDate);
      params.set('endDate', endDate);
    } else {
      params.delete('startDate');
      params.delete('endDate');
    }
    
    setSearchParams(params);
  };

  const handleClearFilter = () => {
    setStatus('');
    setStartDate('');
    setEndDate('');
    setSearchParams(new URLSearchParams());
  };

  const hasFilters = status || (startDate && endDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </Select>
          </div>
          
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            onClick={handleApplyFilter}
            disabled={!hasFilters}
            className="w-full sm:w-auto"
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={handleClearFilter}
            className="w-full sm:w-auto"
          >
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
