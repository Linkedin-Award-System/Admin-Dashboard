import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X, Check, Clock, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client-instance';
import type { Notification } from '@/features/notifications/types';
import { TYPE_CONFIG, formatRelativeTime } from '@/features/notifications/constants/type-config';

// Raw shapes returned by the API (after apiClient strips the outer `data` wrapper)
interface RawPayment {
  id: string;
  txRef?: string;
  amount?: number;
  currency?: string;
  status?: string;
  createdAt?: string;
}

interface RawVote {
  id: string;
  quantity?: number;
  type?: string;
  createdAt?: string;
}

interface RawNominee {
  id: string;
  fullName?: string;
  createdAt?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeArray<T>(raw: unknown, ...keys: string[]): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    for (const k of keys) {
      if (Array.isArray(obj[k])) return obj[k] as T[];
    }
    // Handle nested { data: { payments/votes/nominees: [...] } }
    if (obj['data'] && typeof obj['data'] === 'object' && !Array.isArray(obj['data'])) {
      const inner = obj['data'] as Record<string, unknown>;
      for (const k of keys) {
        if (Array.isArray(inner[k])) return inner[k] as T[];
      }
      if (Array.isArray(inner['data'])) return inner['data'] as T[];
    }
  }
  return [];
}

function buildNotificationsFromData(
  payments: RawPayment[],
  votes: RawVote[],
  nominees: RawNominee[],
): Notification[] {
  const items: Notification[] = [];

  // Recent payments → payment notifications (last 10)
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 10);

  for (const p of recentPayments) {
    const status = (p.status ?? '').toUpperCase();
    const amount = p.amount != null ? `${p.amount} ${p.currency ?? 'ETB'}` : '';
    const statusLabel =
      status === 'COMPLETED' || status === 'SUCCESS' || status === 'PAID' ? 'completed' :
      status === 'FAILED' || status === 'DECLINED' || status === 'ERROR' ? 'failed' :
      status === 'REFUNDED' || status === 'REVERSED' ? 'refunded' : 'pending';

    items.push({
      id: `payment-${p.id}`,
      type: 'payment',
      title: `Payment ${statusLabel}`,
      message: amount
        ? `Transaction of ${amount} is ${statusLabel}.`
        : `Transaction ${p.txRef ?? p.id} is ${statusLabel}.`,
      time: formatRelativeTime(p.createdAt ?? ''),
      createdAt: p.createdAt ?? '',
      read: false,
    });
  }

  // Recent votes → voting notifications (last 5, grouped loosely)
  const recentVotes = [...votes]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 5);

  for (const v of recentVotes) {
    const qty = v.quantity ?? 1;
    const voteType = (v.type ?? '').toUpperCase() === 'PREMIUM' ? 'premium' : 'free';
    items.push({
      id: `vote-${v.id}`,
      type: 'voting',
      title: 'New votes cast',
      message: `${qty} ${voteType} vote${qty !== 1 ? 's' : ''} were recorded.`,
      time: formatRelativeTime(v.createdAt ?? ''),
      createdAt: v.createdAt ?? '',
      read: false,
    });
  }

  // Recent nominees → nominee notifications (last 5)
  const recentNominees = [...nominees]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 5);

  for (const n of recentNominees) {
    items.push({
      id: `nominee-${n.id}`,
      type: 'nominee',
      title: 'New nominee added',
      message: n.fullName ? `${n.fullName} was added as a nominee.` : 'A new nominee was added.',
      time: formatRelativeTime(n.createdAt ?? ''),
      createdAt: n.createdAt ?? '',
      read: false,
    });
  }

  // Sort all by newest first, cap at 20
  return items
    .filter(i => i.createdAt)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 20);
}

