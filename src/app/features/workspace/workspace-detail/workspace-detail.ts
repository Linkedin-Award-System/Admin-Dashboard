import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { Workspace, WorkspaceActions } from '../../../state/workspace/workspace.actions';
import { selectSelectedWorkspace, selectAllProjects } from '../../../state/app.selectors';
import { InviteMemberComponent } from '../invite-member/invite-member';
import { Project, ProjectActions } from '../../../state/project/project.actions';

@Component({
  selector: 'app-workspace-detail',
  standalone: true,
  imports: [
    CommonModule, 
    MatTabsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatListModule, 
    MatDividerModule,
    MatDialogModule,
    MatProgressBarModule,
    RouterModule
  ],
  template: `
    <div class="workspace-detail-container" *ngIf="workspace$ | async as workspace">
      <header class="detail-header">
        <div class="title-section">
          <button mat-icon-button routerLink="/workspaces">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>{{ workspace.name }}</h1>
        </div>
        <div class="actions">
          <button mat-raised-button color="primary" (click)="onInviteMember()">
            <mat-icon>person_add</mat-icon>
            Invite Member
          </button>
          <button mat-stroked-button (click)="onCreateProject()">
            <mat-icon>add_box</mat-icon>
            New Project
          </button>
        </div>
      </header>

      <mat-tab-group class="detail-tabs">
        <mat-tab label="Projects">
          <div class="tab-content">
            <div class="project-grid" *ngIf="(projects$ | async)?.length; else emptyProjects">
              <mat-card *ngFor="let project of projects$ | async" class="project-card" [routerLink]="['/projects', project.id]">
                <mat-card-header>
                  <mat-card-title>{{ project.name }}</mat-card-title>
                  <mat-card-subtitle>{{ project.status | uppercase }}</mat-card-subtitle>
                </mat-card-header>
                <mat-card-content>
                  <p>{{ project.description }}</p>
                  <p class="timestamp">Last updated: {{ project.updatedAt }}</p>
                </mat-card-content>
                <mat-card-actions align="end">
                  <button mat-button>Open</button>
                </mat-card-actions>
              </mat-card>
            </div>
            <ng-template #emptyProjects>
              <div class="empty-state">
                <mat-icon class="empty-icon">folder_open</mat-icon>
                <h3>No projects in this workspace</h3>
                <button mat-raised-button color="primary" (click)="onCreateProject()">Create Project</button>
              </div>
            </ng-template>
          </div>
        </mat-tab>

        <mat-tab label="Members">
          <div class="tab-content">
            <mat-card class="member-list-card">
              <mat-list>
                <mat-list-item *ngFor="let member of workspace.members">
                  <div matListItemIcon class="member-avatar">
                    {{ member.name[0] | uppercase }}
                  </div>
                  <div matListItemTitle>{{ member.name }}</div>
                  <div matListItemLine>{{ member.role }} • {{ member.email }}</div>
                  <button mat-icon-button matListItemMeta color="warn">
                    <mat-icon>person_remove</mat-icon>
                  </button>
                </mat-list-item>
              </mat-list>
            </mat-card>
          </div>
        </mat-tab>

        <mat-tab label="Settings">
          <div class="tab-content">
            <mat-card class="settings-card">
              <h3>Workspace Usage</h3>
              <p>Total Storage Used: {{ (workspace.storageUsed / 1024 / 1024 / 1024).toFixed(2) }} GB of {{ workspace.storageQuota }} GB</p>
              <mat-progress-bar mode="determinate" [value]="(workspace.storageUsed / (workspace.storageQuota * 1024 * 1024 * 1024)) * 100"></mat-progress-bar>
              <mat-divider style="margin: 20px 0"></mat-divider>
              <h3>Workspace Actions</h3>
              <button mat-stroked-button color="warn">Delete Workspace</button>
            </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: `
    .workspace-detail-container {
      padding: 30px;
    }
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .title-section {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .title-section h1 {
      margin: 0;
      font-size: 24px;
    }
    .actions button {
      margin-left: 10px;
    }
    .tab-content {
      padding: 20px 0;
    }
    .project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .project-card {
      cursor: pointer;
    }
    .timestamp {
      font-size: 12px;
      color: #999;
      margin-top: 10px;
    }
    .member-avatar {
      background-color: #673ab7;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      height: 40px;
      width: 40px;
      font-weight: bold;
    }
    .empty-state {
      text-align: center;
      padding: 60px;
      color: #969696;
    }
    .empty-icon {
      font-size: 60px;
      width: 60px;
      height: 60px;
    }
  `
})
export class WorkspaceDetailComponent implements OnInit {
  workspace$: Observable<Workspace | null | undefined>;
  projects$: Observable<Project[]>;
  workspaceId: string = '';

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private dialog: MatDialog
  ) {
    this.workspace$ = this.store.select(selectSelectedWorkspace);
    this.projects$ = this.store.select(selectAllProjects);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.workspaceId = params['id'];
      if (this.workspaceId) {
        this.store.dispatch(WorkspaceActions.selectWorkspace({ id: this.workspaceId }));
        this.store.dispatch(ProjectActions.loadProjects({ workspaceId: this.workspaceId }));
      }
    });
  }

  onInviteMember(): void {
    this.dialog.open(InviteMemberComponent, {
      width: '450px',
      data: { workspaceId: this.workspaceId }
    });
  }

  onCreateProject(): void {
    // Navigate to create project or open project form dialog
    // For now we'll just log
    console.log('Create Project');
  }
}
