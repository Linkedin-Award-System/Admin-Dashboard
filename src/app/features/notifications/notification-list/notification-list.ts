import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Notification, NotificationActions } from '../../../state/notification/notification.actions';
import { selectAllNotifications } from '../../../state/app.selectors';
import { NotificationItemComponent } from '../notification-item/notification-item';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatDividerModule, NotificationItemComponent],
  template: `
    <div class="notification-container">
      <div class="notif-header">
        <h3>Notifications</h3>
        <button mat-button color="primary" (click)="onMarkAllRead()">Mark all as read</button>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="notif-scroll">
        <div *ngFor="let notification of notifications$ | async">
          <app-notification-item [notification]="notification" (markRead)="onMarkRead($event)"></app-notification-item>
          <mat-divider></mat-divider>
        </div>
        
        <div class="empty-notif" *ngIf="(notifications$ | async)?.length === 0">
           <p>No new notifications</p>
        </div>
      </div>
      
      <mat-divider></mat-divider>
      
      <div class="notif-footer">
        <button mat-button class="view-all">View All Notifications</button>
      </div>
    </div>
  `,
  styles: `
    .notification-container {
      width: 350px;
      max-height: 500px;
      display: flex;
      flex-direction: column;
      background: white;
    }
    .notif-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
    }
    .notif-header h3 {
      margin: 0;
      font-size: 16px;
    }
    .notif-scroll {
      flex: 1;
      overflow-y: auto;
    }
    .empty-notif {
      padding: 40px 20px;
      text-align: center;
      color: #999;
    }
    .notif-footer {
      padding: 5px;
      text-align: center;
    }
    .view-all {
      width: 100%;
    }
  `
})
export class NotificationListComponent implements OnInit {
  notifications$: Observable<Notification[]>;

  constructor(private store: Store) {
    this.notifications$ = this.store.select(selectAllNotifications);
  }

  ngOnInit(): void {
    this.store.dispatch(NotificationActions.loadNotifications());
  }

  onMarkRead(id: string): void {
    this.store.dispatch(NotificationActions.markAsRead({ id }));
  }

  onMarkAllRead(): void {
    this.store.dispatch(NotificationActions.markAllAsRead());
  }
}
