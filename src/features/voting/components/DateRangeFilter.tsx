import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { DateRange } from '../types';

interface DateRangeFilterProps {
  onFilterChange: (dateRange?: DateRange) => void;
}

export const DateRangeFilter = ({ onFilterChange }: DateRangeFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  useEffect(() => {
    const start = searchParams.get('startDate');
    const end = searchParams.get('endDate');
    
    if (start && end) {
      onFilterChange({ startDate: start, endDate: end });
    } else {
      onFilterChange(undefined);
    }
  }, [searchParams, onFilterChange]);

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const params = new URLSearchParams(searchParams);
      params.set('startDate', startDate);
      params.set('endDate', endDate);
      setSearchParams(params);
    }
  };

  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    const params = new URLSearchParams(searchParams);
    params.delete('startDate');
    params.delete('endDate');
    setSearchParams(params);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter by Date Range</CardTitle>
      </CardHeader>
      <CardContent>
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
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Button
            onClick={handleApplyFilter}
            disabled={!startDate || !endDate}
            className="w-full sm:w-auto"
          >
            Apply Filter
          </Button>
          <Button
            variant="outline"
            onClick={handleClearFilter}
            className="w-full sm:w-auto"
          >
            Clear Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
