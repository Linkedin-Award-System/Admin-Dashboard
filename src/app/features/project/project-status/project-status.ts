import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-project-status',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <mat-chip-set>
      <mat-chip [style.background-color]="getStatusColor(status)" style="color: white">
        {{ status | uppercase }}
      </mat-chip>
    </mat-chip-set>
  `,
  styles: ``
})
export class ProjectStatusComponent {
  @Input() status: 'active' | 'archived' | 'completed' = 'active';

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return '#4caf50';
      case 'completed': return '#2196f3';
      case 'archived': return '#9e9e9e';
      default: return '#757575';
    }
  }
}
