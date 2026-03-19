import { useState } from 'react';
import { Trophy, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/shared/design-system/utils/cn';
import { voterService } from '@/features/voters/services/voter-service';
import type { Voter, VoteRecord } from '@/features/voters/types';

interface VoterDetailPanelProps {
  voter: Voter;
  onNavigate: (nomineeId: string) => void;
}

const PAGE_SIZE = 10;

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPage: (p: number) => void;
}

function Pagination({ page, totalPages, total, onPage }: PaginationProps) {
  const pages: (number | '…')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 bg-gray-50/60">
      <p className="text-xs text-gray-400 tabular-nums">
        {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`e-${i}`} className="w-7 text-center text-xs text-gray-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              className={cn(
                'h-7 w-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all',
                page === p
                  ? 'bg-[#0a66c2] text-white shadow-sm shadow-blue-200'
                  : 'border border-gray-200 text-gray-600 hover:bg-white hover:border-gray-300'
              )}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="h-7 w-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-white hover:border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export function VoterDetailPanel({ voter, onNavigate }: VoterDetailPanelProps) {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['voter-votes', voter.userId, page],
    queryFn: () => voterService.getVotes(voter.userId, page, PAGE_SIZE),
    staleTime: 30_000,
  });

  const votes: VoteRecord[] = data?.votes ?? [];
  const total = data?.pagination.total ?? 0;
  const totalPages = data?.pagination.totalPages ?? 1;

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white border-t border-gray-100 px-6 py-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Vote History
        </h3>
        {!isLoading && (
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {total} votes
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : isError ? (
        <p className="text-sm text-red-500 py-4 text-center">Failed to load vote history.</p>
      ) : votes.length === 0 ? (
        <p className="text-sm text-gray-400 py-4 text-center">No vote records found.</p>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="grid grid-cols-[1fr_160px_90px_70px_100px] bg-gray-100 border-b border-gray-200 px-4 py-2">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Nominee</span>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Category</span>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Type</span>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-center">Qty</span>
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider text-right">Date</span>
          </div>

          {votes.map((vr: VoteRecord, index: number) => (
            <div
              key={`${vr.nomineeId}-${vr.createdAt}-${index}`}
              className={cn(
                'grid grid-cols-[1fr_160px_90px_70px_100px] items-center px-4 py-2.5 border-b border-gray-100 last:border-0 transition-colors hover:bg-blue-50/40',
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'
              )}
            >
              <div className="flex items-center gap-2 min-w-0 pr-3">
                <Trophy className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <button
                  type="button"
                  onClick={() => onNavigate(vr.nomineeId)}
                  className="text-[#0a66c2] hover:underline font-medium text-sm truncate text-left"
                >
                  {vr.nomineeName}
                </button>
              </div>
              <span className="text-sm text-gray-600 truncate pr-3">{vr.categoryName}</span>
              <div>
                {vr.type === 'FREE' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">FREE</span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">{vr.type}</span>
                )}
              </div>
              <div className="text-center">
                <span className="inline-flex items-center justify-center w-8 h-6 rounded-md bg-gray-100 text-xs font-bold text-gray-700">{vr.quantity}</span>
              </div>
              <span className="text-xs text-gray-400 text-right tabular-nums">
                {new Date(vr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          ))}

          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} total={total} onPage={setPage} />
          )}
        </div>
      )}
    </div>
  );
}
