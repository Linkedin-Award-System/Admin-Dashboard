import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-version-history',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule],
  template: `
    <div class="version-history">
      <mat-list>
        <mat-list-item *ngFor="let version of history">
          <mat-icon matListItemIcon>history</mat-icon>
          <div matListItemTitle>Version {{ version.version }} - {{ version.action }}</div>
          <div matListItemLine>By {{ version.user }} • {{ version.timestamp }}</div>
          <p matListItemLine *ngIf="version.note" class="note italic">"{{ version.note }}"</p>
          <button mat-icon-button matListItemMeta color="primary">
            <mat-icon>download</mat-icon>
          </button>
        </mat-list-item>
      </mat-list>
    </div>
  `,
  styles: `
    .note {
      font-size: 13px;
      color: #666;
      margin-top: 5px;
    }
    .italic {
      font-style: italic;
    }
  `
})
export class VersionHistoryComponent {
  @Input() projectId: string = '';
  
  history = [
    { version: 3, action: 'File uploaded', user: 'Kebede', timestamp: '2 hours ago', note: 'Added color grading to final segment' },
    { version: 2, action: 'Status changed', user: 'Sara', timestamp: 'Yesterday', note: 'Moving to review phase' },
    { version: 1, action: 'Project created', user: 'Kebede', timestamp: '3 days ago', note: 'Initial project setup' }
  ];
}
