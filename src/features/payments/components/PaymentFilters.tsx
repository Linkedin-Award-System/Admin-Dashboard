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
    <div className="bg-white p-8 rounded-[2.5rem] border border-border-light shadow-soft space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2">
          <Filter size={14} /> Filter Intelligence
        </h3>
        {hasFilters && (
          <button 
            onClick={handleClearFilter}
            className="text-[10px] font-black text-primary-600 hover:text-primary-700 underline underline-offset-4 flex items-center gap-1"
          >
            <X size={10} /> Clear Specs
          </button>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="status" className="text-xs font-black text-text-secondary uppercase tracking-widest pl-1">Settlement Status</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="flex h-12 w-full rounded-2xl border border-border-light bg-bg-tertiary/30 px-4 py-2 text-sm font-bold text-text-primary shadow-inner focus:ring-2 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="">All Transactions</option>
            <option value="PENDING">Pending (Awaiting Sync)</option>
            <option value="COMPLETED">Completed (Settled)</option>
            <option value="FAILED">Failed (Voided)</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        
        <div className="space-y-4">
          <Label className="text-xs font-black text-text-secondary uppercase tracking-widest pl-1 flex items-center gap-2">
            <Calendar size={14} className="text-text-tertiary" /> Temporal Range
          </Label>
          <div className="grid gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-1">Start</span>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-12 rounded-2xl border-border-light bg-bg-tertiary/30 px-4 font-bold shadow-inner"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest pl-1">End</span>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-12 rounded-2xl border-border-light bg-bg-tertiary/30 px-4 font-bold shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button
          onClick={handleApplyFilter}
          disabled={!hasFilters}
          variant="default"
          style={{ backgroundColor: '#085299', color: '#ffffff' }}
          className="w-full h-14 rounded-2xl shadow-lg shadow-primary-500/20 font-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
        >
          <CheckCircle2 size={18} className="mr-2 stroke-[3px]" />
          Synchronize View
        </Button>
      </div>
    </div>
  );
};
