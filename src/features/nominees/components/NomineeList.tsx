import { useState, useMemo } from 'react';
import { useNominees } from '../hooks/use-nominees';
import { useCategories } from '@/features/categories/hooks/use-categories';
import { Button, PageHeader } from '@/shared/design-system';
import { useSearchParams } from 'react-router-dom';
import {
  Pencil, Trash2, Plus, Users, Linkedin, Search, X,
  ChevronDown, BarChart2, Award, SlidersHorizontal,
} from 'lucide-react';
import { NomineeListSkeleton } from './NomineeListSkeleton';
import { ExportButton } from '@/features/exports/components/ExportButton';
import { exportService } from '@/features/exports/services/export-service';
import type { Nominee } from '../types';
import { formatNumber } from '@/features/dashboard/utils/format-utils';

interface NomineeListProps {
  onEdit?: (nominee: Nominee) => void;
  onDelete?: (nominee: Nominee) => void;
  onCreate?: () => void;
  onSelect?: (nominee: Nominee) => void;
}

// ─── Avatar ──────────────────────────────────────────────────────────────────
const RAILWAY_BASE = 'https://linkedin-creative-awards-api-production.up.railway.app';

function resolveImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (url.startsWith('http')) return url;
  return `${RAILWAY_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}

const NomineeAvatar = ({ nominee }: { nominee: Nominee }) => {
  const [imgError, setImgError] = useState(false);
  const initials = nominee.fullName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const gradients = [
    'from-blue-500 to-indigo-600',
    'from-violet-500 to-purple-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-teal-600',
    'from-cyan-500 to-blue-600',
  ];
  const gradient = gradients[nominee.fullName.charCodeAt(0) % gradients.length];

  if (nominee.profileImageUrl && !imgError) {
    return (
      <div className="h-52 w-full overflow-hidden">
        <img
          src={resolveImageUrl(nominee.profileImageUrl)}
          alt={nominee.fullName}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`h-52 w-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center shadow-xl">
        <span className="text-2xl font-bold text-white tracking-wide">{initials}</span>
      </div>
    </div>
  );
};

// ─── Nominee Card ─────────────────────────────────────────────────────────────
const NomineeCard = ({
  nominee,
  categoryId,
  onEdit,
  onDelete,
  onSelect,
}: {
  nominee: Nominee;
  categoryId: string;
  onEdit?: (n: Nominee) => void;
  onDelete?: (n: Nominee) => void;
  onSelect?: (n: Nominee) => void;
}) => (
  <div
    key={`${categoryId}-${nominee.id}`}
    className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
    onClick={() => onSelect?.(nominee)}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect?.(nominee); }}
  >
    {/* Photo */}
    <div className="relative overflow-hidden">
      <NomineeAvatar nominee={nominee} />
      {/* Vote badge */}
      <div className="absolute top-3 right-3">
        <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-white/60">
          <BarChart2 size={12} className="text-blue-600" />
          <span className="text-xs font-bold text-gray-800">{formatNumber(nominee.voteCount)}</span>
        </div>
      </div>
      {/* Gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
    </div>

    {/* Content */}
    <div className="flex flex-col flex-1 p-5">
      <div className="mb-3">
        <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-1 leading-snug">
          {nominee.fullName}
        </h4>
        {nominee.organization && (
          <p className="text-xs font-medium text-blue-600 mt-0.5 line-clamp-1">{nominee.organization}</p>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
        {nominee.shortBiography}
      </p>

      {/* Category chips */}
      {nominee.categories && nominee.categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {nominee.categories.filter(cat => cat.name).slice(0, 2).map((cat, idx) => (
            <span
              key={cat.id ?? `cat-${idx}`}
              className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-semibold uppercase tracking-wide"
            >
              {cat.name}
            </span>
          ))}
          {nominee.categories.filter(cat => cat.name).length > 2 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[10px] font-semibold">
              +{nominee.categories.filter(cat => cat.name).length - 2}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        <a
          href={nominee.linkedInProfileUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg bg-[#0a66c2]/8 text-[#0a66c2] hover:bg-[#0a66c2] hover:text-white text-xs font-semibold transition-all duration-200 border border-[#0a66c2]/20 hover:border-[#0a66c2]"
        >
          <Linkedin size={13} />
          LinkedIn
        </a>
        {onEdit && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(nominee); }}
            title="Edit"
            className="h-9 w-9 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-500 border border-gray-200 hover:border-blue-200 transition-all"
          >
            <Pencil size={14} strokeWidth={2.5} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(nominee); }}
            title="Delete"
            className="h-9 w-9 rounded-lg flex items-center justify-center bg-red-50 hover:bg-red-500 hover:text-white text-red-500 border border-red-200 hover:border-red-500 transition-all"
          >
            <Trash2 size={14} strokeWidth={2.5} />
          </button>
        )}
      </div>
    </div>
  </div>
);

