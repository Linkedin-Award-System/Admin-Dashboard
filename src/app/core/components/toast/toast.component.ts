import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Toast, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" 
           [@toastAnimation]
           class="toast-item" 
           [class]="toast.type">
        <mat-icon class="toast-icon">{{ getIcon(toast.type) }}</mat-icon>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" (click)="removeToast(toast.id)">
          <mat-icon>close</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: `
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }
    .toast-item {
      pointer-events: auto;
      min-width: 300px;
      padding: 12px 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
      color: white;
      font-weight: 500;
    }
    .toast-icon {
      margin-right: 12px;
    }
    .toast-message {
      flex: 1;
      font-size: 14px;
    }
    .toast-close {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 4px;
      margin-left: 8px;
      opacity: 0.7;
      display: flex;
      align-items: center;
      transition: opacity 0.2s;
    }
    .toast-close:hover {
      opacity: 1;
    }
    /* Types */
    .success { background-color: #4caf50; }
    .error { background-color: #f44336; }
    .warning { background-color: #ff9800; }
    .info { background-color: #2196f3; }
  `,
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription?: Subscription;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.getToasts().subscribe(toast => {
      this.toasts.push(toast);
      setTimeout(() => this.removeToast(toast.id), toast.duration || 4000);
    });
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'info';
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
