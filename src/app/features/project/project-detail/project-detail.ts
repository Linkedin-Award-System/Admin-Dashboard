import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Project, ProjectActions } from '../../../state/project/project.actions';
import { FileActions, CreatorFile } from '../../../state/file/file.actions';
import { selectAllFiles } from '../../../state/app.selectors';
import { VersionHistoryComponent } from '../version-history/version-history';
import { ProjectStatusComponent } from '../project-status/project-status';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [
    CommonModule, 
    MatTabsModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatListModule,
    MatMenuModule,
    MatChipsModule,
    MatProgressBarModule,
    RouterModule,
    VersionHistoryComponent,
    ProjectStatusComponent
  ],
  template: `
    <div class="project-detail-container">
      <header class="detail-header">
        <div class="title-section">
          <button mat-icon-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <div>
            <h1>{{ project?.name || 'Loading project...' }}</h1>
            <p class="description">{{ project?.description }}</p>
          </div>
        </div>
        <div class="actions">
          <app-project-status [status]="project?.status || 'active'"></app-project-status>
          <button mat-raised-button color="primary">
            <mat-icon>cloud_upload</mat-icon>
            Upload File
          </button>
          <button mat-icon-button [matMenuTriggerFor]="projectMenu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #projectMenu="matMenu">
            <button mat-menu-item>
              <mat-icon>edit</mat-icon>
              <span>Edit Project</span>
            </button>
            <button mat-menu-item class="warn-text">
              <mat-icon color="warn">delete</mat-icon>
              <span>Delete Project</span>
            </button>
          </mat-menu>
        </div>
      </header>

      <mat-tab-group class="detail-tabs">
        <mat-tab label="Files">
          <div class="tab-content">
            <div class="file-grid" *ngIf="(files$ | async)?.length; else emptyFiles">
              <mat-card *ngFor="let file of files$ | async" class="file-card">
                <div class="file-preview">
                  <mat-icon class="file-icon">{{ getFileIcon(file.type) }}</mat-icon>
                  <img *ngIf="file.thumbnailUrl" [src]="file.thumbnailUrl" [alt]="file.name">
                </div>
                <mat-card-content>
                  <div class="file-name">{{ file.name }}</div>
                  <div class="file-info">
                    <span>{{ (file.size / 1024 / 1024).toFixed(2) }} MB</span>
                    <span>v{{ file.version }}</span>
                  </div>
                </mat-card-content>
                <mat-card-actions>
                  <button mat-button color="primary">View</button>
                  <button mat-icon-button [matMenuTriggerFor]="fileMenu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #fileMenu="matMenu">
                    <button mat-menu-item>
                      <mat-icon>history</mat-icon>
                      <span>Versions</span>
                    </button>
                    <button mat-menu-item>
                      <mat-icon>download</mat-icon>
                      <span>Download</span>
                    </button>
                  </mat-menu>
                </mat-card-actions>
              </mat-card>
            </div>
            <ng-template #emptyFiles>
              <div class="empty-state">
                <mat-icon class="empty-icon">insert_drive_file</mat-icon>
                <h3>No files in this project</h3>
                <p>Upload your first file to get started.</p>
                <button mat-raised-button color="primary">Upload File</button>
              </div>
            </ng-template>
          </div>
        </mat-tab>

        <mat-tab label="History">
          <div class="tab-content">
            <app-version-history [projectId]="projectId"></app-version-history>
          </div>
        </mat-tab>

        <mat-tab label="Team">
          <div class="tab-content">
             <mat-card class="team-card">
                <mat-card-header>
                  <mat-card-title>Project Collaborators</mat-card-title>
                </mat-card-header>
                <mat-card-content>
                  <mat-list>
                    <mat-list-item>
                       <div matListItemIcon class="avatar">A</div>
                       <div matListItemTitle>Abebe (Owner)</div>
                    </mat-list-item>
                  </mat-list>
                </mat-card-content>
             </mat-card>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: `
    .project-detail-container {
      padding: 30px;
    }
    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .title-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .title-section h1 {
      margin: 0;
      font-size: 26px;
    }
    .description {
      color: #757575;
      margin: 5px 0 0 0;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .file-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }
    .file-card {
      overflow: hidden;
    }
    .file-preview {
      height: 120px;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }
    .file-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #9e9e9e;
    }
    .file-name {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 10px;
    }
    .file-info {
      font-size: 12px;
      color: #757575;
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
    .empty-state {
      text-align: center;
      padding: 80px;
      color: #9e9e9e;
    }
    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
    }
    .warn-text {
      color: #f44336;
    }
    .avatar {
      background-color: #3f51b5;
      color: white;
      border-radius: 50%;
      height: 40px;
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `
})
export class ProjectDetailComponent implements OnInit {
  projectId: string = '';
  project: Project | null = null;
  files$: Observable<CreatorFile[]>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: RouterModule // Just for go back
  ) {
    this.files$ = this.store.select(selectAllFiles);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      if (this.projectId) {
        // Load project and files
        this.store.dispatch(FileActions.loadFiles({ projectId: this.projectId }));
        // Mock project for now as we don't have a single project selector/load action implemented yet
        this.project = {
          id: this.projectId,
          workspaceId: '1',
          name: 'Commercial Video Production',
          description: 'Main TV commercial for summer campaign',
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    });
  }

  getFileIcon(type: string): string {
    if (type.includes('video')) return 'movie';
    if (type.includes('image')) return 'image';
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('audio')) return 'audiotrack';
    return 'insert_drive_file';
  }

  goBack(): void {
    window.history.back();
  }
}
