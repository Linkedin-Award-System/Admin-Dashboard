import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatDividerModule],
  template: `
    <div class="sidebar-content">
      <mat-nav-list>
        <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
        </a>
        <a mat-list-item routerLink="/workspaces" routerLinkActive="active-link">
          <mat-icon matListItemIcon>business</mat-icon>
          <span matListItemTitle>Workspaces</span>
        </a>
        <a mat-list-item routerLink="/calendar" routerLinkActive="active-link">
          <mat-icon matListItemIcon>calendar_today</mat-icon>
          <span matListItemTitle>Calendar</span>
        </a>
      </mat-nav-list>
      
      <mat-divider></mat-divider>
      
      <div class="sidebar-section">
        <h3>Quick Access</h3>
        <mat-nav-list>
          <a mat-list-item>
            <mat-icon matListItemIcon>star</mat-icon>
            <span matListItemTitle>Favorites</span>
          </a>
          <a mat-list-item>
            <mat-icon matListItemIcon>access_time</mat-icon>
            <span matListItemTitle>Recent</span>
          </a>
        </mat-nav-list>
      </div>
      
      <div class="spacer"></div>
      
      <mat-divider></mat-divider>
      
      <mat-nav-list>
        <a mat-list-item routerLink="/settings" routerLinkActive="active-link">
          <mat-icon matListItemIcon>settings</mat-icon>
          <span matListItemTitle>Settings</span>
        </a>
        <a mat-list-item routerLink="/help" routerLinkActive="active-link">
          <mat-icon matListItemIcon>help_outline</mat-icon>
          <span matListItemTitle>Help & Support</span>
        </a>
      </mat-nav-list>
    </div>
  `,
  styles: `
    .sidebar-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 10px 0;
    }
    .active-link {
      background-color: #e8eaf6 !important;
      color: #3f51b5 !important;
    }
    .sidebar-section {
      padding: 15px 20px;
    }
    .sidebar-section h3 {
      font-size: 12px;
      text-transform: uppercase;
      color: #757575;
      margin-bottom: 10px;
      letter-spacing: 0.5px;
    }
    .spacer {
      flex: 1;
    }
  `
})
export class SidebarComponent {}
