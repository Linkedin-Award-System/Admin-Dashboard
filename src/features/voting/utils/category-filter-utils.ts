import type { VoteStats } from '../types';

export type SortOrder = 'most-votes' | 'fewest-votes' | 'az';
/** 'all' means show every category; any other string is a specific categoryId */
export type CategoryFilter = 'all' | string;

export function applyFilters(
  stats: VoteStats[],
  search: string,
  sort: SortOrder,
  categoryFilter: CategoryFilter
): VoteStats[] {
  let result = stats;

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(s => s.categoryName.toLowerCase().includes(q));
  }

  if (categoryFilter !== 'all') {
    result = result.filter(s => s.categoryId === categoryFilter);
  }

  if (sort === 'most-votes') return [...result].sort((a, b) => b.totalVotes - a.totalVotes);
  if (sort === 'fewest-votes') return [...result].sort((a, b) => a.totalVotes - b.totalVotes);
  if (sort === 'az') return [...result].sort((a, b) => a.categoryName.localeCompare(b.categoryName, undefined, { sensitivity: 'base' }));

  return result;
}
