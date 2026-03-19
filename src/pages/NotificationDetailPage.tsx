import { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Layout } from '@/shared/components/layout/Layout';
import type { Notification } from '@/features/notifications/types';
import {
  TYPE_CONFIG,
  formatRelativeTime,
  formatExactDateTime,
} from '@/features/notifications/constants/type-config';

// ─── Not Found State ──────────────────────────────────────────────────────────

function NotificationNotFound() {
  const navigate = useNavigate();
  return (
    <Layout>
      <div
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          padding: '32px 16px',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 18,
            background: '#f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AlertCircle size={28} color="#94a3b8" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Notification not found
        </h2>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0, textAlign: 'center' }}>
          This notification may have been removed or the link is invalid.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          aria-label="Go back to dashboard"
          style={{
            marginTop: 8,
            padding: '10px 24px',
            background: '#085299',
            color: '#ffffff',
            border: 'none',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#063d73'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#085299'; }}
        >
          Go to Dashboard
        </button>
      </div>
    </Layout>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function NotificationDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const stateNotification = (location.state as { notification?: Notification } | null)?.notification;

  // Mark as read on mount
  const [notification, setNotification] = useState<Notification | null>(() => {
    if (!stateNotification) return null;
    if (stateNotification.id !== id) return null;
    return { ...stateNotification, read: true };
  });

  useEffect(() => {
    if (notification && !notification.read) {
      setNotification(prev => prev ? { ...prev, read: true } : prev);
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  if (!notification) {
    return <NotificationNotFound />;
  }

  const cfg = TYPE_CONFIG[notification.type] ?? TYPE_CONFIG.system;
  const Icon = cfg.icon;

  return (
    <Layout>
      <div
        style={{
          maxWidth: 720,
          margin: '0 auto',
          padding: '24px 16px 48px',
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
            padding: '8px 16px',
            background: 'transparent',
            border: '1.5px solid #e2e8f0',
            borderRadius: 10,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            color: '#475569',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#f8fafc';
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.color = '#0f172a';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.color = '#475569';
          }}
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* Hero Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0b1a35 0%, #0e2147 100%)',
            borderRadius: 20,
            padding: '36px 32px',
            marginBottom: 20,
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
          }}
        >
          {/* Decorative glow */}
          <div
            style={{
              position: 'absolute',
              top: -40,
              right: -40,
              width: 180,
              height: 180,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${cfg.accentColor}22 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${cfg.accentColor}18 0%, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: cfg.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: `0 8px 24px ${cfg.dot}44`,
              position: 'relative',
            }}
          >
            <Icon size={28} color="#ffffff" strokeWidth={2} />
          </div>

          {/* Type Badge */}
          <div
            style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: 20,
              background: `${cfg.accentColor}22`,
              border: `1px solid ${cfg.accentColor}44`,
              color: cfg.accentColor,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              marginBottom: 12,
            }}
          >
            {cfg.label}
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 10px',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
            }}
          >
            {notification.title}
          </h1>

          {/* Timestamp */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Clock size={12} color="rgba(255,255,255,0.45)" />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}>
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>
        </div>

        {/* Content Card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 18,
            border: '1px solid #e8edf5',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            padding: '28px 28px',
            marginBottom: 16,
          }}
        >
          {/* Message */}
          <p
            style={{
              fontSize: 15,
              color: '#1e293b',
              lineHeight: 1.7,
              margin: '0 0 24px',
            }}
          >
            {notification.message}
          </p>

          {/* Divider */}
          <div style={{ height: 1, background: '#f1f5f9', marginBottom: 20 }} />

          {/* Metadata */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Type */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Type
              </span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: cfg.accentColor,
                  background: `${cfg.accentColor}14`,
                  padding: '3px 10px',
                  borderRadius: 6,
                }}
              >
                {cfg.label}
              </span>
            </div>

            {/* Date & Time */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Date & Time
              </span>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#334155' }}>
                {formatExactDateTime(notification.createdAt)}
              </span>
            </div>

            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Status
              </span>
              {notification.read ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748b',
                    background: '#f1f5f9',
                    padding: '3px 10px',
                    borderRadius: 6,
                  }}
                >
                  <CheckCircle size={12} />
                  Read
                </span>
              ) : (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 12,
                    fontWeight: 700,
                    color: cfg.accentColor,
                    background: `${cfg.accentColor}14`,
                    padding: '3px 10px',
                    borderRadius: 6,
                  }}
                >
                  <div
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: cfg.accentColor,
                    }}
                  />
                  Unread
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contextual Action */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 18,
            border: '1px solid #e8edf5',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', margin: '0 0 2px' }}>
              Take action
            </p>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
              Navigate to the relevant section for more details.
            </p>
          </div>
          <button
            onClick={() => navigate(cfg.actionPath)}
            aria-label={cfg.actionLabel}
            style={{
              padding: '10px 22px',
              background: '#085299',
              color: '#ffffff',
              border: 'none',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#063d73'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#085299'; }}
          >
            {cfg.actionLabel}
          </button>
        </div>
      </div>
    </Layout>
  );
}
