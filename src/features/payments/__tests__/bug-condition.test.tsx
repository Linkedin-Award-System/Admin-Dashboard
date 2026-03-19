/**
 * Bug Condition Exploration Tests — Financials Transaction Status Fix
 *
 * **Validates: Requirements 1.1, 1.2**
 *
 * These tests MUST FAIL on unfixed code — failure confirms the bug exists.
 * DO NOT attempt to fix the tests or the code when they fail.
 * These tests encode the expected (correct) behavior and will pass after the bug is fixed.
 *
 * Bug: `unwrapPayments` in payment-service.ts only applies `.toUpperCase()` to normalize
 * status values. The API returns non-standard strings like "success", "paid", "processing",
 * "declined", "reversed", "created", "cancelled" that do NOT match the canonical set
 * { "PENDING", "COMPLETED", "FAILED", "REFUNDED" } after uppercasing.
 *
 * Counterexamples found on unfixed code:
 *   - unwrapPayments([{ status: "success" }])[0].status === "SUCCESS"  (expected "COMPLETED")
 *   - unwrapPayments([{ status: "paid" }])[0].status === "PAID"        (expected "COMPLETED")
 *   - unwrapPayments([{ status: "processing" }])[0].status === "PROCESSING" (expected "PENDING")
 *   - unwrapPayments([{ status: "declined" }])[0].status === "DECLINED" (expected "FAILED")
 *   - unwrapPayments([{ status: "reversed" }])[0].status === "REVERSED" (expected "REFUNDED")
 *   - unwrapPayments([{ status: "created" }])[0].status === "CREATED"  (expected "PENDING")
 *   - unwrapPayments([{ status: "cancelled" }])[0].status === "CANCELLED" (expected "FAILED")
 */

import { describe, it, expect } from 'vitest';
import { unwrapPayments } from '../services/payment-service';

// ---------------------------------------------------------------------------
// Helper: build a minimal raw payment object with a given status
// ---------------------------------------------------------------------------

function makeRaw(status: string) {
  return [
    {
      id: '1',
      txRef: 'TX1',
      amount: 100,
      currency: 'ETB',
      status,
      userId: 'u1',
      packageId: 'p1',
      createdAt: '2024-01-01',
    },
  ];
}

// ---------------------------------------------------------------------------
// Bug Condition Verification
// Confirm that these non-standard statuses ARE bug-condition inputs:
// their .toUpperCase() is NOT in the canonical set.
// These assertions PASS on unfixed code (confirming the inputs are buggy).
// ---------------------------------------------------------------------------

const CANONICAL = new Set(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']);

describe('Bug Condition: non-standard statuses are NOT in canonical set (confirms bug inputs)', () => {
  const nonStandardStatuses = [
    'success',
    'paid',
    'processing',
    'declined',
    'reversed',
    'created',
    'cancelled',
  ];

  for (const status of nonStandardStatuses) {
    it(`"${status}".toUpperCase() is NOT in canonical set`, () => {
      expect(CANONICAL.has(status.toUpperCase())).toBe(false);
    });
  }
});

// ---------------------------------------------------------------------------
// Bug Condition Exploration Tests
// These FAIL on unfixed code — failure proves the alias map is missing.
// ---------------------------------------------------------------------------

describe('Bug Condition: unwrapPayments must map non-standard statuses to canonical values', () => {
  /**
   * Test 1: "success" → "COMPLETED"
   * FAILS on unfixed code: returns "SUCCESS"
   */
  it('"success" maps to "COMPLETED" — FAILS on unfixed code (returns "SUCCESS")', () => {
    const result = unwrapPayments(makeRaw('success'));
    expect(result[0].status).toBe('COMPLETED');
  });

  /**
   * Test 2: "paid" → "COMPLETED"
   * FAILS on unfixed code: returns "PAID"
   */
  it('"paid" maps to "COMPLETED" — FAILS on unfixed code (returns "PAID")', () => {
    const result = unwrapPayments(makeRaw('paid'));
    expect(result[0].status).toBe('COMPLETED');
  });

  /**
   * Test 3: "processing" → "PENDING"
   * FAILS on unfixed code: returns "PROCESSING"
   */
  it('"processing" maps to "PENDING" — FAILS on unfixed code (returns "PROCESSING")', () => {
    const result = unwrapPayments(makeRaw('processing'));
    expect(result[0].status).toBe('PENDING');
  });

  /**
   * Test 4: "declined" → "FAILED"
   * FAILS on unfixed code: returns "DECLINED"
   */
  it('"declined" maps to "FAILED" — FAILS on unfixed code (returns "DECLINED")', () => {
    const result = unwrapPayments(makeRaw('declined'));
    expect(result[0].status).toBe('FAILED');
  });

  /**
   * Test 5: "reversed" → "REFUNDED"
   * FAILS on unfixed code: returns "REVERSED"
   */
  it('"reversed" maps to "REFUNDED" — FAILS on unfixed code (returns "REVERSED")', () => {
    const result = unwrapPayments(makeRaw('reversed'));
    expect(result[0].status).toBe('REFUNDED');
  });

  /**
   * Test 6: "created" → "PENDING"
   * FAILS on unfixed code: returns "CREATED"
   */
  it('"created" maps to "PENDING" — FAILS on unfixed code (returns "CREATED")', () => {
    const result = unwrapPayments(makeRaw('created'));
    expect(result[0].status).toBe('PENDING');
  });

  /**
   * Test 7: "cancelled" → "FAILED"
   * FAILS on unfixed code: returns "CANCELLED"
   */
  it('"cancelled" maps to "FAILED" — FAILS on unfixed code (returns "CANCELLED")', () => {
    const result = unwrapPayments(makeRaw('cancelled'));
    expect(result[0].status).toBe('FAILED');
  });
});