// ─── Component ────────────────────────────────────────────────────────────────

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch payments, votes, and nominees in parallel — all errors are caught below
      const [paymentsRaw, votesRaw, nomineesRaw] = await Promise.allSettled([
        apiClient.get<unknown>('/admin/payments', { params: { limit: 20, page: 1 } }),
        apiClient.get<unknown>('/admin/votes', { params: { limit: 20, page: 1 } }),
        apiClient.get<unknown>('/admin/nominees', { params: { limit: 20 } }),
      ]);

      const payments = paymentsRaw.status === 'fulfilled'
        ? safeArray<RawPayment>(paymentsRaw.value, 'payments', 'data', 'items', 'results')
        : [];
      const votes = votesRaw.status === 'fulfilled'
        ? safeArray<RawVote>(votesRaw.value, 'votes', 'data', 'items', 'results')
        : [];
      const nominees = nomineesRaw.status === 'fulfilled'
        ? safeArray<RawNominee>(nomineesRaw.value, 'nominees', 'data', 'items', 'results')
        : [];

      const built = buildNotificationsFromData(payments, votes, nominees);
      setNotifications(built);
    } catch {
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when dropdown opens
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    fetchNotifications().catch(() => {
      if (!cancelled) setError('Failed to load notifications');
    });

    return () => { cancelled = true; };
  }, [isOpen, fetchNotifications]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  // Mark as read — local only (no backend endpoint)
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Delete — local only
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 10px)',
        width: 400,
        background: '#ffffff',
        borderRadius: 20,
        boxShadow: '0 24px 64px rgba(0,0,0,0.14), 0 4px 20px rgba(0,0,0,0.07)',
        border: '1px solid #e8edf5',
        zIndex: 50,
        overflow: 'hidden',
        animation: 'notifSlideIn 0.18s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <style>{`
        @keyframes notifSlideIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .notif-item:hover { background: #f8fafc !important; }
        .notif-delete-btn { opacity: 0; transition: opacity 0.15s; }
        .notif-item:hover .notif-delete-btn { opacity: 1; }
      `}</style>

      {/* Header */}
      <div style={{
        padding: '18px 20px 14px',
        background: 'linear-gradient(135deg, #0b1a35 0%, #0e2147 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 11,
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(37,99,235,0.5)',
              flexShrink: 0,
            }}>
              <Bell size={17} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                Notifications
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 2, fontWeight: 500 }}>
                {loading ? 'Loading…' : unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {unreadCount > 0 && (
              <span style={{
                padding: '3px 10px',
                background: 'rgba(37,99,235,0.9)',
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 20,
                border: '1px solid rgba(96,165,250,0.3)',
                letterSpacing: '0.02em',
              }}>
                {unreadCount} new
              </span>
            )}
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: 8, border: 'none',
                background: 'rgba(255,255,255,0.08)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.5)',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: 14 }}>Loading notifications…</p>
          </div>
        ) : error ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: 14, fontWeight: 600 }}>{error}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
            }}>
              <Bell size={24} color="#cbd5e1" />
            </div>
            <p style={{ color: '#64748b', fontSize: 14, fontWeight: 600 }}>No notifications yet</p>
            <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>You're all caught up!</p>
          </div>
        ) : (
          notifications.map((n, idx) => {
            const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
            const Icon = cfg.icon;

            return (
              <div
                key={n.id}
                className="notif-item"
                onClick={() => {
                  markAsRead(n.id);
                  onClose();
                  navigate(`/notifications/${n.id}`, { state: { notification: n } });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 13,
                  padding: '14px 20px',
                  cursor: 'pointer',
                  background: !n.read ? '#fafcff' : '#ffffff',
                  borderBottom: idx < notifications.length - 1 ? '1px solid #f1f5f9' : 'none',
                  transition: 'background 0.15s',
                  position: 'relative',
                }}
              >
                {!n.read && (
                  <div style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: 3,
                    background: `linear-gradient(180deg, ${cfg.dot}, ${cfg.dot}88)`,
                    borderRadius: '0 2px 2px 0',
                  }} />
                )}

                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: cfg.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 12px ${cfg.dot}33`,
                  marginTop: 1,
                }}>
                  <Icon size={17} color="#ffffff" strokeWidth={2} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                    <span style={{
                      fontSize: 13,
                      fontWeight: n.read ? 500 : 700,
                      color: '#0f172a',
                      lineHeight: 1.3,
                      flex: 1,
                    }}>
                      {n.title}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {!n.read && (
                        <div style={{
                          width: 8, height: 8, borderRadius: '50%',
                          background: cfg.dot,
                          boxShadow: `0 0 6px ${cfg.dot}88`,
                        }} />
                      )}
                      <button
                        className="notif-delete-btn"
                        onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                        style={{
                          width: 22, height: 22, borderRadius: 6, border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#94a3b8',
                          padding: 0,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = '#fef2f2'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; }}
                        aria-label="Delete notification"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.55, margin: '0 0 7px' }}>
                    {n.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Clock size={10} color="#94a3b8" />
                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{n.time}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid #f1f5f9',
        background: '#fafafa',
        display: 'flex',
        gap: 8,
      }}>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              flex: 1,
              padding: '9px 0',
              background: 'transparent',
              border: '1.5px solid #e2e8f0',
              borderRadius: 10,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: '#085299',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#085299'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <Check size={13} />
            Mark all as read
          </button>
        )}
        <button
          onClick={onClose}
          style={{
            flex: unreadCount > 0 ? 'none' : 1,
            padding: '9px 16px',
            background: 'transparent',
            border: '1.5px solid #e2e8f0',
            borderRadius: 10,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 600,
            color: '#64748b',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
