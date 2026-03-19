// ─── Notification Types ───────────────────────────────────────────────────────

export type NotificationType = 'nominee' | 'payment' | 'voting' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  createdAt: string; // ISO 8601
}
