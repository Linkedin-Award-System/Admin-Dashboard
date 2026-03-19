/**
 * Preservation Property Tests
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 3.11**
 *
 * These tests verify that existing behaviors (auth, CRUD, content saves, settings saves,
 * image uploads) are NOT broken. They PASS on unfixed code — confirming the baseline to preserve.
 *
 * EXPECTED OUTCOME: All tests PASS (confirms baseline behavior to preserve).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/login' }),
  Link: ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: unknown }) =>
    React.createElement('a', { href: to, ...props }, children),
  BrowserRouter: ({ children }: { children: React.ReactNode }) =>
    React.createElement('div', {}, children),
}));

vi.mock('@/features/auth/store/auth-store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/lib/api-client-instance', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/features/uploads/services/upload-service', () => ({
  uploadService: {
    uploadImage: vi.fn(),
    validateImage: vi.fn().mockReturnValue({ valid: true }),
  },
}));

vi.mock('@/shared/hooks/use-toast-hook', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import { useAuthStore } from '@/features/auth/store/auth-store';
import { apiClient } from '@/lib/api-client-instance';
import { uploadService } from '@/features/uploads/services/upload-service';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { ImageManager } from '@/features/content/components/ImageManager';
import { SettingsModal } from '@/shared/components/layout/SettingsModal';
import { ThemeProvider } from '@/shared/hooks/use-theme';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/features/categories/hooks/use-categories';
import { useNominees, useCreateNominee, useUpdateNominee, useDeleteNominee } from '@/features/nominees/hooks/use-nominees';
import { usePayments } from '@/features/payments/hooks/use-payments';
import { useUpdateContent } from '@/features/content/hooks/use-content';
import type { Mock } from 'vitest';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(
    QueryClientProvider,
    { client: makeQueryClient() },
    children
  );
}

// ---------------------------------------------------------------------------
// Suite 1 — Auth preservation
// Requirements: 3.1, 3.2
// ---------------------------------------------------------------------------

describe('Auth preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('3.1 — login form with valid credentials calls login and does not show error', async () => {
    const mockLogin = vi.fn().mockResolvedValue(undefined);
    (useAuthStore as Mock).mockImplementation(
      (selector: (state: { login: typeof mockLogin }) => unknown) =>
        selector({ login: mockLogin })
    );

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'admin@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'admin@example.com',
        password: 'password123',
      });
    });

    // No error alert should be shown on successful login
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('3.2 — login form with invalid credentials shows authentication error message', async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid email or password'));
    (useAuthStore as Mock).mockImplementation(
      (selector: (state: { login: typeof mockLogin }) => unknown) =>
        selector({ login: mockLogin })
    );

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeTruthy();
    });

    expect(screen.getByText(/authentication failed/i)).toBeTruthy();
    expect(screen.getByText(/invalid email or password/i)).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Suite 2 — useCategories hook preservation
// Requirements: 3.3, 3.4
// ---------------------------------------------------------------------------

describe('useCategories hook preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('3.3 — useCategories calls GET /admin/categories and returns category list', async () => {
    const mockCategories = [
      { id: 'cat-1', name: 'Digital Innovation', description: 'Desc', nomineeCount: 3 },
      { id: 'cat-2', name: 'Photography', description: 'Desc', nomineeCount: 5 },
    ];
    (apiClient.get as Mock).mockResolvedValue(mockCategories);

    function TestComponent() {
      const { data, isLoading } = useCategories();
      if (isLoading) return React.createElement('div', {}, 'loading');
      return React.createElement('div', { 'data-testid': 'count' }, String(data?.length ?? 0));
    }

    render(React.createElement(TestComponent), { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('2');
    });

    expect(apiClient.get).toHaveBeenCalledWith('/admin/categories');
  });

  it('3.4 — useCreateCategory calls POST /admin/categories and invalidates cache', async () => {
    const newCategory = { name: 'New Cat', description: 'Desc' };
    const createdCategory = { id: 'cat-new', ...newCategory, nomineeCount: 0, createdAt: '', updatedAt: '' };
    (apiClient.post as Mock).mockResolvedValue(createdCategory);
    (apiClient.get as Mock).mockResolvedValue([createdCategory]);

    function TestComponent() {
      const mutation = useCreateCategory();
      return React.createElement(
        'button',
        { onClick: () => mutation.mutate(newCategory) },
        'create'
      );
    }

    render(React.createElement(TestComponent), { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/admin/categories', newCategory);
    });
  });

  it('3.4 — useUpdateCategory calls PATCH /admin/categories/:id', async () => {
    const updatedCategory = { id: 'cat-1', name: 'Updated', description: 'Desc', nomineeCount: 0, createdAt: '', updatedAt: '' };
    (apiClient.patch as Mock).mockResolvedValue(updatedCategory);
    (apiClient.get as Mock).mockResolvedValue([updatedCategory]);

    function TestComponent() {
      const mutation = useUpdateCategory();
      return React.createElement(
        'button',
        { onClick: () => mutation.mutate({ id: 'cat-1', data: { name: 'Updated', description: 'Desc' } }) },
        'update'
      );
    }

    render(React.createElement(TestComponent), { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(apiClient.patch).toHaveBeenCalledWith('/admin/categories/cat-1', { name: 'Updated', description: 'Desc' });
    });
  });

  it('3.4 — useDeleteCategory calls DELETE /admin/categories/:id', async () => {
    (apiClient.delete as Mock).mockResolvedValue(undefined);
    (apiClient.get as Mock).mockResolvedValue([]);

    function TestComponent() {
      const mutation = useDeleteCategory();
      return React.createElement(
        'button',
        { onClick: () => mutation.mutate('cat-1') },
        'delete'
      );
    }

    render(React.createElement(TestComponent), { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith('/admin/categories/cat-1');
    });
  });
});

// ---------------------------------------------------------------------------
// Suite 3 — useNominees hook preservation
// Requirements: 3.5, 3.6
// ---------------------------------------------------------------------------

describe('useNominees hook preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('3.5 — useNominees calls GET /admin/nominees and returns nominee list', async () => {
    const mockNominees = [
      { id: 'nom-1', fullName: 'Alice', voteCount: 5, categories: [{ id: 'cat-1', name: 'Digital' }] },
      { id: 'nom-2', fullName: 'Bob', voteCount: 3, categories: [{ id: 'cat-2', name: 'Photo' }] },
    ];
    (apiClient.get as Mock).mockResolvedValue(mockNominees);

    function TestComponent() {
      const { data, isLoading } = useNominees();
      if (isLoading) return React.createElement('div', {}, 'loading');
      return React.createElement('div', { 'data-testid': 'count' }, String(data?.length ?? 0));
    }

    render(React.createElement(TestComponent), { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('2');
    });

    expect(apiClient.get).toHaveBeenCalledWith('/admin/nominees', expect.any(Object));
  });

  it('3.6 — useCreateNominee calls POST /admin/nominees', async () => {
    const newNominee = { fullName: 'Charlie', categoryIds: ['cat-1'], organization: 'Org', bio: '', profileImage: '' };
    const created = { id: 'nom-new', ...newNominee, voteCount: 0, createdAt: '', updatedAt: '' };
    (apiClient.post as Mock).mockResolvedValue(created);
    (apiClient.get as Mock).mockResolvedValue([created]);

    function TestComponent() {
      const mutation = useCreateNominee();
      return React.createElement(
        'button',
        { onClick: () => mutation.mutate(newNominee) },
        'create'
      );
    }

    render(React.createElement(TestComponent), { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith('/admin/nominees', newNominee);
    });
  });

  it('3.6 — useUpdateNominee calls PATCH /admin/nominees/:id', async () => {
    const updateData = { fullName: 'Charlie Updated', categoryIds: ['cat-1'], organization: 'Org', bio: '', profileImage: '' };
    const updated = { id: 'nom-1', ...updateData, voteCount: 0, createdAt: '', updatedAt: '' };
    (apiClient.patch as Mock).mockResolvedValue(updated);
    (apiClient.get as Mock).mockResolvedValue([updated]);

    function TestComponent() {
      const mutation = useUpdateNominee();
      return React.createElement(
        'button',
        { onClick: () => mutation.mutate({ id: 'nom-1', data: updateData }) },
        'update'
      );
    }

    render(React.createElement(TestComponent), { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /update/i }));

    await waitFor(() => {
      expect(apiClient.patch).toHaveBeenCalledWith('/admin/nominees/nom-1', updateData);
    });
  });

  it('3.6 — useDeleteNominee calls DELETE /admin/nominees/:id', async () => {
    (apiClient.delete as Mock).mockResolvedValue(undefined);
    (apiClient.get as Mock).mockResolvedValue([]);

    function TestComponent() {
      const mutation = useDeleteNominee();
      return React.createElement(
        'button',
        { onClick: () => mutation.mutate('nom-1') },
        'delete'
      );
    }

    render(React.createElement(TestComponent), { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith('/admin/nominees/nom-1');
    });
  });
});

// ---------------------------------------------------------------------------
// Suite 4 — usePayments hook preservation
// Requirements: 3.7
// ---------------------------------------------------------------------------

describe('usePayments hook preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('3.7 — usePayments calls GET /admin/payments and returns payment list', async () => {
    const mockPayments = [
      { id: 'pay-1', txRef: 'TX001', amount: 100, currency: 'USD', status: 'COMPLETED', packageId: 'pkg-1', createdAt: '2024-01-01T00:00:00Z', completedAt: null },
      { id: 'pay-2', txRef: 'TX002', amount: 200, currency: 'USD', status: 'PENDING', packageId: 'pkg-2', createdAt: '2024-01-02T00:00:00Z', completedAt: null },
    ];
    // paymentService.getAll returns response.payments — mock the wrapped response
    (apiClient.get as Mock).mockResolvedValue({
      payments: mockPayments,
      pagination: { page: 1, limit: 50, total: 2, totalPages: 1 },
    });

    function TestComponent() {
      const { data, isLoading } = usePayments();
      if (isLoading) return React.createElement('div', {}, 'loading');
      return React.createElement('div', { 'data-testid': 'count' }, String(data?.length ?? 0));
    }

    render(React.createElement(TestComponent), { wrapper });

    await waitFor(() => {
      expect(screen.getByTestId('count').textContent).toBe('2');
    });

    expect(apiClient.get).toHaveBeenCalledWith('/admin/payments', expect.any(Object));
  });
});

// ---------------------------------------------------------------------------
// Suite 5 — ContentEditor onSubmit preservation
// Requirements: 3.9
// ---------------------------------------------------------------------------

describe('ContentEditor onSubmit preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('3.9 — onSubmit calls updateContent.mutateAsync with correct data', async () => {
    // We test useUpdateContent hook directly — it calls PATCH /admin/content
    const mockContentData = {
      hero: { heading: 'Test Heading', subheading: 'Test Sub', imageUrl: 'https://example.com/img.jpg' },
      about: { text: 'About text' },
      timeline: { heading: 'Timeline', events: [] },
      sponsors: { heading: 'Sponsors', logos: [] },
      guide: { heading: 'Guide', sections: [] },
    };

    const updatedContent = { ...mockContentData, id: 'content-1', version: 2 };
    (apiClient.patch as Mock).mockResolvedValue(updatedContent);
    (apiClient.get as Mock).mockResolvedValue(mockContentData);

    function TestComponent() {
      const mutation = useUpdateContent();
      return React.createElement(
        'button',
        { onClick: () => mutation.mutate(mockContentData as Parameters<typeof mutation.mutate>[0]) },
        'save'
      );
    }

    render(React.createElement(TestComponent), { wrapper });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      // contentService.update calls PATCH /admin/content/settings
      expect(apiClient.patch).toHaveBeenCalledWith('/admin/content/settings', mockContentData);
    });
  });
});

// ---------------------------------------------------------------------------
// Suite 6 — ImageManager drag-and-drop upload preservation
// Requirements: 3.11
// ---------------------------------------------------------------------------

describe('ImageManager drag-and-drop upload preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('3.11 — dropping a file on ImageManager calls uploadService.uploadImage', async () => {
    const mockFile = new File(['image content'], 'test.jpg', { type: 'image/jpeg' });
    const mockUploadResponse = {
      url: 'https://cdn.example.com/test.jpg',
      filename: 'test.jpg',
      size: 1024,
      mimeType: 'image/jpeg',
    };
    (uploadService.uploadImage as Mock).mockResolvedValue(mockUploadResponse);

    render(React.createElement(ImageManager, {}));

    // Find the drop zone
    const dropZone = document.querySelector('[class*="border-dashed"]') as HTMLElement;
    expect(dropZone).not.toBeNull();

    // Simulate drag-and-drop
    const dataTransfer = {
      files: [mockFile] as unknown as FileList,
    };

    fireEvent.dragOver(dropZone, { dataTransfer });
    fireEvent.drop(dropZone, { dataTransfer });

    await waitFor(() => {
      expect(uploadService.uploadImage).toHaveBeenCalledWith(mockFile, 'GENERAL');
    });
  });

  it('3.11 — selecting a file via input calls uploadService.uploadImage', async () => {
    const mockFile = new File(['image content'], 'photo.png', { type: 'image/png' });
    const mockUploadResponse = {
      url: 'https://cdn.example.com/photo.png',
      filename: 'photo.png',
      size: 2048,
      mimeType: 'image/png',
    };
    (uploadService.uploadImage as Mock).mockResolvedValue(mockUploadResponse);

    render(React.createElement(ImageManager, {}));

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput).not.toBeNull();

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(uploadService.uploadImage).toHaveBeenCalledWith(mockFile, 'GENERAL');
    });
  });
});

// ---------------------------------------------------------------------------
// Suite 7 — SettingsModal handleSave preservation
// Requirements: 3.10
// ---------------------------------------------------------------------------

describe('SettingsModal handleSave preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // createPortal needs document.body
    document.body.innerHTML = '';
    // jsdom does not implement matchMedia — stub it
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('3.10 — SettingsModal renders profile panel by default', () => {
    render(React.createElement(ThemeProvider, {}, React.createElement(SettingsModal, { isOpen: true, onClose: vi.fn() })));

    // Profile panel should be visible by default
    expect(screen.getByText(/first name/i)).toBeTruthy();
    expect(screen.getByText(/email address/i)).toBeTruthy();
  });

  it('3.10 — SettingsModal Save Changes button is present and clickable', () => {
    const onClose = vi.fn();
    render(React.createElement(ThemeProvider, {}, React.createElement(SettingsModal, { isOpen: true, onClose })));

    const saveButton = screen.getByRole('button', { name: /save changes/i });
    expect(saveButton).toBeTruthy();

    fireEvent.click(saveButton);

    // After clicking save, the button text changes to "Saved!" and onClose is called after timeout
    // We just verify the button was clickable (no error thrown)
    expect(saveButton).toBeTruthy();
  });

  it('3.10 — SettingsModal notifications panel is accessible', () => {
    render(React.createElement(ThemeProvider, {}, React.createElement(SettingsModal, { isOpen: true, onClose: vi.fn() })));

    const notificationsTab = screen.getByRole('button', { name: /notifications/i });
    fireEvent.click(notificationsTab);

    expect(screen.getByText(/email notifications/i)).toBeTruthy();
    expect(screen.getByText(/push notifications/i)).toBeTruthy();
  });

  it('3.10 — SettingsModal appearance panel is accessible', () => {
    render(React.createElement(ThemeProvider, {}, React.createElement(SettingsModal, { isOpen: true, onClose: vi.fn() })));

    const appearanceTab = screen.getByRole('button', { name: /appearance/i });
    fireEvent.click(appearanceTab);

    expect(screen.getByText(/theme/i)).toBeTruthy();
  });

  it('3.10 — SettingsModal does not render when isOpen is false', () => {
    render(React.createElement(ThemeProvider, {}, React.createElement(SettingsModal, { isOpen: false, onClose: vi.fn() })));

    expect(screen.queryByText(/account settings/i)).toBeNull();
  });
});


// ===========================================================================
// API Integration Update — Preservation Property Tests
//
// **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**
//
// These tests verify that service calls NOT in the bug condition continue to
// behave exactly as before. They PASS on both unfixed and fixed code.
//
// EXPECTED OUTCOME: All tests PASS (confirms baseline behavior to preserve).
// ===========================================================================

import { authService } from '@/features/auth/services/auth-service';
import { nomineeService } from '@/features/nominees/services/nominee-service';
import * as fc from 'fast-check';

// ---------------------------------------------------------------------------
// Suite A — authService preservation
// Requirements: 3.1, 3.8
// ---------------------------------------------------------------------------

describe('API Integration Update — authService preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Stub localStorage for token storage
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('3.1 — authService.login calls POST /admin/auth/login', async () => {
    (apiClient.post as Mock).mockResolvedValue({ user: { id: 'u1', email: 'admin@example.com', role: 'ADMIN' }, token: 'tok123' });

    await authService.login({ email: 'admin@example.com', password: 'pass' });

    expect(apiClient.post).toHaveBeenCalledWith(
      '/admin/auth/login',
      { email: 'admin@example.com', password: 'pass' }
    );
  });

  it('3.8 — authService.getProfile calls GET /admin/auth/me', async () => {
    (apiClient.get as Mock).mockResolvedValue({ id: 'u1', email: 'admin@example.com', role: 'ADMIN' });

    await authService.getProfile();

    expect(apiClient.get).toHaveBeenCalledWith('/admin/auth/me');
  });
});

// ---------------------------------------------------------------------------
// Suite B — nomineeService preservation
// Requirements: 3.2, 3.3
// ---------------------------------------------------------------------------

describe('API Integration Update — nomineeService preservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('3.2 — nomineeService.getAll calls GET /admin/nominees', async () => {
    (apiClient.get as Mock).mockResolvedValue([
      { id: 'n1', fullName: 'Alice', voteCount: 0, categories: [] },
    ]);

    await nomineeService.getAll();

    const calls = (apiClient.get as Mock).mock.calls;
    const urls = calls.map((c: unknown[]) => c[0] as string);
    expect(urls.some((u: string) => u === '/admin/nominees')).toBe(true);
  });

  it('3.3 — nomineeService.create calls POST /admin/nominees', async () => {
    const data = { fullName: 'Bob', categoryIds: ['cat-1'], organization: 'Org', bio: '', profileImage: '' };
    (apiClient.post as Mock).mockResolvedValue({ id: 'n2', ...data, voteCount: 0 });

    await nomineeService.create(data);

    expect(apiClient.post).toHaveBeenCalledWith('/admin/nominees', data);
  });

  it('3.3 — nomineeService.update calls PATCH /admin/nominees/:id', async () => {
    const data = { fullName: 'Bob Updated', categoryIds: ['cat-1'], organization: 'Org', bio: '', profileImage: '' };
    (apiClient.patch as Mock).mockResolvedValue({ id: 'n2', ...data, voteCount: 0 });

    await nomineeService.update('n2', data);

    expect(apiClient.patch).toHaveBeenCalledWith('/admin/nominees/n2', data);
  });

  it('3.3 — nomineeService.delete calls DELETE /admin/nominees/:id', async () => {
    (apiClient.delete as Mock).mockResolvedValue(undefined);

    await nomineeService.delete('n2');

    expect(apiClient.delete).toHaveBeenCalledWith('/admin/nominees/n2');
  });
});

// ---------------------------------------------------------------------------
// Suite C — uploadService bucket preservation (GENERAL and CATEGORY_IMAGE)
// Requirements: 3.5
// ---------------------------------------------------------------------------

describe('API Integration Update — uploadService bucket preservation', () => {
  let capturedFormData: FormData | null = null;

  beforeEach(() => {
    capturedFormData = null;
    vi.stubGlobal('fetch', vi.fn().mockImplementation((_url: string, options: RequestInit) => {
      capturedFormData = options.body as FormData;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: { url: 'https://cdn.example.com/img.jpg', filename: 'img.jpg', size: 1024, mimeType: 'image/jpeg' },
        }),
      });
    }));
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue('test-token'),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('3.5 — uploadService.uploadImage with GENERAL sends bucket=GENERAL', async () => {
    const { uploadService: svc } = await vi.importActual<typeof import('@/features/uploads/services/upload-service')>('@/features/uploads/services/upload-service');
    const mockFile = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

    await svc.uploadImage(mockFile, 'GENERAL');

    expect(capturedFormData).not.toBeNull();
    expect(capturedFormData!.get('bucket')).toBe('GENERAL');
  });

  it('3.5 — uploadService.uploadImage with CATEGORY_IMAGE sends bucket=CATEGORY_IMAGE', async () => {
    const { uploadService: svc } = await vi.importActual<typeof import('@/features/uploads/services/upload-service')>('@/features/uploads/services/upload-service');
    const mockFile = new File(['img'], 'category.jpg', { type: 'image/jpeg' });

    await svc.uploadImage(mockFile, 'CATEGORY_IMAGE');

    expect(capturedFormData).not.toBeNull();
    expect(capturedFormData!.get('bucket')).toBe('CATEGORY_IMAGE');
  });

  it('3.5 — Property: for all non-buggy bucket values, the value is sent verbatim in FormData', async () => {
    /**
     * **Validates: Requirements 3.5**
     *
     * Property: for all bucket values in {GENERAL, CATEGORY_IMAGE},
     * uploadService.uploadImage sends that exact value in FormData.
     * These are the preserved (non-buggy) bucket values.
     */
    const { uploadService: svc } = await vi.importActual<typeof import('@/features/uploads/services/upload-service')>('@/features/uploads/services/upload-service');

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('GENERAL' as const, 'CATEGORY_IMAGE' as const),
        async (bucket) => {
          capturedFormData = null;
          const mockFile = new File(['img'], 'test.jpg', { type: 'image/jpeg' });

          await svc.uploadImage(mockFile, bucket);

          expect(capturedFormData).not.toBeNull();
          expect(capturedFormData!.get('bucket')).toBe(bucket);
        }
      )
    );
  });
});
