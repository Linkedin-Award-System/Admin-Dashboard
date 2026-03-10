import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreatorFile } from '../../../state/file/file.actions';
import { VideoPlayerComponent } from '../video-player/video-player';
import { PdfViewerComponent } from '../pdf-viewer/pdf-viewer';
import { ImageViewerComponent } from '../image-viewer/image-viewer';

@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatIconModule, 
    MatButtonModule,
    VideoPlayerComponent,
    PdfViewerComponent,
    ImageViewerComponent
  ],
  template: `
    <div class="file-viewer-container">
      <header class="viewer-header">
        <div class="file-info">
          <mat-icon>{{ getFileIcon(data.file.type) }}</mat-icon>
          <span>{{ data.file.name }}</span>
        </div>
        <button mat-icon-button (click)="onClose()">
          <mat-icon>close</mat-icon>
        </button>
      </header>

      <div class="viewer-content">
        <app-video-player *ngIf="isFileType('video')" [src]="data.file.url"></app-video-player>
        <app-pdf-viewer *ngIf="isFileType('pdf')" [src]="data.file.url"></app-pdf-viewer>
        <app-image-viewer *ngIf="isFileType('image')" [src]="data.file.url"></app-image-viewer>
        
        <div *ngIf="!isSupportedType()" class="unsupported">
          <mat-icon>error_outline</mat-icon>
          <p>Preview not available for this file type.</p>
          <button mat-raised-button color="primary">Download File</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .file-viewer-container {
      display: flex;
      flex-direction: column;
      height: 90vh;
      width: 100%;
      background-color: #1a1a1a;
      color: white;
    }
    .viewer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      background-color: #333;
    }
    .file-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .viewer-content {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    .unsupported {
      text-align: center;
    }
    .unsupported mat-icon {
       font-size: 64px;
       width: 64px;
       height: 64px;
       margin-bottom: 20px;
    }
  `
})
export class FileViewerComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<FileViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { file: CreatorFile }
  ) {}

  ngOnInit(): void {}

  onClose(): void {
    this.dialogRef.close();
  }

  isFileType(type: string): boolean {
    return this.data.file.type.includes(type);
  }

  isSupportedType(): boolean {
    return ['video', 'pdf', 'image'].some(type => this.isFileType(type));
  }

  getFileIcon(type: string): string {
    if (type.includes('video')) return 'movie';
    if (type.includes('image')) return 'image';
    if (type.includes('pdf')) return 'picture_as_pdf';
    return 'insert_drive_file';
  }
}
