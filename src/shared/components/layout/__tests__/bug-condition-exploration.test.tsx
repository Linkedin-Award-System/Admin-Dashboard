/**
 * Bug Condition Exploration Tests — Profile & Account Settings Fix
 *
 * **Validates: Requirements 1.1, 1.2, 1.3**
 *
 * These tests MUST FAIL on unfixed code — failure confirms the bug exists.
 * DO NOT attempt to fix the tests or the code when they fail.
 * These tests encode the expected (correct) behavior and will pass after the bug is fixed.
 *
 * Bug: Both "My Profile" and "Account Settings" menu items in `ProfileDropdown`
 * are wired to the same `handleOpenSettings` action. The `onOpenProfile` prop
 * does not exist yet, so both items call `onOpenSettings`.
 *
 * Counterexamples found on unfixed code:
 *   - Clicking "My Profile" invokes onOpenSettings instead of onOpenProfile
 *   - Clicking "Account Settings" invokes onOpenSettings (correct handler, but same as My Profile)
 *   - onOpenProfile is never called regardless of which menu item is clicked
 *   - Both menu items produce identical behavior — no distinction between the two entry points
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProfileDropdown } from '../ProfileDropdown';

// ---------------------------------------------------------------------------
// Mock dependencies
// ---------------------------------------------------------------------------

vi.mock('@/features/auth', () => ({
  useAuthStore: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    logout: vi.fn(),
  }),
}));

// ---------------------------------------------------------------------------
// Helper: render ProfileDropdown with separate spies for each handler
// ---------------------------------------------------------------------------

function renderDropdown(onOpenProfile: () => void, onOpenSettings: () => void) {
  return render(
    <MemoryRouter>
      <ProfileDropdown
        isOpen={true}
        onClose={vi.fn()}
        onOpenProfile={onOpenProfile}
        onOpenSettings={onOpenSettings}
      />
    </MemoryRouter>
  );
}

// ---------------------------------------------------------------------------
// Bug Condition Exploration Tests
// These FAIL on unfixed code — failure proves the bug exists.
// ---------------------------------------------------------------------------

describe('Bug Condition: "My Profile" and "Account Settings" invoke distinct handlers', () => {
  /**
   * Test 1: Clicking "My Profile" should call onOpenProfile, NOT onOpenSettings
   * FAILS on unfixed code: onOpenProfile prop does not exist; both items call onOpenSettings
   */
  it('"My Profile" click calls onOpenProfile and NOT onOpenSettings — FAILS on unfixed code', () => {
    const onOpenProfile = vi.fn();
    const onOpenSettings = vi.fn();

    renderDropdown(onOpenProfile, onOpenSettings);

    const myProfileButton = screen.getByText('My Profile');
    fireEvent.click(myProfileButton);

    // Expected (correct) behavior: onOpenProfile is called
    expect(onOpenProfile).toHaveBeenCalledTimes(1);
    // Expected (correct) behavior: onOpenSettings is NOT called
    expect(onOpenSettings).not.toHaveBeenCalled();
  });

  /**
   * Test 2: Clicking "Account Settings" should call onOpenSettings, NOT onOpenProfile
   * FAILS on unfixed code: onOpenProfile prop does not exist; both items call onOpenSettings
   * (This test may pass on unfixed code for the onOpenSettings assertion, but fails because
   *  onOpenProfile is never invoked — the prop doesn't exist — so the component errors or
   *  the handler is missing entirely)
   */
  it('"Account Settings" click calls onOpenSettings and NOT onOpenProfile — FAILS on unfixed code', () => {
    const onOpenProfile = vi.fn();
    const onOpenSettings = vi.fn();

    renderDropdown(onOpenProfile, onOpenSettings);

    const accountSettingsButton = screen.getByText('Account Settings');
    fireEvent.click(accountSettingsButton);

    // Expected (correct) behavior: onOpenSettings is called
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
    // Expected (correct) behavior: onOpenProfile is NOT called
    expect(onOpenProfile).not.toHaveBeenCalled();
  });

  /**
   * Test 3: The two handlers must be distinct — clicking each item invokes a different callback
   * FAILS on unfixed code: both items call the same handleOpenSettings function
   */
  it('"My Profile" and "Account Settings" invoke different handlers — FAILS on unfixed code', () => {
    const onOpenProfile = vi.fn();
    const onOpenSettings = vi.fn();

    renderDropdown(onOpenProfile, onOpenSettings);

    // Click "My Profile"
    fireEvent.click(screen.getByText('My Profile'));
    // Click "Account Settings"
    fireEvent.click(screen.getByText('Account Settings'));

    // Each handler should be called exactly once
    expect(onOpenProfile).toHaveBeenCalledTimes(1);
    expect(onOpenSettings).toHaveBeenCalledTimes(1);

    // The two spies must be different functions — they should not cross-fire
    // (i.e., onOpenProfile should not have been called by the Account Settings click,
    //  and onOpenSettings should not have been called by the My Profile click)
    expect(onOpenProfile.mock.calls.length).toBe(1);
    expect(onOpenSettings.mock.calls.length).toBe(1);
  });
});
