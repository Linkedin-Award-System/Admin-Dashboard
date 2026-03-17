import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, UserPlus, CreditCard, Vote, AlertCircle, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'nominee' | 'payment' | 'voting' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'nominee',
    title: 'New Nominee Submission',
    message: 'John Doe submitted a nomination for Content Creation category',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of ETB 50 received from Jane Smith',
    time: '1 hr ago',
    read: false,
  },
  {
    id: '3',
    type: 'voting',
    title: 'Voting Period Started',
    message: 'Public voting is now open for all categories',
    time: '2 hrs ago',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'System Update',
    message: 'Platform maintenance scheduled for tonight at 11 PM',
    time: '3 hrs ago',
    read: true,
  },
];

const TYPE_CONFIG = {
  nominee: {
    icon: UserPlus,
    iconBg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    dot: '#2563eb',
    label: 'Nominee',
  },
  payment: {
    icon: CreditCard,
    iconBg: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    dot: '#16a34a',
    label: 'Payment',
  },
  voting: {
    icon: Vote,
    iconBg: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
    dot: '#9333ea',
    label: 'Voting',
  },
  system: {
    icon: AlertCircle,
    iconBg: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
    dot: '#ea580c',
    label: 'System',
  },
};

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const markAsRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const markAllAsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

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
      `}</style>

      {/* Header */}
      <div style={{
        padding: '18px 20px 14px',
        background: 'linear-gradient(135deg, #0b1a35 0%, #0e2147 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Ambient glow */}
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
                {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
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
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.16)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Notification list */}
      <div style={{ maxHeight: 380, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
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
            const cfg = TYPE_CONFIG[n.type];
            const Icon = cfg.icon;
            const isHovered = hoveredId === n.id;

            return (
              <div
                key={n.id}
                className="notif-item"
                onClick={() => markAsRead(n.id)}
                onMouseEnter={() => setHoveredId(n.id)}
                onMouseLeave={() => setHoveredId(null)}
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
                {/* Unread accent bar */}
                {!n.read && (
                  <div style={{
                    position: 'absolute',
                    left: 0, top: 0, bottom: 0,
                    width: 3,
                    background: `linear-gradient(180deg, ${cfg.dot}, ${cfg.dot}88)`,
                    borderRadius: '0 2px 2px 0',
                  }} />
                )}

                {/* Icon */}
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                  background: cfg.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 12px ${cfg.dot}33`,
                  marginTop: 1,
                }}>
                  <Icon size={17} color="#ffffff" strokeWidth={2} />
                </div>

                {/* Content */}
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
                    {!n.read && (
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: cfg.dot,
                        flexShrink: 0,
                        marginTop: 3,
                        boxShadow: `0 0 6px ${cfg.dot}88`,
                      }} />
                    )}
                  </div>
                  <p style={{
                    fontSize: 12,
                    color: '#64748b',
                    lineHeight: 1.55,
                    margin: '0 0 7px',
                  }}>
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
            onMouseEnter={e => {
              e.currentTarget.style.background = '#eff6ff';
              e.currentTarget.style.borderColor = '#085299';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
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
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f1f5f9';
            e.currentTarget.style.borderColor = '#cbd5e1';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#e2e8f0';
          }}
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
