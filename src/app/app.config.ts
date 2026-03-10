import { ApplicationConfig, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

import { AuthEffects } from './state/auth/auth.effects';
import { WorkspaceEffects } from './state/workspace/workspace.effects';
import { ProjectEffects } from './state/project/project.effects';
import { CommentEffects } from './state/comment/comment.effects';
import { NotificationEffects } from './state/notification/notification.effects';
import { CalendarEffects } from './state/calendar/calendar.effects';
import { authReducer } from './state/auth/auth.reducer';
import { workspaceReducer } from './state/workspace/workspace.reducer';
import { projectReducer } from './state/project/project.reducer';
import { fileReducer } from './state/file/file.reducer';
import { commentReducer } from './state/comment/comment.reducer';
import { calendarReducer } from './state/calendar/calendar.reducer';
import { notificationReducer } from './state/notification/notification.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor, errorInterceptor])
    ),
    provideAnimationsAsync(),
    provideStore({
      auth: authReducer,
      workspace: workspaceReducer,
      project: projectReducer,
      file: fileReducer,
      comment: commentReducer,
      calendar: calendarReducer,
      notification: notificationReducer
    }),
    provideEffects([AuthEffects, WorkspaceEffects, ProjectEffects, CommentEffects, NotificationEffects, CalendarEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
