/**
 * Bug Condition Exploration Tests — Dashboard Nominees & Categories Zero
 *
 * **Validates: Requirements 1.1, 1.2, 1.3**
 *
 * These tests MUST FAIL on unfixed code — failure confirms the bug exists.
 * DO NOT attempt to fix the tests or the code when they fail.
 * These tests encode the expected (correct) behavior and will pass after the bug is fixed.
 *
 * Bug: `getMetrics()` in analytics-service.ts reads `nomineesCount` and `categoriesCount`
 * from the `/admin/dashboard` API response. When those fields are absent, null, or 0,
 * the `?? 0` fallback silently produces 0 — no fallback fetch is triggered.
 *
 * Counterexamples found on unfixed code:
 *   - Missing fields:  getMetrics() returns { totalNominees: 0, totalCategories: 0 }
 *   - Null fields:     getMetrics() returns { totalNominees: 0, totalCategories: 0 }
 *   - Zero fields:     getMetrics() returns { totalNominees: 0, totalCategories: 0 }
 *   - Partial missing: getMetrics() returns { totalNominees: 0 } or { totalCategories: 0 }
 *   In all cases the real counts (5 nominees, 3 categories) are never fetched.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { analyticsService } from '../services/analytics-service';
import * as apiClientModule from '@/lib/api-client-instance';

// ---------------------------------------------------------------------------
// Mock setup helpers
// ---------------------------------------------------------------------------

/** 5 minimal nominee objects */
const MOCK_NOMINEES = [
  { id: '1', fullName: 'Alice', voteCount: 2, categories: [] },
  { id: '2', fullName: 'Bob',   voteCount: 1, categories: [] },
  { id: '3', fullName: 'Carol', voteCount: 0, categories: [] },
  { id: '4', fullName: 'Dave',  voteCount: 3, categories: [] },
  { id: '5', fullName: 'Eve',   voteCount: 1, categories: [] },
];

/** 3 minimal category objects */
const MOCK_CATEGORIES = [
  { id: 'c1', name: 'Best Innovation' },
  { id: 'c2', name: 'Best Leadership' },
  { id: 'c3', name: 'Best Teamwork' },
];

/**
 * Wire up apiClient.get mock so that:
 *  - /admin/dashboard  → dashboardPayload
 *  - /admin/nominees   → { nominees: MOCK_NOMINEES, pagination: { totalPages: 1 } }
 *  - /admin/categories → { categories: MOCK_CATEGORIES, pagination: { totalPages: 1 } }
 */
