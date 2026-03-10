import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface Activity {
  id: string;
  type: 'file_upload' | 'comment' | 'project_created' | 'status_change';
  user: string;
  message: string;
  timestamp: string;
}

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatButtonModule],
  template: `
    <div class="activity-feed">
      <h3>Recent Activity</h3>
      <mat-list>
        <mat-list-item *ngFor="let activity of activities">
          <mat-icon matListItemIcon [style.color]="getActivityColor(activity.type)">
            {{ getActivityIcon(activity.type) }}
          </mat-icon>
          <div matListItemTitle>{{ activity.user }} {{ activity.message }}</div>
          <div matListItemLine class="timestamp">{{ activity.timestamp }}</div>
        </mat-list-item>
      </mat-list>
      <button mat-button color="primary" class="view-all">View All Activity</button>
    </div>
  `,
  styles: `
    .activity-feed {
      padding: 10px;
    }
    .timestamp {
      font-size: 12px;
      color: gray;
    }
    .view-all {
      width: 100%;
      margin-top: 10px;
    }
  `
})
export class ActivityFeedComponent {
  @Input() activities: Activity[] = [
    { id: '1', type: 'file_upload', user: 'Abebe', message: 'uploaded a new video "Commercial_v1.mp4"', timestamp: '2 hours ago' },
    { id: '2', type: 'comment', user: 'Sara', message: 'commented on "Project Alpha"', timestamp: '3 hours ago' },
    { id: '3', type: 'project_created', user: 'Kebede', message: 'created a new project "Summer Campaign"', timestamp: '5 hours ago' },
    { id: '4', type: 'status_change', user: 'System', message: 'changed status of "Project X" to Completed', timestamp: '1 day ago' }
  ];

  getActivityIcon(type: string): string {
    switch (type) {
      case 'file_upload': return 'cloud_upload';
      case 'comment': return 'comment';
      case 'project_created': return 'add_circle';
      case 'status_change': return 'check_circle';
      default: return 'info';
    }
  }

  getActivityColor(type: string): string {
    switch (type) {
      case 'file_upload': return '#2196f3';
      case 'comment': return '#4caf50';
      case 'project_created': return '#ff9800';
      case 'status_change': return '#9c27b0';
      default: return '#757575';
    }
  }
}
