import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { applyFilters } from '../utils/category-filter-utils';
import type { VoteStats } from '../types';

const voteStatsArb = fc.record({
  categoryId: fc.uuid(),
  categoryName: fc.string({ minLength: 1, maxLength: 50 }),
  totalVotes: fc.nat(500),
  nominees: fc.constant([]),
  leadingNominee: fc.record({
    id: fc.string(),
    name: fc.string(),
    voteCount: fc.nat(500),
  }),
}) as fc.Arbitrary<VoteStats>;

const voteStatsArrayArb = fc.array(voteStatsArb, { maxLength: 30 });

describe('applyFilters property-based tests', () => {
  // Property 1: Filtered count never exceeds total count
  // Feature: voting-hub-category-filter, Property 1: Filtered count never exceeds total count
  // Validates: Requirements 4.4
  it('Property 1: Filtered count never exceeds total count', () => {
    fc.assert(fc.property(
      voteStatsArrayArb,
      fc.string(),
      fc.constantFrom('most-votes', 'fewest-votes', 'az') as fc.Arbitrary<'most-votes' | 'fewest-votes' | 'az'>,
      fc.constantFrom('all', 'high', 'some', 'none') as fc.Arbitrary<'all' | 'high' | 'some' | 'none'>,
      (stats, search, sort, activity) => {
        expect(applyFilters(stats, search, sort, activity).length).toBeLessThanOrEqual(stats.length);
      }
    ), { numRuns: 100 });
  });

  // Property 2: Search filter matches all results
  // Feature: voting-hub-category-filter, Property 2: Search filter matches all results
  // Validates: Requirements 1.2
  it('Property 2: Search filter matches all results', () => {
    fc.assert(fc.property(
      voteStatsArrayArb,
      fc.string({ minLength: 1 }),
      (stats, search) => {
        const result = applyFilters(stats, search, 'most-votes', 'all');
        result.forEach(s => {
          expect(s.categoryName.toLowerCase()).toContain(search.trim().toLowerCase());
        });
      }
    ), { numRuns: 100 });
  });

  // Property 3: High activity filter correctness
  // Feature: voting-hub-category-filter, Property 3: High activity filter correctness
  // Validates: Requirements 3.2
  it('Property 3: High activity filter correctness', () => {
    fc.assert(fc.property(voteStatsArrayArb, (stats) => {
      applyFilters(stats, '', 'most-votes', 'high').forEach(s => {
        expect(s.totalVotes).toBeGreaterThanOrEqual(100);
      });
    }), { numRuns: 100 });
  });

  // Property 4: Some activity filter correctness
  // Feature: voting-hub-category-filter, Property 4: Some activity filter correctness
  // Validates: Requirements 3.3
  it('Property 4: Some activity filter correctness', () => {
    fc.assert(fc.property(voteStatsArrayArb, (stats) => {
      applyFilters(stats, '', 'most-votes', 'some').forEach(s => {
        expect(s.totalVotes).toBeGreaterThan(0);
        expect(s.totalVotes).toBeLessThan(100);
      });
    }), { numRuns: 100 });
  });

  // Property 5: No votes filter correctness
  // Feature: voting-hub-category-filter, Property 5: No votes filter correctness
  // Validates: Requirements 3.4
  it('Property 5: No votes filter correctness', () => {
    fc.assert(fc.property(voteStatsArrayArb, (stats) => {
      applyFilters(stats, '', 'most-votes', 'none').forEach(s => {
        expect(s.totalVotes).toBe(0);
      });
    }), { numRuns: 100 });
  });

  // Property 6: Most-votes sort order
  // Feature: voting-hub-category-filter, Property 6: Most-votes sort order
  // Validates: Requirements 2.2
  it('Property 6: Most-votes sort order', () => {
    fc.assert(fc.property(voteStatsArrayArb, (stats) => {
      const result = applyFilters(stats, '', 'most-votes', 'all');
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].totalVotes).toBeGreaterThanOrEqual(result[i + 1].totalVotes);
      }
    }), { numRuns: 100 });
  });

  // Property 7: Fewest-votes sort order
  // Feature: voting-hub-category-filter, Property 7: Fewest-votes sort order
  // Validates: Requirements 2.3
  it('Property 7: Fewest-votes sort order', () => {
    fc.assert(fc.property(voteStatsArrayArb, (stats) => {
      const result = applyFilters(stats, '', 'fewest-votes', 'all');
      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].totalVotes).toBeLessThanOrEqual(result[i + 1].totalVotes);
      }
    }), { numRuns: 100 });
  });

  // Property 8: A-Z sort order
  // Feature: voting-hub-category-filter, Property 8: A-Z sort order
  // Validates: Requirements 2.4
  it('Property 8: A-Z sort order', () => {
    fc.assert(fc.property(voteStatsArrayArb, (stats) => {
      const result = applyFilters(stats, '', 'az', 'all');
      for (let i = 0; i < result.length - 1; i++) {
        expect(
          result[i].categoryName.localeCompare(result[i + 1].categoryName, undefined, { sensitivity: 'base' })
        ).toBeLessThanOrEqual(0);
      }
    }), { numRuns: 100 });
  });

  // Property 9: Default state returns all items
  // Feature: voting-hub-category-filter, Property 9: Default state returns all items
  // Validates: Requirements 1.3, 3.5, 5.2
  it('Property 9: Default state returns all items', () => {
    fc.assert(fc.property(voteStatsArrayArb, (stats) => {
      expect(applyFilters(stats, '', 'most-votes', 'all').length).toBe(stats.length);
    }), { numRuns: 100 });
  });

  // Property 10: Reset is idempotent
  // Feature: voting-hub-category-filter, Property 10: Reset is idempotent
  // Validates: Requirements 5.2
  it('Property 10: Reset is idempotent', () => {
    fc.assert(fc.property(voteStatsArrayArb, (stats) => {
      const once = applyFilters(stats, '', 'most-votes', 'all');
      const twice = applyFilters(once, '', 'most-votes', 'all');
      expect(twice.length).toBe(once.length);
    }), { numRuns: 100 });
  });
});
