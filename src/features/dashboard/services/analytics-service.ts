import { apiClient } from '@/lib/api-client-instance';
import type {
  DashboardMetrics,
  VotingTrendData,
  VotesByCategoryData,
  VotingStatusData,
  RevenueTrendData,
  PaymentStatusData,
  NomineesByCategoryData,
  NomineeStatusData,
} from '../types';

// ── Raw API shapes ────────────────────────────────────────────────────────────

interface DashboardApiResponse {
  totalVotes: number;
  uniqueVoters: number;
  totalRevenue: number;
  categoriesCount: number;
  nomineesCount: number;
  topNominees?: Array<{ id: string; fullName: string; voteCount: number; category: string }>;
}

interface Vote {
  id: string;
  nomineeId: string;
  categoryId: string;
  userId: string;
  quantity: number;
  type: string;
  createdAt: string;
}

interface VotesApiResponse {
  votes: Vote[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: string;
}

interface PaymentsApiResponse {
  payments: Payment[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface Category {
  id: string;
  name: string;
  nomineeCount?: number;
  _count?: { nominees?: number };
}

interface Nominee {
  id: string;
  fullName: string;
  voteCount: number;
  categories: Array<{ id: string; name: string }>;
}

interface NomineesApiResponse {
  nominees: Nominee[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface CategoriesApiResponse {
  categories: Category[];
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Unwrap API response that may be a plain array OR a paginated wrapper */
function unwrapArray<T>(raw: unknown, key: string): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj[key])) return obj[key] as T[];
    // Try common wrapper keys
    for (const k of ['data', 'items', 'results']) {
      if (Array.isArray(obj[k])) return obj[k] as T[];
    }
  }
  return [];
}

/** Fetch ALL pages of votes — fetches sequentially to avoid overwhelming the backend */
async function fetchAllVotes(params: Record<string, unknown> = {}): Promise<Vote[]> {
  const first = await apiClient.get<VotesApiResponse | Vote[]>('/admin/votes', {
    params: { ...params, page: 1, limit: 100 },
  });
  const votes = [...unwrapArray<Vote>(first, 'votes')];
  const totalPages = (first as VotesApiResponse)?.pagination?.totalPages ?? 1;
  // Fetch remaining pages sequentially to avoid 500s from concurrent load
  for (let page = 2; page <= totalPages; page++) {
    const r = await apiClient.get<VotesApiResponse | Vote[]>('/admin/votes', {
      params: { ...params, page, limit: 100 },
    });
    votes.push(...unwrapArray<Vote>(r, 'votes'));
  }
  return votes;
}

// Maps non-standard payment status values to canonical ones (mirrors payment-service.ts)
const PAYMENT_STATUS_ALIAS: Record<string, string> = {
  SUCCESS: 'COMPLETED',
  PAID: 'COMPLETED',
  COMPLETE: 'COMPLETED',
  PROCESSING: 'PENDING',
  INITIATED: 'PENDING',
  CREATED: 'PENDING',
  ERROR: 'FAILED',
  DECLINED: 'FAILED',
  CANCELLED: 'FAILED',
  CANCELED: 'FAILED',
  REVERSED: 'REFUNDED',
  CHARGEBACK: 'REFUNDED',
};

function normalizePaymentStatus(raw: string): string {
  const upper = (raw ?? '').toUpperCase();
  return PAYMENT_STATUS_ALIAS[upper] ?? upper;
}

/** Fetch ALL pages of payments — fetches sequentially to avoid overwhelming the backend */
async function fetchAllPayments(params: Record<string, unknown> = {}): Promise<Payment[]> {
  const first = await apiClient.get<PaymentsApiResponse | Payment[]>('/admin/payments', {
    params: { ...params, page: 1, limit: 100 },
  });
  const payments = [...unwrapArray<Payment>(first, 'payments')];
  const totalPages = (first as PaymentsApiResponse)?.pagination?.totalPages ?? 1;
  for (let page = 2; page <= totalPages; page++) {
    const r = await apiClient.get<PaymentsApiResponse | Payment[]>('/admin/payments', {
      params: { ...params, page, limit: 100 },
    });
    payments.push(...unwrapArray<Payment>(r, 'payments'));
  }
  return payments;
}

/** Fetch ALL pages of nominees — fetches sequentially to avoid overwhelming the backend */
async function fetchAllNominees(): Promise<Nominee[]> {
  const first = await apiClient.get<NomineesApiResponse | Nominee[]>('/admin/nominees', {
    params: { page: 1, limit: 100 },
  });
  const nominees = [...unwrapArray<Nominee>(first, 'nominees')];
  const totalPages = (first as NomineesApiResponse)?.pagination?.totalPages ?? 1;
  for (let page = 2; page <= totalPages; page++) {
    const r = await apiClient.get<NomineesApiResponse | Nominee[]>('/admin/nominees', {
      params: { page, limit: 100 },
    });
    nominees.push(...unwrapArray<Nominee>(r, 'nominees'));
  }
  return nominees;
}

/** Fetch ALL categories (handles both array and paginated wrapper) — sequential */
async function fetchAllCategories(): Promise<Category[]> {
  const first = await apiClient.get<CategoriesApiResponse | Category[]>('/admin/categories', {
    params: { page: 1, limit: 100 },
  });
  const cats = [...unwrapArray<Category>(first, 'categories')];
  const totalPages = (first as CategoriesApiResponse)?.pagination?.totalPages ?? 1;
  for (let page = 2; page <= totalPages; page++) {
    const r = await apiClient.get<CategoriesApiResponse | Category[]>('/admin/categories', {
      params: { page, limit: 100 },
    });
    cats.push(...unwrapArray<Category>(r, 'categories'));
  }
  return cats;
}

// ── Trend computation helpers ─────────────────────────────────────────────────

/** Compute period-over-period % change. Returns absolute value + direction. */
function computeTrend(current: number, previous: number): { value: number; isPositive: boolean } {
  if (previous === 0) {
    if (current === 0) return { value: 0, isPositive: true };
    return { value: 100, isPositive: true };
  }
  const pct = ((current - previous) / previous) * 100;
  return { value: Math.abs(parseFloat(pct.toFixed(1))), isPositive: pct >= 0 };
}

/** Sum vote quantities for a list of votes */
function sumVoteQuantities(votes: Vote[]): number {
  return votes.reduce((acc, v) => acc + (v.quantity ?? 1), 0);
}

/** Sum completed payment amounts */
function sumCompletedRevenue(payments: Payment[]): number {
  return payments
    .filter(p => normalizePaymentStatus(p.status ?? '') === 'COMPLETED')
    .reduce((acc, p) => acc + (p.amount ?? 0), 0);
}

/** Filter items whose createdAt falls within [start, end] */
function filterByDateRange<T extends { createdAt?: string }>(items: T[], start: Date, end: Date): T[] {
  return items.filter(item => {
    if (!item.createdAt) return false;
    const d = new Date(item.createdAt);
    return d >= start && d <= end;
  });
}

// ── Service ───────────────────────────────────────────────────────────────────

export const analyticsService = {
  async getMetrics(): Promise<DashboardMetrics> {
    const data = await apiClient.get<DashboardApiResponse>('/admin/dashboard');

    // Fall back to dedicated endpoints when the dashboard response omits or
    // zeroes out nomineesCount / categoriesCount (both run in parallel).
    const needNominees   = !data?.nomineesCount;
    const needCategories = !data?.categoriesCount;

    // Fetch votes + payments alongside nominees/categories to compute real trends
    const [nomineesResult, categoriesResult, allVotes, allPayments] = await Promise.all([
      needNominees   ? fetchAllNominees()   : Promise.resolve(null),
      needCategories ? fetchAllCategories() : Promise.resolve(null),
      fetchAllVotes(),
      fetchAllPayments(),
    ]);

    const totalNominees   = needNominees
      ? (nomineesResult?.length ?? 0)
      : (data.nomineesCount ?? 0);

    const totalCategories = needCategories
      ? (categoriesResult?.length ?? 0)
      : (data.categoriesCount ?? 0);

    // ── Period windows: current = last 30 days, previous = 30–60 days ago ──
    const now           = new Date();
    const currentStart  = new Date(now); currentStart.setDate(now.getDate() - 30);
    const previousStart = new Date(now); previousStart.setDate(now.getDate() - 60);
    const previousEnd   = new Date(currentStart);

    const currentVotes    = filterByDateRange(allVotes,    currentStart,  now);
    const previousVotes   = filterByDateRange(allVotes,    previousStart, previousEnd);
    const currentPayments = filterByDateRange(allPayments, currentStart,  now);
    const prevPayments    = filterByDateRange(allPayments, previousStart, previousEnd);

    // Nominees created in each window (only meaningful when we fetched the list)
    const nominees = nomineesResult ?? [];
    const currentNomCount  = filterByDateRange(nominees as Array<Nominee & { createdAt?: string }>, currentStart, now).length;
    const previousNomCount = filterByDateRange(nominees as Array<Nominee & { createdAt?: string }>, previousStart, previousEnd).length;

    // Categories rarely change — compare total vs previous-period additions
    const cats = categoriesResult ?? [];
    const prevCatCount = filterByDateRange(cats as Array<Category & { createdAt?: string }>, previousStart, previousEnd).length;

    return {
      totalNominees,
      totalCategories,
      totalVotes:   data?.totalVotes   ?? 0,
      totalRevenue: data?.totalRevenue ?? 0,
      trends: {
        votes:      computeTrend(sumVoteQuantities(currentVotes),    sumVoteQuantities(previousVotes)),
        revenue:    computeTrend(sumCompletedRevenue(currentPayments), sumCompletedRevenue(prevPayments)),
        nominees:   computeTrend(currentNomCount,  previousNomCount),
        categories: computeTrend(totalCategories,  prevCatCount),
      },
    };
  },

  async getVotingTrends(days: number = 30): Promise<VotingTrendData[]> {
    try {
      // Fetch all votes without date params (backend may not support them)
      // then filter client-side
      const votes = await fetchAllVotes();

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const filtered = votes.filter(v => {
        if (!v.createdAt) return true;
        const created = new Date(v.createdAt);
        return created >= startDate && created <= endDate;
      });

      if (!filtered.length) return [];

      const byDate = new Map<string, number>();
      filtered.forEach(v => {
        const date = v.createdAt?.split('T')[0];
        if (!date) return;
        byDate.set(date, (byDate.get(date) ?? 0) + (v.quantity ?? 1));
      });

      return Array.from(byDate.entries())
        .map(([date, votes]) => ({ date, votes }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (e) {
      console.error('getVotingTrends:', e);
      return [];
    }
  },

  async getVotesByCategory(): Promise<VotesByCategoryData[]> {
    try {
      // Fetch sequentially — parallel requests can trigger 500s on the backend
      const votes = await fetchAllVotes();
      const cats = await fetchAllCategories();

      if (!votes.length) return [];

      const catMap = new Map(cats.map(c => [c.id, c.name]));

      const byCategory = new Map<string, number>();
      votes.forEach(v => {
        const name = catMap.get(v.categoryId) ?? 'Unknown';
        byCategory.set(name, (byCategory.get(name) ?? 0) + (v.quantity ?? 1));
      });

      return Array.from(byCategory.entries())
        .map(([category, votes]) => ({ category, votes }))
        .sort((a, b) => b.votes - a.votes);
    } catch (e) {
      console.error('getVotesByCategory:', e);
      return [];
    }
  },

  async getVotingStatus(): Promise<VotingStatusData[]> {
    try {
      const votes = await fetchAllVotes();
      if (!votes.length) return [];

      const byType = new Map<string, number>();
      votes.forEach(v => {
        const type = v.type ?? 'STANDARD';
        byType.set(type, (byType.get(type) ?? 0) + 1);
      });

      const total = votes.length;
      return Array.from(byType.entries()).map(([status, count]) => ({
        status,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }));
    } catch (e) {
      console.error('getVotingStatus:', e);
      return [];
    }
  },

  async getRevenueTrends(days: number = 30): Promise<RevenueTrendData[]> {
    try {
      // Fetch all payments without date params (backend may not support them)
      // then filter client-side — same pattern as getVotingTrends
      const payments = await fetchAllPayments();

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Filter to the requested date range
      const inRange = payments.filter(p => {
        if (!p.createdAt) return true;
        const created = new Date(p.createdAt);
        return created >= startDate && created <= endDate;
      });

      // Normalize status and keep only completed payments
      const completed = inRange.filter(p =>
        normalizePaymentStatus(p.status ?? '') === 'COMPLETED'
      );

      if (!completed.length) return [];

      const byDate = new Map<string, number>();
      completed.forEach(p => {
        const date = p.createdAt?.split('T')[0];
        if (!date) return;
        byDate.set(date, (byDate.get(date) ?? 0) + (p.amount ?? 0));
      });

      return Array.from(byDate.entries())
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => a.date.localeCompare(b.date));
    } catch (e) {
      console.error('getRevenueTrends:', e);
      return [];
    }
  },

  async getPaymentStatus(): Promise<PaymentStatusData[]> {
    try {
      const payments = await fetchAllPayments();
      if (!payments.length) return [];

      const byStatus = new Map<string, number>();
      payments.forEach(p => {
        const s = normalizePaymentStatus(p.status ?? '');
        byStatus.set(s, (byStatus.get(s) ?? 0) + 1);
      });

      return Array.from(byStatus.entries()).map(([status, count]) => ({ status, count }));
    } catch (e) {
      console.error('getPaymentStatus:', e);
      return [];
    }
  },

  async getNomineesByCategory(): Promise<NomineesByCategoryData[]> {
    try {
      const cats = await fetchAllCategories();
      if (!cats.length) return [];

      // Try nomineeCount first, then _count.nominees (Prisma style), then 0
      const result = cats.map(c => ({
        category: c.name,
        count: c.nomineeCount ?? c._count?.nominees ?? 0,
      }));

      // If all counts are 0, derive from nominees list instead
      const hasRealCounts = result.some(r => r.count > 0);
      if (!hasRealCounts) {
        const nominees = await fetchAllNominees();
        const countMap = new Map<string, number>();
        nominees.forEach(n => {
          (n.categories ?? []).forEach(cat => {
            countMap.set(cat.name, (countMap.get(cat.name) ?? 0) + 1);
          });
        });
        return cats
          .map(c => ({ category: c.name, count: countMap.get(c.name) ?? 0 }))
          .sort((a, b) => b.count - a.count);
      }

      return result.sort((a, b) => b.count - a.count);
    } catch (e) {
      console.error('getNomineesByCategory:', e);
      return [];
    }
  },

  async getNomineeStatus(): Promise<NomineeStatusData[]> {
    try {
      const nominees = await fetchAllNominees();
      if (!nominees.length) return [];

      const withVotes    = nominees.filter(n => (n.voteCount ?? 0) > 0).length;
      const withoutVotes = nominees.length - withVotes;
      const total        = nominees.length;

      return [
        {
          status: 'Active (with votes)',
          count: withVotes,
          percentage: total > 0 ? (withVotes / total) * 100 : 0,
        },
        {
          status: 'Inactive (no votes)',
          count: withoutVotes,
          percentage: total > 0 ? (withoutVotes / total) * 100 : 0,
        },
      ];
    } catch (e) {
      console.error('getNomineeStatus:', e);
      return [];
    }
  },
};
