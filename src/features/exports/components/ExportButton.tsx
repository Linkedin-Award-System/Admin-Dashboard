import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Select } from '@/shared/components/ui/select';
import type { ExportFormat } from '../types';

interface ExportButtonProps {
  onExport: (format: ExportFormat) => Promise<Blob>;
  filename: string;
  label?: string;
  className?: string;
}

/**
 * ExportButton Component
 * Provides a button with format selection dropdown for exporting data
 */
export const ExportButton = ({ 
  onExport, 
  filename, 
  label = 'Export',
  className 
}: ExportButtonProps) => {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call the export function
      const blob = await onExport(format);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with proper extension
      const extension = format === 'csv' ? 'csv' : 'pdf';
      const mimeType = format === 'csv' 
        ? 'text/csv;charset=utf-8;' 
        : 'application/pdf';
      
      link.download = `${filename}.${extension}`;
      link.type = mimeType;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to export data. Please try again.';
      setError(errorMessage);
      console.error('Export error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <Select
          value={format}
          onChange={(e) => setFormat(e.target.value as ExportFormat)}
          disabled={isLoading}
          className="w-24"
          aria-label="Export format"
        >
          <option value="csv">CSV</option>
          <option value="pdf">PDF</option>
        </Select>
        
        <Button
          onClick={handleExport}
          loading={isLoading}
          variant="outline"
          aria-label={`${label} as ${format.toUpperCase()}`}
        >
          {label}
        </Button>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
