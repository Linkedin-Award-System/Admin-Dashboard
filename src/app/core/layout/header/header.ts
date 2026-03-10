import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService, User } from '../../services/auth.service';
import { selectUnreadNotificationCount } from '../../../state/app.selectors';
import { NotificationListComponent } from '../../../features/notifications/notification-list/notification-list';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatBadgeModule, MatMenuModule, NotificationListComponent],
  template: `
    <mat-toolbar color="primary" class="app-header">
      <button mat-icon-button (click)="toggleSidebar.emit()">
        <mat-icon>menu</mat-icon>
      </button>
      
      <span class="brand">CreatorFlow</span>
      
      <span class="spacer"></span>
      
      <div class="header-actions" *ngIf="user$ | async as user">
        <button mat-icon-button [matMenuTriggerFor]="notifMenu">
          <mat-icon [matBadge]="unreadCount$ | async" matBadgeColor="warn" [matBadgeHidden]="(unreadCount$ | async) === 0">
            notifications
          </mat-icon>
        </button>
        <mat-menu #notifMenu="matMenu" class="notification-menu">
          <app-notification-list></app-notification-list>
        </mat-menu>

        <button mat-button [matMenuTriggerFor]="userMenu" class="user-profile">
          <div class="avatar">{{ user.name[0] | uppercase }}</div>
          <span class="username">{{ user.name }}</span>
          <mat-icon>expand_more</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>My Profile</span>
          </button>
          <button mat-menu-item>
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="onLogout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: `
    .app-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .brand {
      font-weight: 700;
      font-size: 22px;
      letter-spacing: 0.5px;
      margin-left: 10px;
    }
    .spacer {
      flex: 1 1 auto;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .user-profile {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .avatar {
      width: 32px;
      height: 32px;
      background-color: #ff4081;
      color: white;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 14px;
    }
    .username {
      margin: 0 5px;
      font-weight: 500;
    }
    .notification-menu {
      max-width: none !important;
      padding: 0;
    }
  `
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  
  user$: Observable<User | null>;
  unreadCount$: Observable<number>;

  constructor(private authService: AuthService, private store: Store) {
    this.user$ = this.authService.currentUser$;
    this.unreadCount$ = this.store.select(selectUnreadNotificationCount);
  }

  ngOnInit(): void {}

  onLogout(): void {
    this.authService.logout();
  }
}
