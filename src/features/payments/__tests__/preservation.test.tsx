/**
 * Preservation Property Tests — Financials Transaction Status Fix
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
 *
 * These tests document baseline behaviors that MUST remain unchanged after the fix.
 * They MUST PASS on the current (unfixed) code.
 *
 * Observation-first methodology:
 *   - unwrapPayments([{ status: "COMPLETED" }])[0].status returns "COMPLETED" on unfixed code
 *   - unwrapPayments([{ status: "PENDING" }])[0].status returns "PENDING" on unfixed code
 *   - unwrapPayments([{ status: "FAILED" }])[0].status returns "FAILED" on unfixed code
 *   - unwrapPayments([{ status: "REFUNDED" }])[0].status returns "REFUNDED" on unfixed code
 */

import { describe, it, expect } from 'vitest';
import { unwrapPayments } from '../services/payment-service';
import type { PaymentTransaction } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePayment(overrides: Partial<PaymentTransaction>): PaymentTransaction {
  return {
    id: 'pay-1',
    txRef: 'TX-001',
    amount: 100,
    currency: 'USD',
    status: 'COMPLETED',
    userId: 'user-1',
    packageId: 'pkg-1',
    createdAt: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// 1. Canonical status pass-through
// ---------------------------------------------------------------------------

describe('Preservation 1: Canonical status pass-through', () => {
  /**
   * **Validates: Requirements 3.1**
   *
   * For each canonical uppercase status, unwrapPayments must return the same value unchanged.
   * PASSES on unfixed code — the existing .toUpperCase() preserves already-uppercase values.
   */
  const canonicalStatuses: PaymentTransaction['status'][] = [
    'COMPLETED',
    'PENDING',
    'FAILED',
    'REFUNDED',
  ];

  for (const canonicalValue of canonicalStatuses) {
    it(`passes through canonical status "${canonicalValue}" unchanged`, () => {
      const result = unwrapPayments([makePayment({ status: canonicalValue })]);
      expect(result[0].status).toBe(canonicalValue);
    });
  }
});

// ---------------------------------------------------------------------------
// 2. Lowercase canonical pass-through
// ---------------------------------------------------------------------------

describe('Preservation 2: Lowercase canonical pass-through', () => {
  /**
   * **Validates: Requirements 3.1**
   *
   * For each lowercase canonical status, unwrapPayments must return the uppercase equivalent.
   * PASSES on unfixed code — the existing .toUpperCase() handles these correctly.
   */
  const lowercaseStatuses = ['completed', 'pending', 'failed', 'refunded'] as const;

  for (const lowercaseValue of lowercaseStatuses) {
    it(`uppercases lowercase canonical status "${lowercaseValue}"`, () => {
      const result = unwrapPayments([
        makePayment({ status: lowercaseValue as PaymentTransaction['status'] }),
      ]);
      expect(result[0].status).toBe(lowercaseValue.toUpperCase());
    });
  }
});

// ---------------------------------------------------------------------------
// 3. Sort order preserved
// ---------------------------------------------------------------------------

describe('Preservation 3: Sort order preserved', () => {
  /**
   * **Validates: Requirements 3.3**
   *
   * unwrapPayments does NOT sort — it returns payments in the same order as input.
   * Sorting by createdAt descending is done in PaymentList, not in unwrapPayments.
   * PASSES on unfixed code.
   */
  it('returns payments in the same order as input (no sorting applied)', () => {
    const payments = [
      makePayment({ id: 'pay-1', createdAt: '2024-01-03T00:00:00Z', status: 'COMPLETED' }),
      makePayment({ id: 'pay-2', createdAt: '2024-01-01T00:00:00Z', status: 'PENDING' }),
      makePayment({ id: 'pay-3', createdAt: '2024-01-02T00:00:00Z', status: 'FAILED' }),
    ];

    const result = unwrapPayments(payments);

    expect(result[0].id).toBe('pay-1');
    expect(result[1].id).toBe('pay-2');
    expect(result[2].id).toBe('pay-3');
  });
});

// ---------------------------------------------------------------------------
// 4. Revenue calculation
// ---------------------------------------------------------------------------

describe('Preservation 4: Revenue calculation', () => {
  /**
   * **Validates: Requirements 3.5**
   *
   * Only COMPLETED transactions should be summed for revenue.
   * Given payments with statuses [COMPLETED, PENDING, FAILED, REFUNDED] and
   * amounts [100, 200, 300, 400], only the COMPLETED transaction (amount=100)
   * contributes to revenue.
   * PASSES on unfixed code.
   */
  it('only COMPLETED transactions contribute to revenue sum', () => {
    const payments = [
      makePayment({ id: 'pay-1', status: 'COMPLETED', amount: 100 }),
      makePayment({ id: 'pay-2', status: 'PENDING', amount: 200 }),
      makePayment({ id: 'pay-3', status: 'FAILED', amount: 300 }),
      makePayment({ id: 'pay-4', status: 'REFUNDED', amount: 400 }),
    ];

    const result = unwrapPayments(payments);

    const revenue = result
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);

    expect(revenue).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// 5. Unknown status passes through unchanged
// ---------------------------------------------------------------------------

describe('Preservation 5: Unknown status passes through unchanged', () => {
  /**
   * **Validates: Requirements 3.1**
   *
   * An unknown/unmapped status value is passed through as-is (uppercased).
   * The current code just applies .toUpperCase() and passes through.
   * PASSES on unfixed code.
   */
  it('passes through unknown status "UNKNOWN_STATUS" unchanged', () => {
    const result = unwrapPayments([
      makePayment({ status: 'UNKNOWN_STATUS' as PaymentTransaction['status'] }),
    ]);
    expect(result[0].status).toBe('UNKNOWN_STATUS');
  });
});
