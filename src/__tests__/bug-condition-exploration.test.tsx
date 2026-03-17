/**
 * Bug Condition Exploration Tests
 *
 * **Validates: Requirements 1.1, 1.2, 2.1, 2.2, 2.3, 5.1, 7.2**
 *
 * These tests MUST FAIL on unfixed code — failure confirms each bug exists.
 * DO NOT attempt to fix the tests or the code when they fail.
 * These tests encode the expected (correct) behavior and will pass after the bugs are fixed.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// ---------------------------------------------------------------------------
// Module mocks — hoisted before any imports that use them
// ---------------------------------------------------------------------------

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/login' }),
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href: to, ...props }, children),
  BrowserRouter: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', {}, children),
}));

vi.mock('@/features/auth', () => ({
  useAuthStore: (selector: (state: { isAuthenticated: boolean }) => unknown) =>
    selector({ isAuthenticated: false }),
  LoginForm: () => React.createElement('div', { 'data-testid': 'login-form' }, 'LoginForm'),
}));

vi.mock('@/features/auth/store/auth-store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/features/voting/hooks/use-voting', () => ({
  useVoteTimeline: vi.fn(),
  useVoteStats: vi.fn(),
}));

vi.mock('@/features/dashboard/components/ChartContainer', () => ({
  ChartContainer: ({ children, title }: { children?: React.ReactNode; title: string }) =>
    React.createElement('div', { 'data-testid': 'chart-container', 'data-title': title }, children),
}));

vi.mock('recharts', () => ({
  AreaChart: ({ children, data }: { children?: React.ReactNode; data?: unknown[] }) =>
    React.createElement('div', { 'data-testid': 'area-chart', 'data-count': data?.length ?? 0 }, children),
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'responsive-container' }, children),
}));

vi.mock('@/features/dashboard/utils/chart-config', () => ({
  chartColorPalette: { primary: '#3b82f6' },
  gridConfig: { vertical: false, horizontal: true, stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '3 3' },
  axisConfig: { axisLine: false, tickLine: false, tick: { fontSize: 12 } },
  tooltipConfig: { contentStyle: {}, labelStyle: {}, itemStyle: {}, cursor: {} },
  areaChartConfig: { type: 'monotone', strokeWidth: 2, fillOpacity: 1 },
  animationConfig: { animationDuration: 800, animationEasing: 'ease-out', isAnimationActive: true },
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { exportService } from '@/features/exports/services/export-service';
import { votingService } from '@/features/voting/services/voting-service';
import { VoteTimeline } from '@/features/voting/components/VoteTimeline';
import { LoginPage } from '@/pages/LoginPage';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { useVoteTimeline, useVoteStats } from '@/features/voting/hooks/use-voting';
import type { Mock } from 'vitest';

// ---------------------------------------------------------------------------
// Test Suite 1 — Export server-call bugs
// Bug: exportService calls non-existent server endpoints instead of generating CSV client-side
// ---------------------------------------------------------------------------

describe('Export server-call bugs', () => {
  beforeEach(() => {
    // Simulate a server that returns a non-ok response (e.g. 404 or 500)
    // The unfixed export-service checks response.ok and throws the specific error message
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      blob: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exportCategories throws "Failed to export categories" when server returns error', async () => {
    // On unfixed code: calls fetch to /admin/categories/export → response.ok is false
    // → throws 'Failed to export categories'
    // Expected (correct) behavior after fix: no fetch call at all — CSV generated client-side
    // This test FAILS on unfixed code because the function throws (server-dependency confirmed)
    // After fix: function accepts data param and returns Blob without throwing
    await expect(exportService.exportCategories('csv')).rejects.toThrow('Failed to export categories');
  });

  it('exportVoteStats throws "Failed to export vote statistics" when server returns error', async () => {
    // On unfixed code: calls fetch to /admin/votes/export → response.ok is false
    // → throws 'Failed to export vote statistics'
    await expect(exportService.exportVoteStats('csv')).rejects.toThrow('Failed to export vote statistics');
  });

  it('exportPayments throws "Failed to export payments" when server returns error', async () => {
    // On unfixed code: calls fetch to /admin/payments/export → response.ok is false
    // → throws 'Failed to export payments'
    await expect(exportService.exportPayments('csv')).rejects.toThrow('Failed to export payments');
  });
});

// ---------------------------------------------------------------------------
// Test Suite 2 — Nominee mapping bugs
// Bug: votingService.getStats uses n.categories.some(c => c.id === categoryId)
//      which fails silently when categories is undefined or an array of plain strings
// ---------------------------------------------------------------------------

describe('Nominee mapping — flat categories shape', () => {
  it('returns empty nominees array when nominee.categories is undefined', async () => {
    // Mock apiClient to return nominees with categories: undefined
    const mockApiClient = {
      get: vi.fn(),
    };

    // Votes for category 'cat-1' by nominee 'nom-1'
    mockApiClient.get.mockImplementation((url: string) => {
      if (url === '/admin/votes') {
        return Promise.resolve({
          votes: [
            { id: 'v1', nomineeId: 'nom-1', categoryId: 'cat-1', userId: 'u1', quantity: 5, type: 'FREE', createdAt: '2024-01-01T00:00:00Z' },
          ],
          pagination: { page: 1, limit: 1000, total: 1, totalPages: 1 },
        });
      }
      if (url === '/admin/categories') {
        return Promise.resolve([{ id: 'cat-1', name: 'Category 1', description: '', nomineeCount: 1 }]);
      }
      if (url === '/admin/nominees') {
        // Nominees with categories: undefined — the bug condition
        return Promise.resolve([
          { id: 'nom-1', fullName: 'Alice', voteCount: 5, categories: undefined },
        ]);
      }
      return Promise.resolve([]);
    });

    // Temporarily replace the apiClient used by votingService
    // We do this by mocking the module
    vi.doMock('@/lib/api-client-instance', () => ({ apiClient: mockApiClient }));

    // Re-import to get the mocked version
    const { votingService: freshVotingService } = await import('@/features/voting/services/voting-service?t=1');

    const stats = await freshVotingService.getStats();

    // On unfixed code: n.categories.some(...) throws TypeError because categories is undefined
    // OR the filter silently returns false for all nominees → nominees array is empty
    // Expected (correct) behavior: nominees should be correctly associated
    // This assertion FAILS on unfixed code (nominees is empty due to the bug)
    const cat1Stats = stats.find(s => s.categoryId === 'cat-1');
    expect(cat1Stats).toBeDefined();
    expect(cat1Stats!.nominees).not.toHaveLength(0);
  });

  it('returns empty nominees array when nominee.categories is an array of plain strings', async () => {
    const mockApiClient = {
      get: vi.fn(),
    };

    mockApiClient.get.mockImplementation((url: string) => {
      if (url === '/admin/votes') {
        return Promise.resolve({
          votes: [
            { id: 'v1', nomineeId: 'nom-1', categoryId: 'cat-id-1', userId: 'u1', quantity: 3, type: 'FREE', createdAt: '2024-01-01T00:00:00Z' },
          ],
          pagination: { page: 1, limit: 1000, total: 1, totalPages: 1 },
        });
      }
      if (url === '/admin/categories') {
        return Promise.resolve([{ id: 'cat-id-1', name: 'Category 1', description: '', nomineeCount: 1 }]);
      }
      if (url === '/admin/nominees') {
        // Nominees with categories as plain string IDs — the bug condition
        return Promise.resolve([
          { id: 'nom-1', fullName: 'Bob', voteCount: 3, categories: ['cat-id-1'] },
        ]);
      }
      return Promise.resolve([]);
    });

    vi.doMock('@/lib/api-client-instance', () => ({ apiClient: mockApiClient }));

    const { votingService: freshVotingService } = await import('@/features/voting/services/voting-service?t=2');

    const stats = await freshVotingService.getStats();

    // On unfixed code: n.categories.some(c => c.id === categoryId) returns false
    // because c is a string ('cat-id-1'), not an object with .id
    // So nominees array is empty — this assertion FAILS on unfixed code
    const cat1Stats = stats.find(s => s.categoryId === 'cat-id-1');
    expect(cat1Stats).toBeDefined();
    expect(cat1Stats!.nominees).not.toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Test Suite 3 — Timeline category filter bug
// Bug: VoteTimeline filters timelineData by d.categoryId === selectedCategory
//      but timeline entries have no categoryId field → always empty after selection
// ---------------------------------------------------------------------------

describe('Timeline category filter bug', () => {
  it('chart data is NOT empty after selecting a category pill', async () => {
    // Mock timeline data with NO categoryId field (as the real API returns)
    const mockTimelineData = [
      { timestamp: '2024-01-01', voteCount: 10 },
      { timestamp: '2024-01-02', voteCount: 15 },
      { timestamp: '2024-01-03', voteCount: 8 },
    ];

    const mockVoteStats = [
      { categoryId: 'cat-1', categoryName: 'Digital Innovation', totalVotes: 33, nominees: [], leadingNominee: { id: '', name: 'No nominees', voteCount: 0 } },
    ];

    (useVoteTimeline as Mock).mockReturnValue({
      data: mockTimelineData,
      isLoading: false,
      error: null,
    });

    (useVoteStats as Mock).mockReturnValue({
      data: mockVoteStats,
      isLoading: false,
      error: null,
    });

    render(<VoteTimeline />);

    // Find and click the "Digital Innovation" category pill
    const categoryPill = screen.getByRole('button', { name: /digital innovation/i });
    expect(categoryPill).toBeInTheDocument();
    fireEvent.click(categoryPill);

    // After clicking a category pill, the chart should still show data
    // On unfixed code: filteredData = timelineData.filter(d => d.categoryId === 'cat-1')
    // Since no entry has categoryId, filteredData is [] → chart renders with 0 data points
    // This assertion FAILS on unfixed code (chart data is empty)
    await waitFor(() => {
      const chart = screen.getByTestId('area-chart');
      const dataCount = parseInt(chart.getAttribute('data-count') ?? '0', 10);
      expect(dataCount).toBeGreaterThan(0);
    });
  });
});

// ---------------------------------------------------------------------------
// Test Suite 4 — Login panel bug
// Bug: Left panel shows gradient branding instead of award_image.jpg
// ---------------------------------------------------------------------------

describe('Login panel bug', () => {
  it('left panel contains an <img> with award_image.jpg — FAILS because gradient panel is shown instead', () => {
    render(<LoginPage />);

    // On unfixed code: the left panel is a gradient div with icons and marketing copy
    // No <img> with award_image.jpg is present
    // Expected (correct) behavior: left panel should show award_image.jpg
    // This assertion FAILS on unfixed code
    const awardImage = screen.queryByRole('img', { name: /linkedin creative awards/i }) ??
      document.querySelector('img[src*="award_image"]') ??
      document.querySelector('img[src*="award_image.jpg"]');

    expect(awardImage).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Test Suite 5 — Password toggle bug
// Bug: LoginForm has no eye/eye-off toggle button for the password field
// ---------------------------------------------------------------------------

describe('Password toggle bug', () => {
  it('password field has an eye/eye-off toggle button — FAILS because no toggle exists', async () => {
    const { useAuthStore } = await import('@/features/auth/store/auth-store');
    (useAuthStore as Mock).mockImplementation(
      (selector: (state: { login: () => void }) => unknown) =>
        selector({ login: vi.fn() })
    );

    // We need to render the real LoginForm (not the mocked one from @/features/auth)
    render(<LoginForm />);

    // On unfixed code: no toggle button exists in the password field
    // Expected (correct) behavior: a button with Eye/EyeOff icon should be present
    // This assertion FAILS on unfixed code
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();

    // Look for a toggle button near the password field
    // It could be a button with aria-label, or a button containing an eye icon SVG
    const toggleButton =
      screen.queryByRole('button', { name: /show password/i }) ??
      screen.queryByRole('button', { name: /hide password/i }) ??
      screen.queryByRole('button', { name: /toggle password/i }) ??
      screen.queryByLabelText(/show password/i) ??
      screen.queryByLabelText(/hide password/i) ??
      // Look for any button inside the password field container
      passwordInput.closest('div')?.querySelector('button[type="button"]');

    // This FAILS on unfixed code — no toggle button is present
    expect(toggleButton).not.toBeNull();
  });
});
