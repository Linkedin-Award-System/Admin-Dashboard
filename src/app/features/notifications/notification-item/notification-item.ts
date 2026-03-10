import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Notification } from '../../../state/notification/notification.actions';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="notification-item" [class.unread]="!notification.isRead" (click)="onItemClick()">
      <div class="notif-icon">
        <mat-icon [color]="getIconColor(notification.type)">{{ getIcon(notification.type) }}</mat-icon>
      </div>
      <div class="notif-content">
        <div class="notif-title">{{ notification.title }}</div>
        <div class="notif-message">{{ notification.message }}</div>
        <div class="notif-time">{{ notification.createdAt }}</div>
      </div>
      <div class="unread-dot" *ngIf="!notification.isRead"></div>
    </div>
  `,
  styles: `
    .notification-item {
      display: flex;
      padding: 12px 15px;
      cursor: pointer;
      position: relative;
      transition: background-color 0.2s;
    }
    .notification-item:hover {
      background-color: #f5f5f5;
    }
    .notification-item.unread {
      background-color: #f0f4ff;
    }
    .notif-icon {
      margin-right: 15px;
      display: flex;
      align-items: center;
    }
    .notif-content {
      flex: 1;
    }
    .notif-title {
      font-weight: 500;
      font-size: 14px;
      color: #333;
    }
    .notif-message {
      font-size: 13px;
      color: #666;
      margin: 2px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .notif-time {
      font-size: 11px;
      color: #999;
    }
    .unread-dot {
      width: 8px;
      height: 8px;
      background-color: #3f51b5;
      border-radius: 50%;
      position: absolute;
      right: 15px;
      top: 15px;
    }
  `
})
export class NotificationItemComponent {
  @Input() notification!: Notification;
  @Output() markRead = new EventEmitter<string>();

  onItemClick(): void {
    if (!this.notification.isRead) {
      this.markRead.emit(this.notification.id);
    }
    // Handle navigation if link exists
  }

  getIcon(type: string): string {
    switch (type) {
      case 'mention': return 'alternate_email';
      case 'comment': return 'comment';
      case 'invite': return 'person_add';
      default: return 'info';
    }
  }

  getIconColor(type: string): string {
    switch (type) {
      case 'mention': return 'primary';
      case 'comment': return 'accent';
      case 'invite': return 'warn';
      default: return '';
    }
  }
}
