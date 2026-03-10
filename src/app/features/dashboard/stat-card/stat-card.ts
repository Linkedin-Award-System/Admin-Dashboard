import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="stat-card">
      <mat-card-header>
        <div mat-card-avatar class="icon-container" [style.background-color]="color">
          <mat-icon>{{ icon }}</mat-icon>
        </div>
        <mat-card-title>{{ value }}</mat-card-title>
        <mat-card-subtitle>{{ title }}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <div class="trend" *ngIf="trend">
          <mat-icon [style.color]="trend > 0 ? 'green' : 'red'">
            {{ trend > 0 ? 'trending_up' : 'trending_down' }}
          </mat-icon>
          <span [style.color]="trend > 0 ? 'green' : 'red'">{{ trend }}%</span>
          <span class="trend-text"> since last week</span>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: `
    .stat-card {
      min-width: 200px;
    }
    .icon-container {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      color: white;
    }
    .trend {
      display: flex;
      align-items: center;
      font-size: 12px;
      margin-top: 10px;
    }
    .trend-text {
      color: gray;
      margin-left: 5px;
    }
    mat-card-title {
      font-size: 24px;
      font-weight: bold;
    }
  `
})
export class StatCardComponent {
  @Input() title: string = '';
  @Input() value: string | number = 0;
  @Input() icon: string = 'show_chart';
  @Input() color: string = '#1976d2';
  @Input() trend?: number;
}
