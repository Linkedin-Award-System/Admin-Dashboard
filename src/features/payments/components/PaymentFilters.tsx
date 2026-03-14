import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Filter, Calendar, X, CheckCircle2 } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b-2 border-gray-200">
        <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Filter size={14} className="text-blue-600" />
          </div>
          Filter Options
        </h3>
        {hasFilters && (
          <button 
            onClick={handleClearFilter}
            className="text-[10px] font-black text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-sm"
          >
            <X size={12} strokeWidth={3} /> Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="status" className="text-xs font-bold text-gray-700 uppercase tracking-wide pl-1 flex items-center gap-2">
            <CheckCircle2 size={14} className="text-green-600" />
            Settlement Status
          </Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex h-12 w-full rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 text-sm font-bold text-gray-800 shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 outline-none appearance-none cursor-pointer"
          >
            <option value="">All Transactions</option>
            <option value="PENDING">⏳ Pending (Awaiting Sync)</option>
            <option value="COMPLETED">✓ Completed (Settled)</option>
            <option value="FAILED">✗ Failed (Voided)</option>
            <option value="REFUNDED">↩ Refunded</option>
          </select>
        </div>
        
        <div className="space-y-4">
          <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide pl-1 flex items-center gap-2">
            <Calendar size={14} className="text-blue-600" /> Date Range
          </Label>
          <div className="grid gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide pl-1">Start Date</span>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-12 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 px-4 font-bold shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide pl-1">End Date</span>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-12 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 px-4 font-bold shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-6">
        <Button
          onClick={handleApplyFilter}
          disabled={!hasFilters}
          variant="default"
          style={{ backgroundColor: '#0a66c2', color: '#ffffff' }}
          className="w-full h-14 rounded-xl shadow-lg hover:shadow-xl font-black text-sm uppercase tracking-wide transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed"
        >
          <CheckCircle2 size={20} className="mr-2 stroke-[3px]" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
