import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService, User } from '../../../core/services/auth.service';
import { StatCardComponent } from '../stat-card/stat-card';
import { ActivityFeedComponent } from '../activity-feed/activity-feed';
import { DeadlinesWidgetComponent } from '../deadlines-widget/deadlines-widget';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatGridListModule, 
    MatIconModule,
    MatDividerModule,
    StatCardComponent,
    ActivityFeedComponent,
    DeadlinesWidgetComponent
  ],
  template: `
    <div class="dashboard-wrapper">
      <header class="dashboard-header">
        <div class="welcome-text">
          <h1>Welcome back, {{ user?.name }}!</h1>
          <p>Here's what's happening with your projects today.</p>
        </div>
        <div class="quick-actions">
          <button mat-raised-button color="primary">
            <mat-icon>add</mat-icon>
            Create Project
          </button>
          <button mat-stroked-button color="accent">
            <mat-icon>cloud_upload</mat-icon>
            Upload File
          </button>
        </div>
      </header>

      <div class="stats-grid">
        <app-stat-card title="Total Projects" value="12" icon="folder" color="#3f51b5" [trend]="15"></app-stat-card>
        <app-stat-card title="Shared Files" value="84" icon="insert_drive_file" color="#2196f3" [trend]="8"></app-stat-card>
        <app-stat-card title="Team Members" value="5" icon="people" color="#4caf50" [trend]="20"></app-stat-card>
        <app-stat-card title="Storage Used" value="4.2 GB" icon="storage" color="#ff9800" [trend]="-5"></app-stat-card>
      </div>

      <div class="dashboard-content">
        <div class="main-column">
          <mat-card class="content-card">
            <app-activity-feed></app-activity-feed>
          </mat-card>
        </div>
        <div class="side-column">
          <mat-card class="content-card">
            <app-deadlines-widget></app-deadlines-widget>
          </mat-card>
          
          <mat-card class="storage-card">
            <mat-card-header>
              <mat-card-title>Storage Capacity</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="storage-info">
                <span>4.2 GB of 5 GB used</span>
                <div class="progress-bar">
                  <div class="progress" style="width: 84%"></div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: `
    .dashboard-wrapper {
      padding: 30px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .welcome-text h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .welcome-text p {
      color: #757575;
      margin: 5px 0 0 0;
    }
    .quick-actions button {
      margin-left: 10px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .dashboard-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 30px;
    }
    .content-card {
      height: 100%;
    }
    .storage-card {
      margin-top: 20px;
    }
    .storage-info {
       padding: 10px 0;
    }
    .progress-bar {
      height: 10px;
      background-color: #e0e0e0;
      border-radius: 5px;
      margin-top: 10px;
      overflow: hidden;
    }
    .progress {
      height: 100%;
      background-color: #f44336;
      border-radius: 5px;
    }
    @media (max-width: 960px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
    }
  `
})
export class DashboardComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }
}
