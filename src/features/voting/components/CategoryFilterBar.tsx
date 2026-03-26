import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import type { SortOrder, CategoryFilter } from '../utils/category-filter-utils';

export interface CategoryOption {
  id: string;
  name: string;
}

export interface CategoryFilterBarProps {
  search: string;
  onSearchChange: (v: string) => void;
  sort: SortOrder;
  onSortChange: (v: SortOrder) => void;
  categoryFilter: CategoryFilter;
  onCategoryFilterChange: (v: CategoryFilter) => void;
  categories: CategoryOption[];
  totalCount: number;
  filteredCount: number;
  isFiltered: boolean;
  onReset: () => void;
}

export const CategoryFilterBar = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
  categoryFilter,
  onCategoryFilterChange,
  categories,
  totalCount,
  filteredCount,
  isFiltered,
  onReset,
}: CategoryFilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Search input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={14}
        />
        <input
          type="text"
          placeholder="Search categories…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-9 pr-8 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all w-44"
        />
        {search && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Sort dropdown */}
      <div className="relative">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          className="h-9 pl-3 pr-8 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer"
        >
          <option value="most-votes">Most Votes</option>
          <option value="fewest-votes">Fewest Votes</option>
          <option value="az">A–Z</option>
        </select>
        <ChevronDown
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={13}
        />
      </div>

      {/* Category filter dropdown */}
      <div className="relative">
        <SlidersHorizontal
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={13}
        />
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value as CategoryFilter)}
          className={`h-9 pl-8 pr-8 rounded-xl border bg-gray-50 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer max-w-[220px] truncate ${
            categoryFilter !== 'all'
              ? 'border-blue-400 text-blue-600'
              : 'border-gray-200 text-gray-700'
          }`}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          size={13}
        />
      </div>

      {/* Count badge */}
      {isFiltered && (
        <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full font-medium">
          {filteredCount} of {totalCount}
        </span>
      )}

      {/* Reset button */}
      {isFiltered && (
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
        >
          Reset filters
        </button>
      )}
    </div>
  );
};
