import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

export interface Deadline {
  id: string;
  title: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
}

@Component({
  selector: 'app-deadlines-widget',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MatChipsModule],
  template: `
    <div class="deadlines-widget">
      <h3>Upcoming Deadlines</h3>
      <mat-list>
        <mat-list-item *ngFor="let deadline of deadlines">
          <mat-icon matListItemIcon [style.color]="getPriorityColor(deadline.priority)">
            notification_important
          </mat-icon>
          <div matListItemTitle>{{ deadline.title }}</div>
          <div matListItemLine>
            <span class="date">{{ deadline.date }}</span>
            <mat-chip-set class="priority-chip">
              <mat-chip [style.background-color]="getPriorityColor(deadline.priority)" class="white-text">
                {{ deadline.priority | uppercase }}
              </mat-chip>
            </mat-chip-set>
          </div>
        </mat-list-item>
      </mat-list>
    </div>
  `,
  styles: `
    .deadlines-widget {
      padding: 10px;
    }
    .date {
      font-size: 13px;
      margin-right: 10px;
    }
    .priority-chip {
      display: inline-block;
      transform: scale(0.8);
    }
    .white-text {
      color: white !important;
    }
  `
})
export class DeadlinesWidgetComponent {
  @Input() deadlines: Deadline[] = [
    { id: '1', title: 'Video Final Review', date: 'March 12, 2026', priority: 'high' },
    { id: '2', title: 'Client Feedback Meeting', date: 'March 15, 2026', priority: 'medium' },
    { id: '3', title: 'Script Approval', date: 'March 18, 2026', priority: 'low' }
  ];

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#757575';
    }
  }
}
