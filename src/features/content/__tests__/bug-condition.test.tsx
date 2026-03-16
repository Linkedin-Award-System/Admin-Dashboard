/**
 * Bug Condition Exploration Tests
 *
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**
 *
 * These tests MUST FAIL on unfixed code — failure confirms each bug exists.
 * DO NOT attempt to fix the tests or the code when they fail.
 * These tests encode the expected (correct) behavior and will pass after the bugs are fixed.
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

// Mock the hooks module — this is what ContentPage and ContentEditor both resolve to
// (ContentPage imports from '@/features/content' barrel which re-exports from this module)
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

// Stub out heavy sub-components used by ContentPage
vi.mock('@/features/content/components/ContentPreview', () => ({
  ContentPreview: () => React.createElement('div', { 'data-testid': 'content-preview' }),
}));
vi.mock('@/features/content/components/VersionHistory', () => ({
  VersionHistory: () => React.createElement('div', { 'data-testid': 'version-history' }),
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { Sidebar } from '@/shared/components/layout/Sidebar';
import { ContentEditor } from '@/features/content/components/ContentEditor';
import { ImageManager } from '@/features/content/components/ImageManager';
import { ContentPage } from '@/pages/ContentPage';
import { useCurrentContent, useUpdateContent } from '@/features/content/hooks/use-content';
import { uploadService } from '@/features/uploads/services/upload-service';
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
// Test 1 — Nav Label Bug (FIXED)
// Bug was: Sidebar nav item for /content reads 'Web Presence' instead of 'Content Management'
// ---------------------------------------------------------------------------

describe('Test 1 (Nav Label): Sidebar nav item for /content', () => {
  it("should display 'Content Management' for the /content nav item", () => {
    render(<Sidebar isOpen={true} isCollapsed={false} />);

    // After fix: the link for /content should read 'Content Management'
    const contentLink = screen.getByRole('link', { name: /content management/i });
    expect(contentLink).toBeInTheDocument();
    expect(contentLink).toHaveTextContent('Content Management');
  });
});

// ---------------------------------------------------------------------------
// Test 2 — Submit Label Bug (FIXED)
// Bug was: ContentEditor submit button reads 'Sync Configuration' instead of 'Save Changes'
// ---------------------------------------------------------------------------

describe('Test 2 (Submit Label): ContentEditor submit button label', () => {
  beforeEach(() => {
    (useUpdateContent as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });
  });

  it("should display 'Save Changes' on the submit button", () => {
    render(
      <ContentEditor
        initialData={mockInitialData}
        activeSection="hero"
      />
    );

    // After fix: the button should read 'Save Changes'
    const submitButton = screen.getByRole('button', { name: /save changes/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveTextContent('Save Changes');
  });
});

// ---------------------------------------------------------------------------
// Test 3 — Image Upload URL Bug
// Bug: handleFileUpload stores a blob: URL (from URL.createObjectURL) instead of a server URL
// ---------------------------------------------------------------------------

describe('Test 3 (Image Upload URL): ImageManager file upload stores server URL', () => {
  it('should store a non-blob URL after file upload — FAILS because URL.createObjectURL is used', async () => {
    const serverUrl = 'https://cdn.example.com/uploads/test-image.jpg';

    // Mock uploadService to return a server URL (what the fixed code should use)
    (uploadService.uploadImage as Mock).mockResolvedValue({
      url: serverUrl,
      filename: 'test-image.jpg',
      size: 1024,
      mimeType: 'image/jpeg',
    });

    // Mock URL.createObjectURL to return a blob URL (simulating the current buggy behavior)
    const createObjectURLMock = vi.fn().mockReturnValue('blob:http://localhost/fake-blob-id');
    vi.stubGlobal('URL', { ...URL, createObjectURL: createObjectURLMock });

    render(<ImageManager />);

    // Simulate file upload via the hidden file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();

    const mockFile = new File(['image content'], 'test-image.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // Wait for the image to appear in the gallery
    await waitFor(() => {
      const images = screen.getAllByRole('img');
      expect(images.length).toBeGreaterThan(0);

      // This assertion FAILS on unfixed code — the src starts with 'blob:'
      const uploadedImg = images[0];
      expect(uploadedImg.getAttribute('src')).not.toMatch(/^blob:/);
    });

    vi.unstubAllGlobals();
  });
});

// ---------------------------------------------------------------------------
// Test 4 — API Error State Bug
// Bug: ContentPage shows loading spinner when useCurrentContent returns an error
// ---------------------------------------------------------------------------

describe('Test 4 (API Error State): ContentPage renders error UI on fetch failure', () => {
  it('should show an error message when useCurrentContent returns an error — FAILS because spinner renders instead', () => {
    (useCurrentContent as Mock).mockReturnValue({
      isLoading: false,
      error: new Error('500'),
      data: undefined,
    });

    (useUpdateContent as Mock).mockReturnValue({
      mutateAsync: vi.fn(),
      isPending: false,
    });

    render(<ContentPage />);

    // On unfixed code, isLoading=false but the component still shows the loading spinner
    // because there is no error branch — it falls through to the main render
    // We assert an error message is visible; this FAILS because no error UI exists
    const errorElement =
      screen.queryByRole('alert') ??
      screen.queryByText(/error/i) ??
      screen.queryByText(/failed/i) ??
      screen.queryByText(/500/i) ??
      screen.queryByText(/something went wrong/i) ??
      screen.queryByText(/retry/i);

    // This assertion FAILS on unfixed code — no error UI is rendered
    expect(errorElement).not.toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Test 5 — Header Save Wiring Bug (FIXED)
// Bug was: The header Save button in ContentPage has no onClick handler
// ---------------------------------------------------------------------------

describe('Test 5 (Header Save Wiring): ContentPage header Save button triggers form submission', () => {
  it('should call updateContent.mutateAsync when the header Save button is clicked after making the form dirty', async () => {
    const mutateAsyncMock = vi.fn().mockResolvedValue(undefined);

    // Mock fetch so validateImageUrls resolves immediately
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: { get: (h: string) => h === 'content-type' ? 'image/jpeg' : null },
    });
    vi.stubGlobal('fetch', mockFetch);

    (useCurrentContent as Mock).mockReturnValue({
      isLoading: false,
      error: null,
      data: mockContentData,
    });

    (useUpdateContent as Mock).mockReturnValue({
      mutateAsync: mutateAsyncMock,
      isPending: false,
    });

    render(<ContentPage />);

    // Make the form dirty by editing the hero heading field
    const headingInput = screen.getByPlaceholderText(/enter high-impact heading/i);
    fireEvent.change(headingInput, { target: { value: 'Updated Heading' } });

    // Wait for dirty state
    await waitFor(() => {
      expect(screen.getByText(/unsaved changes in draft/i)).toBeInTheDocument();
    });

    // Find and click the header Save button
    const saveButton = screen.getByRole('button', { name: /^save$/i });
    expect(saveButton).toBeInTheDocument();
    fireEvent.click(saveButton);

    // After fix: mutateAsync should be called because the header Save button triggers form submission
    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalled();
    }, { timeout: 8000 });

    vi.unstubAllGlobals();
  }, 10000);
});
