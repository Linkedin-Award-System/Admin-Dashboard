/**
 * Preservation Property Tests — Profile & Account Settings Fix
 *
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4**
 *
 * These tests verify that existing behaviors are NOT broken by the fix.
 * They MUST PASS on UNFIXED code — confirming the baseline to preserve.
 *
 * Behaviors under test:
 *   3.1 — Sign Out calls logout() and navigates to /login
 *   3.2 — Panel navigation inside SettingsModal remains functional (all 5 panels)
 *   3.3 — Clicking outside the dropdown closes it without opening any modal
 *   3.4 — SettingsModal closes when Cancel, X, or backdrop is clicked
 *
 * EXPECTED OUTCOME: All tests PASS on unfixed code.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import { ProfileDropdown } from '../ProfileDropdown';
import { SettingsModal } from '../SettingsModal';
import { ThemeProvider } from '@/shared/hooks/use-theme';

// ---------------------------------------------------------------------------
// Shared mock setup
// ---------------------------------------------------------------------------

const mockNavigate = vi.fn();
const mockLogout = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/features/auth', () => ({
  useAuthStore: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    logout: mockLogout,
  }),
}));

// jsdom does not implement matchMedia — stub it once
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderDropdown() {
  const onClose = vi.fn();
  const onOpenSettings = vi.fn();
  const onOpenProfile = vi.fn();

  render(
    <MemoryRouter>
      <ProfileDropdown
        isOpen={true}
        onClose={onClose}
        onOpenProfile={onOpenProfile}
        onOpenSettings={onOpenSettings}
      />
    </MemoryRouter>
  );

  return { onClose, onOpenSettings, onOpenProfile };
}

function renderModal(isOpen = true) {
  const onClose = vi.fn();
  render(
    <ThemeProvider>
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </ThemeProvider>
  );
  return { onClose };
}

// ---------------------------------------------------------------------------
// Suite 1 — Sign Out preservation (Requirement 3.1)
// ---------------------------------------------------------------------------

describe('Preservation 3.1 — Sign Out always calls logout() and navigates to /login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('clicking "Sign Out" calls logout() exactly once', () => {
    renderDropdown();
    fireEvent.click(screen.getByText('Sign Out'));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('clicking "Sign Out" navigates to /login', () => {
    renderDropdown();
    fireEvent.click(screen.getByText('Sign Out'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('clicking "Sign Out" calls onClose to dismiss the dropdown', () => {
    const { onClose } = renderDropdown();
    fireEvent.click(screen.getByText('Sign Out'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * Property: for any user state (varied name/email strings), Sign Out always
   * calls logout() and navigates to /login.
   *
   * **Validates: Requirements 3.1**
   */
  it('Property: for any user name/email, Sign Out always navigates to /login', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.emailAddress(),
        (name, email) => {
          vi.clearAllMocks();
          cleanup();

          // Re-mock useAuthStore with varied user data
          vi.doMock('@/features/auth', () => ({
            useAuthStore: () => ({
              user: { name, email },
              logout: mockLogout,
            }),
          }));

          const onClose = vi.fn();
          render(
            <MemoryRouter>
              <ProfileDropdown
                isOpen={true}
                onClose={onClose}
                onOpenSettings={vi.fn()}
              />
            </MemoryRouter>
          );

          fireEvent.click(screen.getByText('Sign Out'));

          // Sign Out must always call logout and navigate to /login
          expect(mockLogout).toHaveBeenCalled();
          expect(mockNavigate).toHaveBeenCalledWith('/login');

          cleanup();
        }
      ),
      { numRuns: 20 }
    );
  });
});

// ---------------------------------------------------------------------------
// Suite 2 — Outside-click close preservation (Requirement 3.3)
// ---------------------------------------------------------------------------

describe('Preservation 3.3 — Outside-click closes dropdown without opening any modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('clicking outside the dropdown calls onClose()', () => {
    const { onClose } = renderDropdown();
    // Simulate a mousedown event on document.body (outside the dropdown)
    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking outside the dropdown does NOT call onOpenSettings', () => {
    const { onOpenSettings } = renderDropdown();
    fireEvent.mouseDown(document.body);
    expect(onOpenSettings).not.toHaveBeenCalled();
  });

  /**
   * Property: for any outside-click event (mousedown on document.body),
   * the dropdown closes (onClose called) and no modal opens (onOpenSettings not called).
   *
   * **Validates: Requirements 3.3**
   */
  it('Property: for any outside-click, dropdown closes and no modal opens', () => {
    fc.assert(
      fc.property(
        // Simulate varied "outside" click targets by using different element types
        fc.constantFrom('div', 'span', 'p', 'main', 'section'),
        (tagName) => {
          vi.clearAllMocks();
          cleanup();

          const onClose = vi.fn();
          const onOpenSettings = vi.fn();

          render(
            <MemoryRouter>
              <ProfileDropdown
                isOpen={true}
                onClose={onClose}
                onOpenSettings={onOpenSettings}
              />
            </MemoryRouter>
          );

          // Create an outside element and fire mousedown on it
          const outsideEl = document.createElement(tagName);
          document.body.appendChild(outsideEl);
          fireEvent.mouseDown(outsideEl);

          // Dropdown must close
          expect(onClose).toHaveBeenCalled();
          // No modal must open
          expect(onOpenSettings).not.toHaveBeenCalled();

          cleanup();
        }
      ),
      { numRuns: 10 }
    );
  });
});

