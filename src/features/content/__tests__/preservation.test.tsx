/**
 * Preservation Property Tests
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6**
 *
 * These tests verify non-buggy behaviors that MUST remain unchanged after the fix.
 * They MUST PASS on the current (unfixed) code.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

// ---------------------------------------------------------------------------
// Module mocks — hoisted before any imports that use them
// ---------------------------------------------------------------------------

vi.mock('react-router-dom', () => ({
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href: to, ...props }, children),
  useLocation: () => ({ pathname: '/content' }),
}));

vi.mock('@/features/auth', () => ({
  useAuthStore: () => ({ user: { name: 'Admin', role: 'admin' }, logout: vi.fn() }),
}));

vi.mock('@/features/content/hooks/use-content', () => ({
  useCurrentContent: vi.fn(),
  useUpdateContent: vi.fn(),
  useVersionHistory: vi.fn(() => ({ data: [], isLoading: false })),
  usePublishContent: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
  useRevertContent: vi.fn(() => ({ mutateAsync: vi.fn(), isPending: false })),
}));

vi.mock('@/shared/components/layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'layout' }, children),
}));

vi.mock('@/features/uploads/services/upload-service', () => ({
  uploadService: {
    uploadImage: vi.fn(),
  },
}));

vi.mock('@/features/content/components/ContentPreview', () => ({
  ContentPreview: () => React.createElement('div', { 'data-testid': 'content-preview' }),
}));

vi.mock('@/features/content/components/VersionHistory', () => ({
  VersionHistory: () => React.createElement('div', { 'data-testid': 'version-history' }),
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { ContentEditor } from '@/features/content/components/ContentEditor';
import { ImageManager } from '@/features/content/components/ImageManager';
import { ContentPage } from '@/pages/ContentPage';
import { useCurrentContent, useUpdateContent } from '@/features/content/hooks/use-content';
import type { Mock } from 'vitest';

// ---------------------------------------------------------------------------
// Shared mock data
// ---------------------------------------------------------------------------

const mockContentData = {
  id: '1',
  version: 1,
  content: {
    hero: {
      heading: 'Test Heading',
      subheading: 'Test Subheading',
      imageUrl: 'https://example.com/image.jpg',
    },
    about: { text: '<p>About text</p>' },
    timeline: {
      heading: 'Timeline',
      events: [{ date: '2024-01-01', title: 'Event 1', description: 'Desc 1' }],
    },
    sponsors: {
      heading: 'Sponsors',
      logos: [{ name: 'Sponsor 1', imageUrl: 'https://example.com/logo.jpg', url: '' }],
    },
    guide: {
      heading: 'Guide',
      sections: [{ title: 'Section 1', content: 'Content 1' }],
    },
  },
};

const mockInitialData = mockContentData.content;

// ---------------------------------------------------------------------------
// Preservation Test 1 — ContentPage renders with editor sections visible
// Requirement 3.1: navigating to /content renders ContentPage with editor sections
// ---------------------------------------------------------------------------

describe('Preservation 1: ContentPage renders editor sections on /content', () => {
  beforeEach(() => {
    (useCurrentContent as Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockContentData,
    });
    (useUpdateContent as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it('renders ContentPage with hero, about, timeline, sponsors, and guide nav buttons', () => {
    render(<ContentPage />);

    // Section navigation buttons should be visible
    expect(screen.getByRole('button', { name: /hero/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /timeline/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sponsors/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guide/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Preservation Test 2 — ImageManager URL addition validates and appends image
// Requirement 3.2: adding an image by URL validates and adds it to the list
// ---------------------------------------------------------------------------

describe('Preservation 2: ImageManager URL addition validates and appends image', () => {
  it('validates the URL and appends it to the image list when fetch returns ok with image content-type', async () => {
    // Mock fetch to return ok with image content-type
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: (header: string) => (header === 'content-type' ? 'image/jpeg' : null),
      },
    });
    vi.stubGlobal('fetch', mockFetch);

    render(<ImageManager />);

    const urlInput = screen.getByPlaceholderText(/https:\/\/example\.com\/image\.jpg/i);
    const addButton = screen.getByRole('button', { name: /^add$/i });

    fireEvent.change(urlInput, { target: { value: 'https://example.com/photo.jpg' } });
    fireEvent.click(addButton);

    // Wait for the image to appear in the gallery
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);
      const addedImg = images.find(img => img.getAttribute('src') === 'https://example.com/photo.jpg');
      expect(addedImg).toBeDefined();
    });

    vi.unstubAllGlobals();
  });
});

// ---------------------------------------------------------------------------
// Preservation Test 3 — Editing a form field sets isDirty and shows indicator
// Requirement 3.3: editing content shows "Unsaved changes in draft" indicator
// ---------------------------------------------------------------------------

describe('Preservation 3: Editing a form field sets isDirty and shows unsaved indicator', () => {
  beforeEach(() => {
    (useUpdateContent as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it('shows "Unsaved changes in draft" after editing the hero heading field', async () => {
    render(
      <ContentEditor
        initialData={mockInitialData}
        activeSection="hero"
      />
    );

    // Initially the form is not dirty — should show "Content is up to date"
    expect(screen.getByText(/content is up to date/i)).toBeInTheDocument();

    // Edit the hero heading field
    const headingInput = screen.getByPlaceholderText(/enter high-impact heading/i);
    fireEvent.change(headingInput, { target: { value: 'New Heading Value' } });

    // After editing, isDirty should be true and the indicator should appear
    await waitFor(() => {
      expect(screen.getByText(/unsaved changes in draft/i)).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
// Preservation Test 4 — Modal overlays open on button click
// Requirement 3.4: clicking "Live Preview", "History", "Assets" opens respective modal
// ---------------------------------------------------------------------------

describe('Preservation 4: Modal overlays open when header buttons are clicked', () => {
  beforeEach(() => {
    (useCurrentContent as Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockContentData,
    });
    (useUpdateContent as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it('opens the Live Preview modal when "Live Preview" button is clicked', () => {
    render(<ContentPage />);

    const previewButton = screen.getByRole('button', { name: /live preview/i });
    fireEvent.click(previewButton);

    // The preview modal should be visible
    expect(screen.getByTestId('content-preview')).toBeInTheDocument();
  });

  it('opens the History modal when "History" button is clicked', () => {
    render(<ContentPage />);

    const historyButton = screen.getByRole('button', { name: /^history$/i });
    fireEvent.click(historyButton);

    // The version history panel should be visible
    expect(screen.getByTestId('version-history')).toBeInTheDocument();
  });

  it('opens the Assets modal when "Assets" button is clicked', () => {
    render(<ContentPage />);

    const assetsButton = screen.getByRole('button', { name: /^assets$/i });
    fireEvent.click(assetsButton);

    // The asset manager heading should be visible
    expect(screen.getByText(/asset manager/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Preservation Test 5 — Submitting with empty hero heading shows Zod error
// Requirement 3.6: submitting invalid data shows Zod validation errors inline
//                  without calling updateContent.mutateAsync
// ---------------------------------------------------------------------------

describe('Preservation 5: Submitting with empty hero heading shows Zod validation error', () => {
  it('shows a Zod validation error inline and does NOT call updateContent.mutateAsync', async () => {
    const mutateAsyncMock = vi.fn();
    (useUpdateContent as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    });

    // Provide initialData with an empty hero heading to trigger validation
    const invalidInitialData = {
      ...mockInitialData,
      hero: {
        ...mockInitialData.hero,
        heading: '',
      },
    };

    render(
      <ContentEditor
        initialData={invalidInitialData}
        activeSection="hero"
      />
    );

    // Make the form dirty so the submit button is enabled
    const headingInput = screen.getByPlaceholderText(/enter high-impact heading/i);
    fireEvent.change(headingInput, { target: { value: 'x' } });
    fireEvent.change(headingInput, { target: { value: '' } });

    // Find and click the submit button (currently labeled 'Sync Configuration' on unfixed code)
    const submitButton =
      screen.queryByRole('button', { name: /save changes/i }) ??
      screen.queryByRole('button', { name: /sync configuration/i });
    expect(submitButton).not.toBeNull();

    // Enable the button by making the form dirty with a valid then invalid value
    // We need to trigger a dirty state — change to something then clear
    fireEvent.change(headingInput, { target: { value: 'Temporary' } });

    await waitFor(() => {
      expect(screen.getByText(/unsaved changes in draft/i)).toBeInTheDocument();
    });

    // Now clear the heading to make it invalid
    fireEvent.change(headingInput, { target: { value: '' } });

    // Click submit
    const btn =
      screen.queryByRole('button', { name: /save changes/i }) ??
      screen.queryByRole('button', { name: /sync configuration/i });
    expect(btn).not.toBeNull();
    fireEvent.click(btn!);

    // Zod validation error should appear inline
    await waitFor(() => {
      // Look for any validation error message near the heading field
      const errorMessages = screen.queryAllByText(/required|must|heading|string/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });

    // mutateAsync should NOT have been called
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });
});
