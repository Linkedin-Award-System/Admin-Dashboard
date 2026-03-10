import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WorkspaceState, adapter as workspaceAdapter } from './workspace/workspace.reducer';
import { ProjectState, adapter as projectAdapter } from './project/project.reducer';
import { FileState, adapter as fileAdapter } from './file/file.reducer';
import { CommentState, adapter as commentAdapter } from './comment/comment.reducer';
import { CalendarState, adapter as calendarAdapter } from './calendar/calendar.reducer';
import { NotificationState, adapter as notificationAdapter } from './notification/notification.reducer';

// Workspace Selectors
export const selectWorkspaceState = createFeatureSelector<WorkspaceState>('workspace');
const { selectAll: selectAllWorkspaces, selectEntities: selectWorkspaceEntities } = workspaceAdapter.getSelectors(selectWorkspaceState);
export { selectAllWorkspaces, selectWorkspaceEntities };

export const selectSelectedWorkspaceId = createSelector(selectWorkspaceState, (state) => state.selectedId);
export const selectSelectedWorkspace = createSelector(
  selectWorkspaceEntities,
  selectSelectedWorkspaceId,
  (entities, id) => id ? entities[id] : null
);

export const selectIsLoading = createSelector(selectWorkspaceState, (state) => state.isLoading);

// Project Selectors
export const selectProjectState = createFeatureSelector<ProjectState>('project');
const { selectAll: selectAllProjects } = projectAdapter.getSelectors(selectProjectState);
export { selectAllProjects };

// File Selectors
export const selectFileState = createFeatureSelector<FileState>('file');
const { selectAll: selectAllFiles } = fileAdapter.getSelectors(selectFileState);
export { selectAllFiles };

// Comment Selectors
export const selectCommentState = createFeatureSelector<CommentState>('comment');
const { selectAll: selectAllComments } = commentAdapter.getSelectors(selectCommentState);
export { selectAllComments };

// Calendar Selectors
export const selectCalendarState = createFeatureSelector<CalendarState>('calendar');
const { selectAll: selectAllCalendarEvents } = calendarAdapter.getSelectors(selectCalendarState);
export { selectAllCalendarEvents };

// Notification Selectors
export const selectNotificationState = createFeatureSelector<NotificationState>('notification');
const { selectAll: selectAllNotifications } = notificationAdapter.getSelectors(selectNotificationState);
export { selectAllNotifications };
export const selectUnreadNotificationCount = createSelector(selectNotificationState, (state) => state.unreadCount);
