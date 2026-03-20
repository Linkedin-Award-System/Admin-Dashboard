/**
 * Preservation Property Tests — Dashboard Nominees & Categories Zero
 *
 * **Validates: Requirements 3.1, 3.2, 3.3**
 *
 * These tests MUST PASS on unfixed code — they confirm the baseline behavior
 * that must be preserved after the fix is applied.
 *
 * Property 2: Preservation - Valid Dashboard Counts and Votes/Revenue Are Unaffected
 *
 * When the `/admin/dashboard` API response already provides valid non-zero
 * `nomineesCount` and `categoriesCount`, `getMetrics()` must:
 *   - Return those exact values for `totalNominees` and `totalCategories`
 *   - Return `totalVotes` and `totalRevenue` from the dashboard response
 *   - NOT call `/admin/nominees` or `/admin/categories`
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyticsService } from '../services/analytics-service';
import * as apiClientModule from '@/lib/api-client-instance';

// ---------------------------------------------------------------------------
// Mock setup helpers
// ---------------------------------------------------------------------------

/**
 * Wire up apiClient.get mock so that:
 *  - /admin/dashboard  → dashboardPayload
 *  - /admin/nominees   → tracked call (should NOT be called in preservation tests)
 *  - /admin/categories → tracked call (should NOT be called in preservation tests)
 */
function mockApiClient(dashboardPayload: Record<string, unknown>) {
  return vi.spyOn(apiClientModule.apiClient, 'get').mockImplementation(
    (url: string) => {
      if (url === '/admin/dashboard') {
        return Promise.resolve(dashboardPayload) as ReturnType<typeof apiClientModule.apiClient.get>;
      }
      if (url === '/admin/nominees') {
        return Promise.resolve({
          nominees: [],
          pagination: { page: 1, limit: 100, total: 0, totalPages: 1 },
        }) as ReturnType<typeof apiClientModule.apiClient.get>;
      }
      if (url === '/admin/categories') {
        return Promise.resolve({
          categories: [],
          pagination: { page: 1, limit: 100, total: 0, totalPages: 1 },
        }) as ReturnType<typeof apiClientModule.apiClient.get>;
      }
      return Promise.resolve({}) as ReturnType<typeof apiClientModule.apiClient.get>;
    }
  );
}

beforeEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Preservation Tests
// Each test PASSES on unfixed code — confirming baseline behavior to preserve.
// ---------------------------------------------------------------------------

describe('Preservation: getMetrics() returns dashboard values when counts are valid non-zero', () => {

  /**
   * Test 1: Valid counts are returned as-is
   * Dashboard response provides nomineesCount: 12, categoriesCount: 5, totalVotes: 142, totalRevenue: 4800
   * getMetrics() must return those exact values.
   */
  it('returns exact values from dashboard when nomineesCount and categoriesCount are valid non-zero', async () => {
    mockApiClient({
      nomineesCount: 12,
      categoriesCount: 5,
      totalVotes: 142,
      totalRevenue: 4800,
    });

    const result = await analyticsService.getMetrics();

    expect(result.totalNominees).toBe(12);
    expect(result.totalCategories).toBe(5);
    expect(result.totalVotes).toBe(142);
    expect(result.totalRevenue).toBe(4800);
  });

  /**
   * Test 2: /admin/nominees and /admin/categories are NOT called when dashboard provides valid counts
   * When the dashboard already has valid non-zero counts, no fallback fetches should occur.
   */
  it('does NOT call /admin/nominees or /admin/categories when dashboard provides valid counts', async () => {
    const getSpy = mockApiClient({
      nomineesCount: 12,
      categoriesCount: 5,
      totalVotes: 142,
      totalRevenue: 4800,
    });

    await analyticsService.getMetrics();

    // Collect all URLs that were called
    const calledUrls = getSpy.mock.calls.map(call => call[0]);

    expect(calledUrls).toContain('/admin/dashboard');
    expect(calledUrls).not.toContain('/admin/nominees');
    expect(calledUrls).not.toContain('/admin/categories');
  });

  /**
   * Test 3: totalVotes is always sourced from the dashboard response
   * Regardless of fallback state, totalVotes must come from the dashboard response.
   */
  it('totalVotes is always sourced from the dashboard response', async () => {
    const votesValues = [0, 1, 50, 142, 999];

    for (const totalVotes of votesValues) {
      vi.restoreAllMocks();
      mockApiClient({
        nomineesCount: 12,
        categoriesCount: 5,
        totalVotes,
        totalRevenue: 4800,
      });

      const result = await analyticsService.getMetrics();
      expect(result.totalVotes).toBe(totalVotes);
    }
  });

  /**
   * Test 4: totalRevenue is always sourced from the dashboard response
   * Regardless of fallback state, totalRevenue must come from the dashboard response.
   */
  it('totalRevenue is always sourced from the dashboard response', async () => {
    const revenueValues = [0, 100, 4800, 99999.99];

    for (const totalRevenue of revenueValues) {
      vi.restoreAllMocks();
      mockApiClient({
        nomineesCount: 12,
        categoriesCount: 5,
        totalVotes: 142,
        totalRevenue,
      });

      const result = await analyticsService.getMetrics();
      expect(result.totalRevenue).toBe(totalRevenue);
    }
  });

  /**
   * Test 5: Various valid non-zero count combinations are preserved
   * Property-based style: multiple combinations of valid counts all pass through unchanged.
   */
  it('preserves various valid non-zero nomineesCount and categoriesCount combinations', async () => {
    const combinations = [
      { nomineesCount: 1, categoriesCount: 1 },
      { nomineesCount: 5, categoriesCount: 3 },
      { nomineesCount: 12, categoriesCount: 5 },
      { nomineesCount: 100, categoriesCount: 20 },
      { nomineesCount: 999, categoriesCount: 50 },
    ];

    for (const { nomineesCount, categoriesCount } of combinations) {
      vi.restoreAllMocks();
      mockApiClient({
        nomineesCount,
        categoriesCount,
        totalVotes: 142,
        totalRevenue: 4800,
      });

      const result = await analyticsService.getMetrics();
      expect(result.totalNominees).toBe(nomineesCount);
      expect(result.totalCategories).toBe(categoriesCount);
    }
  });

  /**
   * Test 6: No extra API calls for any valid non-zero count combination
   * Property-based style: for all valid inputs, only /admin/dashboard is called.
   */
  it('only calls /admin/dashboard for any valid non-zero count combination', async () => {
    const combinations = [
      { nomineesCount: 1, categoriesCount: 1 },
      { nomineesCount: 5, categoriesCount: 3 },
      { nomineesCount: 12, categoriesCount: 5 },
      { nomineesCount: 100, categoriesCount: 20 },
    ];

    for (const { nomineesCount, categoriesCount } of combinations) {
      vi.restoreAllMocks();
      const getSpy = mockApiClient({
        nomineesCount,
        categoriesCount,
        totalVotes: 142,
        totalRevenue: 4800,
      });

      await analyticsService.getMetrics();

      const calledUrls = getSpy.mock.calls.map(call => call[0]);
      expect(calledUrls).not.toContain('/admin/nominees');
      expect(calledUrls).not.toContain('/admin/categories');
    }
  });
});
