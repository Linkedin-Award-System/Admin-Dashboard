import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Calendar, X } from 'lucide-react';
import type { DateRange } from '../types';

interface DateRangeFilterProps {
  onFilterChange: (dateRange?: DateRange) => void;
}

export const DateRangeFilter = ({ onFilterChange }: DateRangeFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  const activeStart = searchParams.get('startDate');
  const activeEnd = searchParams.get('endDate');
  const isActive = !!(activeStart && activeEnd);

  const handleApply = () => {
    if (startDate && endDate) {
      const params = new URLSearchParams(searchParams);
      params.set('startDate', startDate);
      params.set('endDate', endDate);
      setSearchParams(params);
      onFilterChange({ startDate, endDate });
      setOpen(false);
    }
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    const params = new URLSearchParams(searchParams);
    params.delete('startDate');
    params.delete('endDate');
    setSearchParams(params);
    onFilterChange(undefined);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
          isActive
            ? 'border-blue-500 bg-blue-50 text-blue-700'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
        }`}
      >
        <Calendar size={15} />
        {isActive ? `${activeStart} → ${activeEnd}` : 'Filter by Date'}
        {isActive && (
          <span
            onClick={(e) => { e.stopPropagation(); handleClear(); }}
            className="ml-1 text-blue-400 hover:text-blue-700 cursor-pointer"
          >
            <X size={13} />
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl border border-gray-200 shadow-xl p-5 w-72">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Date Range</p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleApply}
                disabled={!startDate || !endDate}
                className="flex-1 h-9 text-sm"
                style={{ backgroundColor: '#085299', color: '#ffffff' }}
              >
                Apply
              </Button>
              {isActive && (
                <Button variant="outline" onClick={handleClear} className="h-9 px-3 text-sm">
                  Clear
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
