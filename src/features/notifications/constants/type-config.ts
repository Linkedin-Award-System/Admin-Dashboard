import { UserPlus, CreditCard, Vote, AlertCircle } from 'lucide-react';
import type { NotificationType } from '../types';

// ─── Type Config ──────────────────────────────────────────────────────────────

export const TYPE_CONFIG: Record<
  NotificationType,
  {
    icon: React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
    iconBg: string;
    dot: string;
    label: string;
    accentColor: string;
    actionLabel: string;
    actionPath: string;
  }
> = {
  nominee: {
    icon: UserPlus,
    iconBg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    dot: '#2563eb',
    label: 'NOMINEE',
    accentColor: '#2563eb',
    actionLabel: 'View Nominees',
    actionPath: '/nominees',
  },
  payment: {
    icon: CreditCard,
    iconBg: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    dot: '#16a34a',
    label: 'PAYMENT',
    accentColor: '#16a34a',
    actionLabel: 'View Payments',
    actionPath: '/payments',
  },
  voting: {
    icon: Vote,
    iconBg: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
    dot: '#9333ea',
    label: 'VOTING',
    accentColor: '#9333ea',
    actionLabel: 'View Voting',
    actionPath: '/voting',
  },
  system: {
    icon: AlertCircle,
    iconBg: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
    dot: '#ea580c',
    label: 'SYSTEM',
    accentColor: '#ea580c',
    actionLabel: 'Go to Dashboard',
    actionPath: '/dashboard',
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatRelativeTime(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(iso).toLocaleDateString();
  } catch {
    return '';
  }
}

export function formatExactDateTime(iso: string): string {
  try {
    const date = new Date(iso);
    if (isNaN(date.getTime())) return 'Unknown date';
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return 'Unknown date';
  }
}
