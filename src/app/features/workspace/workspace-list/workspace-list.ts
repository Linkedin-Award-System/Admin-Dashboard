import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Workspace, WorkspaceActions } from '../../../state/workspace/workspace.actions';
import { selectAllWorkspaces, selectIsLoading } from '../../../state/app.selectors';
import { WorkspaceFormComponent } from '../workspace-form/workspace-form';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-workspace-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatDialogModule,
    MatProgressBarModule,
    RouterModule
  ],
  template: `
    <div class="workspace-list-container">
      <header class="list-header">
        <h1>My Workspaces</h1>
        <button mat-raised-button color="primary" (click)="onCreateWorkspace()">
          <mat-icon>add</mat-icon>
          New Workspace
        </button>
      </header>

      <div class="loading-bar" *ngIf="isLoading$ | async">
        <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      </div>

      <div class="workspace-grid">
        <mat-card *ngFor="let workspace of workspaces$ | async" class="workspace-card" [routerLink]="['/workspaces', workspace.id]">
          <mat-card-header>
            <div mat-card-avatar class="workspace-avatar">
              {{ workspace.name[0] | uppercase }}
            </div>
            <mat-card-title>{{ workspace.name }}</mat-card-title>
            <mat-card-subtitle>{{ workspace.members.length }} Members</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p class="description">{{ workspace.description }}</p>
            <div class="storage-usage">
              <div class="usage-text">
                <span>Storage</span>
                <span>{{ (workspace.storageUsed / 1024 / 1024 / 1024).toFixed(2) }} GB / {{ workspace.storageQuota }} GB</span>
              </div>
              <mat-progress-bar mode="determinate" [value]="(workspace.storageUsed / (workspace.storageQuota * 1024 * 1024 * 1024)) * 100" 
                               [color]="getStorageColor(workspace)"></mat-progress-bar>
            </div>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button color="primary" (click)="$event.stopPropagation(); onEditWorkspace(workspace)">Edit</button>
            <button mat-button [routerLink]="['/workspaces', workspace.id]">Open</button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="empty-state" *ngIf="(workspaces$ | async)?.length === 0 && !(isLoading$ | async)">
        <mat-icon class="empty-icon">business</mat-icon>
        <h3>No workspaces yet</h3>
        <p>Create your first workspace to start collaborating.</p>
        <button mat-raised-button color="primary" (click)="onCreateWorkspace()">Create Workspace</button>
      </div>
    </div>
  `,
  styles: `
    .workspace-list-container {
      padding: 30px;
    }
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .workspace-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    .workspace-card {
      cursor: pointer;
      transition: transform 0.2s;
    }
    .workspace-card:hover {
      transform: translateY(-5px);
    }
    .workspace-avatar {
      background-color: #3f51b5;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      font-size: 20px;
    }
    .description {
      height: 60px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      color: #666;
    }
    .storage-usage {
      margin-top: 15px;
    }
    .usage-text {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 5px;
      color: #666;
    }
    .empty-state {
      text-align: center;
      margin-top: 100px;
      color: #999;
    }
    .empty-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      margin-bottom: 20px;
    }
  `
})
export class WorkspaceListComponent implements OnInit {
  workspaces$: Observable<Workspace[]>;
  isLoading$: Observable<boolean>;

  constructor(private store: Store, private dialog: MatDialog) {
    this.workspaces$ = this.store.select(selectAllWorkspaces);
    // Note: I'll need to define selectIsLoading for Workspace feature
    this.isLoading$ = this.store.select(state => (state as any).workspace.isLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(WorkspaceActions.loadWorkspaces());
  }

  onCreateWorkspace(): void {
    this.dialog.open(WorkspaceFormComponent, {
      width: '500px'
    });
  }

  onEditWorkspace(workspace: Workspace): void {
    this.dialog.open(WorkspaceFormComponent, {
      width: '500px',
      data: { workspace }
    });
  }

  getStorageColor(workspace: Workspace): string {
    const percentage = (workspace.storageUsed / (workspace.storageQuota * 1024 * 1024 * 1024)) * 100;
    if (percentage > 90) return 'warn';
    if (percentage > 70) return 'accent';
    return 'primary';
  }
}
