import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { CreatorFile } from '../../../state/file/file.actions';
import { FileSizePipe } from '../../../shared/pipes/file-size.pipe';

@Component({
  selector: 'app-file-properties',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatListModule, MatIconModule, FileSizePipe],
  template: `
    <div class="properties-container">
      <mat-tab-group>
        <mat-tab label="Details">
          <mat-list>
            <mat-list-item>
              <mat-icon matListItemIcon>title</mat-icon>
              <div matListItemTitle>Name</div>
              <div matListItemLine>{{ file.name }}</div>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon>description</mat-icon>
              <div matListItemTitle>Type</div>
              <div matListItemLine>{{ file.type | uppercase }}</div>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon>storage</mat-icon>
              <div matListItemTitle>Size</div>
              <div matListItemLine>{{ file.size | fileSize }}</div>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon>calendar_today</mat-icon>
              <div matListItemTitle>Created</div>
              <div matListItemLine>{{ file.createdAt }}</div>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon>history</mat-icon>
              <div matListItemTitle>Last Modified</div>
              <div matListItemLine>{{ file.updatedAt }}</div>
            </mat-list-item>
          </mat-list>
        </mat-tab>
        
        <mat-tab label="Versions">
          <div class="versions-list">
            <div *ngIf="!file.versions || file.versions.length === 0" class="empty-versions">
              <mat-icon>history_toggle_off</mat-icon>
              <p>No previous versions found.</p>
            </div>
            
            <mat-list *ngIf="file.versions && file.versions.length > 0">
              <mat-list-item *ngFor="let v of file.versions; let i = index">
                <mat-icon matListItemIcon>file_upload</mat-icon>
                <div matListItemTitle>Version {{ file.versions.length - i }}</div>
                <div matListItemLine>Uploaded by {{ v.author }} on {{ v.createdAt }}</div>
                <button mat-icon-button matListItemMeta title="Download this version">
                  <mat-icon>download</mat-icon>
                </button>
              </mat-list-item>
            </mat-list>
          </div>
        </mat-tab>

        <mat-tab label="Permissions">
          <div class="permissions-tab">
            <mat-list>
              <mat-list-item>
                <mat-icon matListItemIcon>lock_open</mat-icon>
                <div matListItemTitle>Public Access</div>
                <div matListItemLine>Restricted to workspace members</div>
              </mat-list-item>
              <mat-list-item>
                <mat-icon matListItemIcon>group</mat-icon>
                <div matListItemTitle>Shared with</div>
                <div matListItemLine>{{ workspaceMembersCount }} members</div>
              </mat-list-item>
            </mat-list>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: `
    .properties-container {
      height: 100%;
      background: #fafafa;
    }
    .empty-versions {
      padding: 40px;
      text-align: center;
      color: #999;
    }
    .empty-versions mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 10px;
    }
    .permissions-tab {
      padding: 10px;
    }
  `
})
export class FilePropertiesComponent implements OnInit {
  @Input() file!: any; // Using any for now to handle mocked versions
  @Input() workspaceMembersCount: number = 0;

  constructor() {}

  ngOnInit(): void {}
}