// ─── Compact Row ─────────────────────────────────────────────────────────────
const CompactRow = ({
  nominee,
  onEdit,
  onDelete,
  onSelect,
}: {
  nominee: Nominee;
  onEdit?: (n: Nominee) => void;
  onDelete?: (n: Nominee) => void;
  onSelect?: (n: Nominee) => void;
}) => (
  <div
    className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-pointer group"
    onClick={() => onSelect?.(nominee)}
  >
    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
      {nominee.profileImageUrl ? (
        <img src={resolveImageUrl(nominee.profileImageUrl)} alt={nominee.fullName} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      ) : (
        <span className="text-xs font-bold text-white">
          {nominee.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
        </span>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors truncate">{nominee.fullName}</p>
      {nominee.organization && <p className="text-xs text-gray-500 truncate">{nominee.organization}</p>}
    </div>
    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 shrink-0">
      <BarChart2 size={12} className="text-blue-500" />
      {formatNumber(nominee.voteCount)}
    </div>
    <div className="flex items-center gap-1.5 shrink-0">
      {onEdit && (
        <button onClick={(e) => { e.stopPropagation(); onEdit(nominee); }} className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
          <Pencil size={13} />
        </button>
      )}
      {onDelete && (
        <button onClick={(e) => { e.stopPropagation(); onDelete(nominee); }} className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
          <Trash2 size={13} />
        </button>
      )}
    </div>
  </div>
);


export const NomineeList = ({ onEdit, onDelete, onCreate, onSelect }: NomineeListProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Derive category filter directly from URL — single source of truth
  const selectedCategoryId = searchParams.get('categoryId') ?? '';
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const ITEMS_PER_PAGE = 24;

  const { data: nominees, isLoading, error } = useNominees(selectedCategoryId || undefined);
  const { data: categories } = useCategories();

  // Build a lookup map: categoryId → categoryName from the categories list
  const categoryNameMap = useMemo(() => {
    const map = new Map<string, string>();
    categories?.forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const filteredNominees = useMemo(() => {
    if (!nominees) return [];
    if (!searchQuery.trim()) return nominees;
    const q = searchQuery.toLowerCase();
    return nominees.filter(
      (n) =>
        n.fullName.toLowerCase().includes(q) ||
        (n.organization && n.organization.toLowerCase().includes(q)) ||
        (n.shortBiography && n.shortBiography.toLowerCase().includes(q))
    );
  }, [nominees, searchQuery]);

  const groupedNominees = useMemo((): Map<string, { categoryName: string; nominees: Nominee[] }> => {
    if (!filteredNominees.length) return new Map();

    const deduped = Array.from(new Map(filteredNominees.map((n) => [n.id, n])).values());
    const grouped = new Map<string, { categoryName: string; nominees: Nominee[] }>();

    deduped.forEach((nominee) => {
      if (!nominee.categories || nominee.categories.length === 0) {
        const key = '__uncategorized__';
        if (!grouped.has(key)) grouped.set(key, { categoryName: 'Uncategorized', nominees: [] });
        grouped.get(key)!.nominees.push(nominee);
      } else {
        nominee.categories.forEach((category) => {
          const hasValidId = category.id && category.id.trim().length > 0;
          const key = hasValidId ? category.id! : '__uncategorized__';
          // Prefer the name from the categories list (authoritative), fall back to what the nominee has
          const resolvedName = (hasValidId && categoryNameMap.get(category.id!))
            || (category.name && category.name.trim().length > 0 ? category.name : 'Uncategorized');
          if (!grouped.has(key)) grouped.set(key, { categoryName: resolvedName, nominees: [] });
          const group = grouped.get(key)!;
          if (!group.nominees.some((n) => n.id === nominee.id)) {
            group.nominees.push(nominee);
          }
        });
      }
    });

    return new Map(
      [...grouped.entries()].sort((a, b) =>
        (a[1].categoryName ?? '').localeCompare(b[1].categoryName ?? '')
      )
    );
  }, [filteredNominees, categoryNameMap]);

  const uniqueNominees = useMemo(() => {
    const seen = new Set<string>();
    const flat: Nominee[] = [];
    groupedNominees.forEach(({ nominees: ns }) => {
      ns.forEach((n) => { if (!seen.has(n.id)) { seen.add(n.id); flat.push(n); } });
    });
    return flat;
  }, [groupedNominees]);

  const totalPages = Math.max(1, Math.ceil(uniqueNominees.length / ITEMS_PER_PAGE));
  const paginatedIds = new Set(
    uniqueNominees.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map((n) => n.id)
  );

  const handleCategoryChange = (value: string) => {
    setCurrentPage(1);
    if (value) {
      setSearchParams({ categoryId: value });
    } else {
      setSearchParams({});
    }
  };
  const handleSearch = (value: string) => { setSearchQuery(value); setCurrentPage(1); };

  if (isLoading) return <NomineeListSkeleton />;

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center p-12 bg-red-50 rounded-3xl border border-red-100 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="text-red-500" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load nominees</h3>
          <p className="text-red-600 text-sm mb-6">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Button variant="secondary" onClick={() => window.location.reload()} className="rounded-xl">
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const totalNominees = nominees?.length ?? 0;
  const totalCategories = groupedNominees.size;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <PageHeader
        title="Nominees"
        subtitle={`${totalNominees} nominees across ${totalCategories} categories`}
        actions={
          <div className="flex items-center gap-3">
            <ExportButton
              onExport={(format) => exportService.exportNominees(format, nominees ?? [])}
              filename="nominees"
              label="Export"
              className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 font-medium h-10"
            />
            {onCreate && (
              <button
                onClick={onCreate}
                className="inline-flex items-center gap-2 h-10 px-5 rounded-xl font-semibold text-sm text-white shadow-md hover:shadow-lg hover:brightness-110 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #085299 0%, #0a66c2 100%)' }}
              >
                <Plus size={16} strokeWidth={3} />
                Add Nominee
              </button>
            )}
          </div>
        }
      />

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Nominees', value: totalNominees, icon: Users, color: 'blue' },
          { label: 'Categories', value: totalCategories, icon: Award, color: 'violet' },
          { label: 'Total Votes', value: uniqueNominees.reduce((s, n) => s + n.voteCount, 0), icon: BarChart2, color: 'emerald' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center bg-${color}-50`}>
              <Icon size={20} className={`text-${color}-600`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(value)}</p>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
          <input
            type="text"
            placeholder="Search nominees by name, organization, or bio..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all outline-none"
          />
          {searchQuery && (
            <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category select */}
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
          <select
            value={selectedCategoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="h-11 pl-9 pr-8 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all outline-none appearance-none min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
        </div>

        {/* View toggle */}
        <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
          {(['grid', 'compact'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {mode === 'grid' ? 'Grid' : 'Compact'}
            </button>
          ))}
        </div>

        {(searchQuery || selectedCategoryId) && (
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap self-center">
            {filteredNominees.length} result{filteredNominees.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Content ── */}
      {groupedNominees.size === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Users className="text-gray-300" size={40} />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            {searchQuery ? 'No results found' : 'No nominees yet'}
          </h3>
          <p className="text-gray-400 text-sm mb-6">
            {searchQuery ? 'Try a different search term or clear the filter.' : 'Add your first nominee to get started.'}
          </p>
          {searchQuery && (
            <Button variant="secondary" className="rounded-xl" onClick={() => handleSearch('')}>Clear search</Button>
          )}
        </div>
      ) : (() => {
        // Determine if we should show grouped view or flat grid.
        // If most groups have only 1 nominee (fragmented data), collapse to flat grid.
        const groups = Array.from(groupedNominees.entries());
        const avgGroupSize = uniqueNominees.length / groups.length;
        const useFlat = avgGroupSize < 2 || groups.length > uniqueNominees.length * 0.6;

        const paginatedNominees = uniqueNominees.filter((n) => paginatedIds.has(n.id));

        if (useFlat && viewMode === 'grid') {
          // Flat grid — all nominees in one responsive grid, no per-category sections
          return (
            <div
              style={{
                display: 'grid',
                gap: '20px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              }}
            >
              {paginatedNominees.map((nominee) => (
                <NomineeCard
                  key={nominee.id}
                  nominee={nominee}
                  categoryId="flat"
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onSelect={onSelect}
                />
              ))}
            </div>
          );
        }

        if (useFlat && viewMode === 'compact') {
          return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {paginatedNominees.map((nominee) => (
                <CompactRow key={nominee.id} nominee={nominee} onEdit={onEdit} onDelete={onDelete} onSelect={onSelect} />
              ))}
            </div>
          );
        }

        // Grouped view
        return (
          <div className="space-y-10">
            {groups.map(([categoryId, { categoryName, nominees: catNominees }]) => {
              const visible = catNominees.filter((n) => paginatedIds.has(n.id));
              if (visible.length === 0) return null;
              return (
                <section key={categoryId} className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5 bg-white border border-gray-100 shadow-sm rounded-2xl px-4 py-2.5">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-sm font-semibold text-gray-800">{categoryName}</span>
                      <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{catNominees.length}</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                  </div>

                  {viewMode === 'grid' ? (
                    <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                      {visible.map((nominee) => (
                        <NomineeCard key={`${categoryId}-${nominee.id}`} nominee={nominee} categoryId={categoryId} onEdit={onEdit} onDelete={onDelete} onSelect={onSelect} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                      {visible.map((nominee) => (
                        <CompactRow key={`${categoryId}-${nominee.id}`} nominee={nominee} onEdit={onEdit} onDelete={onDelete} onSelect={onSelect} />
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        );
      })()}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-5 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Page <span className="font-semibold text-gray-700">{currentPage}</span> of {totalPages}
            <span className="mx-2 text-gray-300">·</span>
            <span className="font-semibold text-gray-700">{uniqueNominees.length}</span> nominees
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-9 px-4 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, idx) =>
                p === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-1.5 text-gray-400 text-sm select-none">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p as number)}
                    className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all ${
                      currentPage === p
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-9 px-4 rounded-xl text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
