import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent)
      },
      {
        path: 'password-reset',
        loadComponent: () => import('./features/auth/password-reset/password-reset').then(m => m.PasswordResetComponent)
      }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'workspaces',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/workspace/workspace-list/workspace-list').then(m => m.WorkspaceListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/workspace/workspace-detail/workspace-detail').then(m => m.WorkspaceDetailComponent)
          }
        ]
      },
      {
        path: 'projects/:id',
        loadComponent: () => import('./features/project/project-detail/project-detail').then(m => m.ProjectDetailComponent)
      },
      {
        path: 'calendar',
        loadComponent: () => import('./features/calendar/calendar-view/calendar-view').then(m => m.CalendarViewComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
