/**
 * Property-Based Tests — NotificationDetailPage
 *
 * Feature: notification-detail-page
 *
 * Uses fast-check to verify universal properties of the NotificationDetailPage
 * component across arbitrary valid notification inputs.
 *
 * Optional properties (sub-tasks 6.1–6.8) are listed as TODOs below.
 * The smoke test at the bottom verifies the component renders without crashing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import * as fc from 'fast-check';
import type { Notification, NotificationType } from '../types';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/shared/components/layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

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

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

const notificationTypeArb = fc.constantFrom<NotificationType>(
  'nominee',
  'payment',
  'voting',
  'system',
);

const isoDateArb = fc.date({ min: new Date('2020-01-01'), max: new Date('2030-12-31') }).map(
  (d) => d.toISOString(),
);

const notificationArb = fc.record<Notification>({
  id: fc.uuid(),
  type: notificationTypeArb,
  title: fc.string({ minLength: 1, maxLength: 80 }),
  message: fc.string({ minLength: 1, maxLength: 500 }),
  time: fc.string({ minLength: 1, maxLength: 20 }),
  read: fc.boolean(),
  createdAt: isoDateArb,
});

// ---------------------------------------------------------------------------
// Render helper
// ---------------------------------------------------------------------------

async function renderDetailPage(notification: Notification) {
  const { default: NotificationDetailPage } = await import('@/pages/NotificationDetailPage');
  return render(
    <MemoryRouter initialEntries={[{ pathname: `/notifications/${notification.id}`, state: { notification } }]}>
      <Routes>
        <Route path="/notifications/:id" element={<NotificationDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Smoke test — verifies the component renders without crashing
// ---------------------------------------------------------------------------

describe('NotificationDetailPage — smoke test', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders without crashing for a valid notification', async () => {
    const notification: Notification = {
      id: 'test-id-1',
      type: 'nominee',
      title: 'New Nominee Added',
      message: 'A new nominee has been added to the system.',
      time: '2h ago',
      read: false,
      createdAt: new Date('2025-01-15T14:30:00Z').toISOString(),
    };

    await renderDetailPage(notification);
    expect(screen.getByText('New Nominee Added')).toBeTruthy();
  });

  it('renders not-found state when location.state is null', async () => {
    const { default: NotificationDetailPage } = await import('@/pages/NotificationDetailPage');
    render(
      <MemoryRouter initialEntries={[{ pathname: '/notifications/missing-id', state: null }]}>
        <Routes>
          <Route path="/notifications/:id" element={<NotificationDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText('Notification not found')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// TODO: Property 2 — Back button navigates back (sub-task 6.1)
//
// For any notification rendered on the detail page, clicking the back button
// should invoke navigate(-1).
//
// Validates: Requirements 2.2
//
// it('Property 2: back button invokes navigate(-1) for any notification', async () => {
//   await fc.assert(
//     fc.asyncProperty(notificationArb, async (notification) => {
//       cleanup();
//       vi.clearAllMocks();
//       await renderDetailPage(notification);
//       const backBtn = screen.getByRole('button', { name: /go back/i });
//       fireEvent.click(backBtn);
//       expect(mockNavigate).toHaveBeenCalledWith(-1);
//     }),
//     { numRuns: 100 },
//   );
// });
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO: Property 3 — Type-specific rendering (sub-task 6.2)
//
// For any of the four NotificationType values, the rendered page shows the
// correct uppercase badge label from TYPE_CONFIG.
//
// Validates: Requirements 2.4, 2.7
//
// it('Property 3: correct type badge label for any notification type', async () => {
//   await fc.assert(
//     fc.asyncProperty(notificationArb, async (notification) => {
//       cleanup();
//       const { TYPE_CONFIG } = await import('../constants/type-config');
//       await renderDetailPage(notification);
//       const expectedLabel = TYPE_CONFIG[notification.type].label;
//       expect(screen.getAllByText(expectedLabel).length).toBeGreaterThan(0);
//     }),
//     { numRuns: 100 },
//   );
// });
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO: Property 5 — Content card completeness (sub-task 6.3)
//
// For any notification, the content card contains the full message text,
// the type label string, and a human-readable createdAt.
//
// Validates: Requirements 3.2, 3.3
//
// it('Property 5: content card contains message, type label, and formatted date', async () => {
//   await fc.assert(
//     fc.asyncProperty(notificationArb, async (notification) => {
//       cleanup();
//       await renderDetailPage(notification);
//       expect(screen.getByText(notification.message)).toBeTruthy();
//     }),
//     { numRuns: 100 },
//   );
// });
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO: Property 6 — Read status badge correctness (sub-task 6.4)
//
// For any notification, badge text is "Unread" when read === false and
// "Read" when read === true.
//
// Validates: Requirements 3.4, 3.5
//
// it('Property 6: read status badge matches notification.read', async () => {
//   await fc.assert(
//     fc.asyncProperty(notificationArb, async (notification) => {
//       cleanup();
//       await renderDetailPage(notification);
//       if (notification.read) {
//         expect(screen.getByText('Read')).toBeTruthy();
//       } else {
//         expect(screen.getByText('Unread')).toBeTruthy();
//       }
//     }),
//     { numRuns: 100 },
//   );
// });
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO: Property 7 — Action button routing (sub-task 6.5)
//
// For any notification type, the action button label and navigation path
// match TYPE_CONFIG[type].actionLabel and TYPE_CONFIG[type].actionPath.
//
// Validates: Requirements 4.2, 4.3, 4.4, 4.5
//
// it('Property 7: action button label matches TYPE_CONFIG for any type', async () => {
//   await fc.assert(
//     fc.asyncProperty(notificationArb, async (notification) => {
//       cleanup();
//       const { TYPE_CONFIG } = await import('../constants/type-config');
//       await renderDetailPage(notification);
//       const expectedLabel = TYPE_CONFIG[notification.type].actionLabel;
//       expect(screen.getByRole('button', { name: expectedLabel })).toBeTruthy();
//     }),
//     { numRuns: 100 },
//   );
// });
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO: Property 8 — Mark as read on mount (sub-task 6.6)
//
// For any notification (read or unread), after the page mounts the
// notification's read field is true in rendered state (shows "Read" badge).
//
// Validates: Requirements 5.1
//
// it('Property 8: notification is marked as read after mount', async () => {
//   await fc.assert(
//     fc.asyncProperty(notificationArb, async (notification) => {
//       cleanup();
//       await renderDetailPage(notification);
//       expect(screen.getByText('Read')).toBeTruthy();
//     }),
//     { numRuns: 100 },
//   );
// });
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO: Property 9 — ARIA labels on interactive elements (sub-task 6.7)
//
// For any notification, the back button and action button each have a
// non-empty aria-label attribute.
//
// Validates: Requirements 6.3, 6.4, 6.5
//
// it('Property 9: back and action buttons have non-empty aria-labels', async () => {
//   await fc.assert(
//     fc.asyncProperty(notificationArb, async (notification) => {
//       cleanup();
//       await renderDetailPage(notification);
//       const backBtn = screen.getByRole('button', { name: /go back/i });
//       expect(backBtn.getAttribute('aria-label')).toBeTruthy();
//     }),
//     { numRuns: 100 },
//   );
// });
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// TODO: Property 10 — Not-found fallback (sub-task 6.8)
//
// For any render where location.state is null, undefined, or lacks a valid
// notification, the page renders "Notification not found" without throwing.
//
// Validates: Requirements 5.3
//
// it('Property 10: not-found fallback for any invalid state', async () => {
//   await fc.assert(
//     fc.asyncProperty(
//       fc.oneof(fc.constant(null), fc.constant(undefined), fc.record({ other: fc.string() })),
//       async (badState) => {
//         cleanup();
//         const { default: NotificationDetailPage } = await import('@/pages/NotificationDetailPage');
//         render(
//           <MemoryRouter initialEntries={[{ pathname: '/notifications/any-id', state: badState }]}>
//             <Routes>
//               <Route path="/notifications/:id" element={<NotificationDetailPage />} />
//             </Routes>
//           </MemoryRouter>,
//         );
//         expect(screen.getByText('Notification not found')).toBeTruthy();
//       },
//     ),
//     { numRuns: 50 },
//   );
// });
// ---------------------------------------------------------------------------