function mockApiClient(dashboardPayload: Record<string, unknown>) {
  vi.spyOn(apiClientModule.apiClient, 'get').mockImplementation(
    (url: string) => {
      if (url === '/admin/dashboard') {
        return Promise.resolve(dashboardPayload) as ReturnType<typeof apiClientModule.apiClient.get>;
      }
      if (url === '/admin/nominees') {
        return Promise.resolve({
          nominees: MOCK_NOMINEES,
          pagination: { page: 1, limit: 100, total: 5, totalPages: 1 },
        }) as ReturnType<typeof apiClientModule.apiClient.get>;
      }
      if (url === '/admin/categories') {
        return Promise.resolve({
          categories: MOCK_CATEGORIES,
          pagination: { page: 1, limit: 100, total: 3, totalPages: 1 },
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
// Bug Condition Exploration Tests
// Each test FAILS on unfixed code — the ?? 0 fallback returns 0 instead of
// triggering a fetch from /admin/nominees or /admin/categories.
// ---------------------------------------------------------------------------

describe('Bug Condition: getMetrics() returns zero when dashboard fields are falsy', () => {

  /**
   * Test 1: Missing fields
   * Dashboard response has NO nomineesCount / categoriesCount keys at all.
   * FAILS on unfixed code: returns { totalNominees: 0, totalCategories: 0 }
   */
  it('missing fields — totalNominees and totalCategories should be > 0 (FAILS on unfixed code)', async () => {
    mockApiClient({ totalVotes: 10, totalRevenue: 500 });

    const result = await analyticsService.getMetrics();

    // On unfixed code these assertions fail because ?? 0 silently returns 0
    expect(result.totalNominees).toBeGreaterThan(0);   // counterexample: 0
    expect(result.totalCategories).toBeGreaterThan(0); // counterexample: 0
  });

  /**
   * Test 2: Null fields
   * Dashboard response explicitly sets both fields to null.
   * FAILS on unfixed code: returns { totalNominees: 0, totalCategories: 0 }
   */
  it('null fields — totalNominees and totalCategories should be > 0 (FAILS on unfixed code)', async () => {
    mockApiClient({ totalVotes: 10, totalRevenue: 500, nomineesCount: null, categoriesCount: null });

    const result = await analyticsService.getMetrics();

    expect(result.totalNominees).toBeGreaterThan(0);   // counterexample: 0
    expect(result.totalCategories).toBeGreaterThan(0); // counterexample: 0
  });

  /**
   * Test 3: Zero fields
   * Dashboard response explicitly sets both fields to 0.
   * FAILS on unfixed code: returns { totalNominees: 0, totalCategories: 0 }
   */
  it('zero fields — totalNominees and totalCategories should be > 0 (FAILS on unfixed code)', async () => {
    mockApiClient({ totalVotes: 10, totalRevenue: 500, nomineesCount: 0, categoriesCount: 0 });

    const result = await analyticsService.getMetrics();

    expect(result.totalNominees).toBeGreaterThan(0);   // counterexample: 0
    expect(result.totalCategories).toBeGreaterThan(0); // counterexample: 0
  });

  /**
   * Test 4: Partial missing — nomineesCount present, categoriesCount absent
   * FAILS on unfixed code: returns { totalCategories: 0 }
   */
  it('partial missing (nomineesCount present, categoriesCount absent) — totalCategories should be > 0 (FAILS on unfixed code)', async () => {
    mockApiClient({ totalVotes: 10, totalRevenue: 500, nomineesCount: 5 });

    const result = await analyticsService.getMetrics();

    // nomineesCount is provided so this should pass even on unfixed code
    expect(result.totalNominees).toBe(5);
    // categoriesCount is absent — on unfixed code ?? 0 returns 0
    expect(result.totalCategories).toBeGreaterThan(0); // counterexample: 0
  });

  /**
   * Test 5: Partial missing — categoriesCount present, nomineesCount absent
   * FAILS on unfixed code: returns { totalNominees: 0 }
   */
  it('partial missing (categoriesCount present, nomineesCount absent) — totalNominees should be > 0 (FAILS on unfixed code)', async () => {
    mockApiClient({ totalVotes: 10, totalRevenue: 500, categoriesCount: 3 });

    const result = await analyticsService.getMetrics();

    // categoriesCount is provided so this should pass even on unfixed code
    expect(result.totalCategories).toBe(3);
    // nomineesCount is absent — on unfixed code ?? 0 returns 0
    expect(result.totalNominees).toBeGreaterThan(0); // counterexample: 0
  });

  /**
   * Test 6: Verify the real counts match the mocked fallback data
   * After the fix, the fallback fetches should return exactly 5 nominees and 3 categories.
   */
  it('missing fields — totalNominees should equal 5 and totalCategories should equal 3 (FAILS on unfixed code)', async () => {
    mockApiClient({ totalVotes: 142, totalRevenue: 4800 });

    const result = await analyticsService.getMetrics();

    expect(result.totalNominees).toBe(5);   // counterexample: 0
    expect(result.totalCategories).toBe(3); // counterexample: 0
    // Votes and revenue should always come from the dashboard response
    expect(result.totalVotes).toBe(142);
    expect(result.totalRevenue).toBe(4800);
  });
});
