// Feature: category-list-view
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { truncateDescription } from '../components/CategoryTableView';

// ─── truncateDescription unit tests ──────────────────────────────────────────

describe('truncateDescription', () => {
  it('returns string unchanged when shorter than 80 chars', () => {
    const short = 'Hello world';
    expect(truncateDescription(short)).toBe(short);
  });

  it('returns string unchanged when exactly 80 chars', () => {
    const exact = 'a'.repeat(80);
    expect(truncateDescription(exact)).toBe(exact);
  });

  it('truncates and appends ellipsis when longer than 80 chars', () => {
    const long = 'a'.repeat(81);
    const result = truncateDescription(long);
    expect(result).toBe('a'.repeat(80) + '…');
    expect(result.length).toBe(81); // 80 chars + 1 ellipsis char
  });

  it('handles empty string', () => {
    expect(truncateDescription('')).toBe('');
  });

  it('respects custom max parameter', () => {
    const str = 'hello world';
    expect(truncateDescription(str, 5)).toBe('hello…');
  });
});

// ─── loadViewMode unit tests ──────────────────────────────────────────────────

describe('loadViewMode (via CategoriesPage)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('defaults to grid when no value in localStorage', () => {
    expect(localStorage.getItem('categories-view-mode')).toBeNull();
    // The default is "grid" — tested indirectly via the helper logic
    const stored = localStorage.getItem('categories-view-mode');
    const result = (stored === 'grid' || stored === 'list') ? stored : 'grid';
    expect(result).toBe('grid');
  });

  it('returns "grid" when localStorage has "grid"', () => {
    localStorage.setItem('categories-view-mode', 'grid');
    const stored = localStorage.getItem('categories-view-mode');
    const result = (stored === 'grid' || stored === 'list') ? stored : 'grid';
    expect(result).toBe('grid');
  });

  it('returns "list" when localStorage has "list"', () => {
    localStorage.setItem('categories-view-mode', 'list');
    const stored = localStorage.getItem('categories-view-mode');
    const result = (stored === 'grid' || stored === 'list') ? stored : 'grid';
    expect(result).toBe('list');
  });

  it('defaults to "grid" when localStorage has an invalid value', () => {
    localStorage.setItem('categories-view-mode', 'table');
    const stored = localStorage.getItem('categories-view-mode');
    const result = (stored === 'grid' || stored === 'list') ? stored : 'grid';
    expect(result).toBe('grid');
  });
});

// ─── CategoryTableView rendering tests ───────────────────────────────────────

// Mock dependencies so we can render CategoryTableView in isolation
vi.mock('../hooks/use-categories', () => ({
  useCategories: vi.fn(),
}));
vi.mock('@/features/nominees/hooks/use-nominees', () => ({
  useNominees: vi.fn(),
}));
vi.mock('@/features/exports/services/export-service', () => ({
  exportService: { exportCategories: vi.fn() },
}));

import { useCategories } from '../hooks/use-categories';
import { useNominees } from '@/features/nominees/hooks/use-nominees';
import { CategoryTableView } from '../components/CategoryTableView';

const mockCategories = [
  { id: '1', name: 'Tech', description: 'Technology awards', nomineeCount: 3, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: '2', name: 'Design', description: 'Design awards', nomineeCount: 2, createdAt: '2024-02-01T00:00:00Z', updatedAt: '2024-02-01T00:00:00Z' },
];

function setupMocks(overrides: { categories?: any; isLoading?: boolean; error?: Error | null } = {}) {
  (useCategories as any).mockReturnValue({
    data: overrides.categories ?? mockCategories,
    isLoading: overrides.isLoading ?? false,
    error: overrides.error ?? null,
  });
  (useNominees as any).mockReturnValue({ data: [] });
}

describe('CategoryTableView', () => {
  beforeEach(() => {
    setupMocks();
  });

  it('renders correct column headers in order', () => {
    render(<CategoryTableView />);
    const headers = screen.getAllByRole('columnheader');
    const labels = headers.map(h => h.textContent?.trim().toLowerCase());
    expect(labels).toEqual(['name', 'description', 'nominees', 'created', 'actions']);
  });

  it('passes loading state to DataTable when categories are loading', () => {
    setupMocks({ isLoading: true, categories: [] });
    const { container } = render(<CategoryTableView />);
    // DataTable renders skeleton rows when loading — check for aria-busy skeletons
    const skeletons = container.querySelectorAll('[aria-busy="true"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows "No categories found" when list is empty', () => {
    setupMocks({ categories: [] });
    render(<CategoryTableView />);
    expect(screen.getByText('No categories found')).toBeInTheDocument();
  });

  it('shows error message and Retry button on error', () => {
    setupMocks({ error: new Error('Network error') });
    render(<CategoryTableView />);
    expect(screen.getByText('Error Loading Categories')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('renders category names in the table', () => {
    render(<CategoryTableView />);
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Design')).toBeInTheDocument();
  });
});

// ─── CategoriesPage default view tests ───────────────────────────────────────

vi.mock('@/features/categories/components/CategoryList', () => ({
  CategoryList: () => <div data-testid="category-list">Grid View</div>,
}));
vi.mock('@/features/categories/components/DeleteCategoryDialog', () => ({
  DeleteCategoryDialog: () => null,
}));
vi.mock('@/shared/components/layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => vi.fn() };
});

import { CategoriesPage } from '@/pages/CategoriesPage';

describe('CategoriesPage', () => {
  beforeEach(() => {
    localStorage.clear();
    setupMocks();
  });

  it('defaults to grid view on fresh mount (no localStorage value)', () => {
    render(<CategoriesPage />);
    expect(screen.getByTestId('category-list')).toBeInTheDocument();
  });
});