// ---------------------------------------------------------------------------
// Suite 3 — SettingsModal close gesture preservation (Requirement 3.4)
// ---------------------------------------------------------------------------

describe('Preservation 3.4 — SettingsModal closes on Cancel, X, and backdrop click', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('clicking the Cancel button calls onClose()', () => {
    const { onClose } = renderModal();
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking the X button calls onClose()', () => {
    const { onClose } = renderModal();
    // The X button is the close icon button in the header
    // It has no accessible name, so find by its position (first button with X icon)
    const buttons = screen.getAllByRole('button');
    // The X close button is the one that is NOT Cancel/Save/nav items
    // It's the header close button — find by aria or by being the only button with X icon
    // We look for a button that contains the X icon (lucide X)
    const xButton = buttons.find(
      (btn) => btn.querySelector('svg') && !btn.textContent?.trim()
    );
    expect(xButton).toBeTruthy();
    fireEvent.click(xButton!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking the backdrop calls onClose()', () => {
    const { onClose } = renderModal();
    // The backdrop is the fixed div with bg-black/60 — it's the first fixed div rendered
    // We find it by its class or by querying the portal
    const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/60') as HTMLElement;
    expect(backdrop).not.toBeNull();
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  /**
   * Property: for any of the three close gestures (Cancel, X, backdrop),
   * onClose is invoked exactly once.
   *
   * **Validates: Requirements 3.4**
   */
  it('Property: for any close gesture, onClose is always invoked', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('cancel', 'x-button', 'backdrop'),
        (gesture) => {
          vi.clearAllMocks();
          cleanup();

          const onClose = vi.fn();
          render(
            <ThemeProvider>
              <SettingsModal isOpen={true} onClose={onClose} />
            </ThemeProvider>
          );

          if (gesture === 'cancel') {
            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            fireEvent.click(cancelButton);
          } else if (gesture === 'x-button') {
            const buttons = screen.getAllByRole('button');
            const xButton = buttons.find(
              (btn) => btn.querySelector('svg') && !btn.textContent?.trim()
            );
            if (xButton) fireEvent.click(xButton);
          } else {
            const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/60') as HTMLElement;
            if (backdrop) fireEvent.click(backdrop);
          }

          expect(onClose).toHaveBeenCalled();

          cleanup();
        }
      ),
      { numRuns: 10 }
    );
  });
});

// ---------------------------------------------------------------------------
// Suite 4 — Panel navigation preservation (Requirement 3.2)
// ---------------------------------------------------------------------------

describe('Preservation 3.2 — All 5 panels remain navigable inside SettingsModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  const panels = [
    { name: 'Profile', contentText: /first name/i },
    { name: 'Notifications', contentText: /email notifications/i },
    { name: 'Security', contentText: /change password/i },
    { name: 'Appearance', contentText: /theme/i },
    { name: 'Credits', contentText: /credit points management/i },
  ] as const;

  panels.forEach(({ name, contentText }) => {
    it(`clicking "${name}" tab shows the ${name} panel content`, () => {
      renderModal();
      const tab = screen.getByRole('button', { name: new RegExp(name, 'i') });
      fireEvent.click(tab);
      expect(screen.getByText(contentText)).toBeTruthy();
    });
  });

  /**
   * Property: for any panel id, clicking its nav button makes that panel's
   * content visible.
   *
   * **Validates: Requirements 3.2**
   */
  it('Property: for any panel, clicking its nav button shows its content', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...panels),
        ({ name, contentText }) => {
          vi.clearAllMocks();
          cleanup();

          renderModal();
          const tab = screen.getByRole('button', { name: new RegExp(name, 'i') });
          fireEvent.click(tab);
          expect(screen.getByText(contentText)).toBeTruthy();

          cleanup();
        }
      ),
      { numRuns: 10 }
    );
  });
});
