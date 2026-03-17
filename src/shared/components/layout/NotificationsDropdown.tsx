import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, UserPlus, CreditCard, Vote, AlertCircle } from 'lucide-react';

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
    time: '5 minutes ago',
    read: false,
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of ETB 50 received from Jane Smith',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'voting',
    title: 'Voting Period Started',
    message: 'Public voting is now open for all categories',
    time: '2 hours ago',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'System Update',
    message: 'Platform maintenance scheduled for tonight at 11 PM',
    time: '3 hours ago',
    read: true,
  },
];

const typeConfig = {
  nominee: { icon: UserPlus, bg: '#eff6ff', color: '#2563eb' },
  payment:  { icon: CreditCard, bg: '#f0fdf4', color: '#16a34a' },
  voting:   { icon: Vote,       bg: '#faf5ff', color: '#9333ea' },
  system:   { icon: AlertCircle, bg: '#fff7ed', color: '#ea580c' },
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

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
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
        width: 380,
        background: '#ffffff',
        borderRadius: 16,
        boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
        border: '1px solid #f1f5f9',
        zIndex: 50,
        overflow: 'hidden',
        animation: 'notifSlideIn 0.18s ease-out',
      }}
    >
      <style>{`
        @keyframes notifSlideIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid #f1f5f9',
        background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #085299 0%, #1a6bc4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Bell size={16} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
              Notifications
            </div>
            {unreadCount > 0 && (
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>
                {unreadCount} unread
              </div>
            )}
          </div>
          {unreadCount > 0 && (
            <span style={{
              padding: '2px 8px',
              background: '#085299',
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 20,
              marginLeft: 2,
            }}>
              {unreadCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <X size={16} />
        </button>
      </div>

      {/* List */}
      <div style={{ maxHeight: 360, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Bell size={36} color="#cbd5e1" style={{ margin: '0 auto 10px' }} />
            <p style={{ color: '#94a3b8', fontSize: 13 }}>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n, idx) => {
            const cfg = typeConfig[n.type];
            const Icon = cfg.icon;
            const isHovered = hoveredId === n.id;
            return (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                onMouseEnter={() => setHoveredId(n.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '14px 20px',
                  cursor: 'pointer',
                  background: isHovered
                    ? '#f8fafc'
                    : !n.read
                    ? '#fafcff'
                    : '#ffffff',
                  borderBottom: idx < notifications.length - 1 ? '1px solid #f8fafc' : 'none',
                  transition: 'background 0.15s',
                  position: 'relative',
                }}
              >
                {/* Unread left bar */}
                {!n.read && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background: 'linear-gradient(180deg, #085299, #1a6bc4)',
                    borderRadius: '0 2px 2px 0',
                  }} />
                )}

                {/* Icon badge */}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: cfg.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 1,
                }}>
                  <Icon size={17} color={cfg.color} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 3,
                  }}>
                    <span style={{
                      fontSize: 13,
                      fontWeight: n.read ? 500 : 600,
                      color: '#0f172a',
                      lineHeight: 1.3,
                    }}>
                      {n.title}
                    </span>
                    {!n.read && (
                      <div style={{
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: '#085299',
                        flexShrink: 0,
                        marginLeft: 8,
                      }} />
                    )}
                  </div>
                  <p style={{
                    fontSize: 12,
                    color: '#64748b',
                    lineHeight: 1.5,
                    margin: '0 0 6px',
                  }}>
                    {n.message}
                  </p>
                  <span style={{
                    fontSize: 11,
                    color: '#94a3b8',
                    fontWeight: 500,
                  }}>
                    {n.time}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {unreadCount > 0 && (
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #f1f5f9',
          background: '#fafafa',
        }}>
          <button
            onClick={markAllAsRead}
            style={{
              width: '100%',
              padding: '9px 0',
              background: 'transparent',
              border: '1px solid #e2e8f0',
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
        </div>
      )}
    </div>
  );
}
