import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export interface Notification {
  id: string;
  userId: string;
  type: 'mention' | 'comment' | 'invite' | 'system';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export const NotificationActions = createActionGroup({
  source: 'Notification',
  events: {
    'Load Notifications': emptyProps(),
    'Load Notifications Success': props<{ notifications: Notification[] }>(),
    'Load Notifications Failure': props<{ error: string }>(),
    
    'Mark As Read': props<{ id: string }>(),
    'Mark All As Read': emptyProps(),
    
    'Receive Realtime Notification': props<{ notification: Notification }>(),
    
    'Delete Notification': props<{ id: string }>(),
    'Delete Notification Success': props<{ id: string }>(),
  }
});
