import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Notification, NotificationActions } from './notification.actions';

export interface NotificationState extends EntityState<Notification> {
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
}

export const adapter: EntityAdapter<Notification> = createEntityAdapter<Notification>({
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt)
});

export const initialState: NotificationState = adapter.getInitialState({
  isLoading: false,
  error: null,
  unreadCount: 0
});

export const notificationReducer = createReducer(
  initialState,
  on(NotificationActions.loadNotifications, (state) => ({ ...state, isLoading: true })),
  on(NotificationActions.loadNotificationsSuccess, (state, { notifications }) => {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    return adapter.setAll(notifications, { ...state, unreadCount, isLoading: false });
  }),
  on(NotificationActions.loadNotificationsFailure, (state, { error }) => 
    ({ ...state, error, isLoading: false })),
    
  on(NotificationActions.markAsRead, (state, { id }) => {
    const notification = state.entities[id];
    if (notification && !notification.isRead) {
      return adapter.updateOne({ id, changes: { isRead: true } }, {
        ...state,
        unreadCount: Math.max(0, state.unreadCount - 1)
      });
    }
    return state;
  }),
  
  on(NotificationActions.markAllAsRead, (state) => {
    const updates = state.ids.map(id => ({
      id: id as string,
      changes: { isRead: true }
    }));
    return adapter.updateMany(updates, { ...state, unreadCount: 0 });
  }),
  
  on(NotificationActions.receiveRealtimeNotification, (state, { notification }) => {
    return adapter.addOne(notification, {
      ...state,
      unreadCount: state.unreadCount + 1
    });
  }),
  
  on(NotificationActions.deleteNotificationSuccess, (state, { id }) => {
    const notification = state.entities[id];
    const unreadCount = notification && !notification.isRead ? state.unreadCount - 1 : state.unreadCount;
    return adapter.removeOne(id, { ...state, unreadCount: Math.max(0, unreadCount) });
  })
);
