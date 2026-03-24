import { useState, useEffect, useRef } from 'react';
import { Download, Loader2 } from 'lucide-react';
import type { NomineeVoteData } from '@/features/voting/types';
import { exportService } from '@/features/exports/services/export-service';
import type { ExportFormat } from '@/features/exports/types';

interface CategoryExportButtonProps {
  categoryName: string;
  nominees: NomineeVoteData[];
}

export function buildLeaderboardFilename(categoryName: string, ext: string): string {
  const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
  const date = new Date().toISOString().split('T')[0];
  return `leaderboard-${slug}-${date}.${ext}`;
}

export function CategoryExportButton({ categoryName, nominees }: CategoryExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (format: ExportFormat) => {
    setIsOpen(false);
    setIsLoading(true);
    try {
      const blob = await exportService.exportCategoryLeaderboard(format, categoryName, nominees);
      const ext = format === 'csv' ? 'csv' : 'pdf';
      const filename = buildLeaderboardFilename(categoryName, ext);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Export failed. Please try again.';
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="relative" ref={wrapperRef}>
        <button
          aria-label={`Export ${categoryName} leaderboard`}
          disabled={isLoading}
          onClick={() => setIsOpen(prev => !prev)}
          className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? <Loader2 className="animate-spin" size={15} />
            : <Download size={15} />
          }
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[80px]">
            <button
              className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer w-full text-left"
              onClick={() => handleSelect('csv')}
            >
              CSV
            </button>
            <button
              className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 cursor-pointer w-full text-left"
              onClick={() => handleSelect('pdf')}
            >
              PDF
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <p role="alert" className="text-xs text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
