import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Button } from '@/shared/design-system';
import { Filter, Calendar, X, CheckCircle2, Search } from 'lucide-react';
import type { PaymentFilters as PaymentFiltersType } from '../types';

interface PaymentFiltersProps {
  onFilterChange: (filters?: PaymentFiltersType) => void;
  onSearchChange?: (query: string) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Transactions', emoji: '📋' },
  { value: 'COMPLETED', label: 'Completed', emoji: '✅' },
  { value: 'PENDING', label: 'Pending', emoji: '⏳' },
  { value: 'FAILED', label: 'Failed', emoji: '❌' },
  { value: 'REFUNDED', label: 'Refunded', emoji: '↩️' },
];

export const PaymentFiltersForm = ({ onFilterChange, onSearchChange }: PaymentFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const statusParam = searchParams.get('status');
    const startParam = searchParams.get('startDate');
    const endParam = searchParams.get('endDate');
    const filters: PaymentFiltersType = {};
    if (statusParam) filters.status = statusParam as PaymentFiltersType['status'];
    if (startParam && endParam) { filters.startDate = startParam; filters.endDate = endParam; }
    onFilterChange(Object.keys(filters).length > 0 ? filters : undefined);
  }, [searchParams, onFilterChange]);

  const handleApplyFilter = () => {
    const params = new URLSearchParams(searchParams);
    if (status) params.set('status', status); else params.delete('status');
    if (startDate && endDate) { params.set('startDate', startDate); params.set('endDate', endDate); }
    else { params.delete('startDate'); params.delete('endDate'); }
    setSearchParams(params);
  };

  const handleClearFilter = () => {
    setStatus(''); setStartDate(''); setEndDate(''); setSearch('');
    setSearchParams(new URLSearchParams());
    onSearchChange?.('');
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    onSearchChange?.(val);
  };

  const hasFilters = status || (startDate && endDate) || search;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border-light">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary-50 rounded-lg">
            <Filter size={13} className="text-primary-600" />
          </div>
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Filter Options</span>
        </div>
        {hasFilters && (
          <button
            onClick={handleClearFilter}
            className="text-[10px] font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1"
          >
            <X size={11} strokeWidth={3} /> Clear
          </button>
        )}
      </div>

      {/* Search by Tx Ref */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
          <Search size={12} className="text-gray-400" /> Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search by Tx Ref or User ID..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full h-10 pl-8 pr-3 rounded-xl border border-border-light bg-white text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
          />
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-emerald-500" /> Status
        </Label>
        <div className="space-y-1.5">
          {STATUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatus(opt.value)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2.5 ${
                status === opt.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent hover:border-border-light'
              }`}
            >
              <span className="text-base leading-none">{opt.emoji}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date Range */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
          <Calendar size={12} className="text-blue-500" /> Date Range
        </Label>
        <div className="space-y-2">
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">From</span>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 h-10 rounded-xl border-border-light text-sm"
            />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">To</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 h-10 rounded-xl border-border-light text-sm"
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleApplyFilter}
        variant="primary"
        style={{ backgroundColor: '#085299', color: '#ffffff' }}
        className="w-full h-11 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        <CheckCircle2 size={16} className="mr-2" />
        Apply Filters
      </Button>
    </div>
  );
};
