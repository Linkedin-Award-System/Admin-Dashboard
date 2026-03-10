import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DragDropDirective } from '../../../shared/directives/drag-drop.directive';

@Component({
  selector: 'app-upload-zone',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressBarModule, DragDropDirective],
  template: `
    <div class="upload-container" 
         appDragDrop 
         (fileDropped)="onFileDropped($any($event))"
         [class.dragging]="isDragging">
      <div class="upload-area">
        <mat-icon class="upload-icon">cloud_upload</mat-icon>
        <h3>Drag and drop files here</h3>
        <p>or</p>
        <button mat-raised-button color="primary" (click)="fileInput.click()">Browse Files</button>
        <input type="file" #fileInput (change)="onFileSelected($event)" hidden multiple>
      </div>

      <div class="file-list" *ngIf="files.length > 0">
        <div class="file-item" *ngFor="let file of files; let i = index">
          <mat-icon>insert_drive_file</mat-icon>
          <div class="file-details">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</span>
            <mat-progress-bar *ngIf="uploading" mode="determinate" [value]="uploadProgress[i] || 0"></mat-progress-bar>
          </div>
          <button mat-icon-button color="warn" (click)="removeFile(i)" [disabled]="uploading">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="upload-actions" *ngIf="!uploading">
             <button mat-raised-button color="accent" (click)="uploadFiles()">Upload All</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .upload-container {
      border: 2px dashed #ccc;
      border-radius: 10px;
      padding: 40px;
      text-align: center;
      transition: background-color 0.3s, border-color 0.3s;
      background-color: #fafafa;
    }
    .upload-container.dragging {
      border-color: #3f51b5;
      background-color: #e8eaf6;
    }
    .upload-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }
    .upload-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #9e9e9e;
    }
    .file-list {
      margin-top: 30px;
      text-align: left;
    }
    .file-item {
      display: flex;
      align-items: center;
      background: white;
      padding: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .file-details {
      flex: 1;
      margin-left: 15px;
      display: flex;
      flex-direction: column;
    }
    .file-name {
      font-weight: 500;
    }
    .file-size {
      font-size: 12px;
      color: #757575;
    }
    .upload-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
    }
  `
})
export class UploadZoneComponent {
  @Input() projectId: string = '';
  @Output() filesUploaded = new EventEmitter<void>();

  files: File[] = [];
  isDragging = false;
  uploading = false;
  uploadProgress: { [key: number]: number } = {};

  onFileDropped(fileList: FileList): void {
    this.addFiles(fileList);
  }

  onFileSelected(event: any): void {
    this.addFiles(event.target.files);
  }

  addFiles(fileList: FileList): void {
    for (let i = 0; i < fileList.length; i++) {
      this.files.push(fileList[i]);
    }
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
  }

  uploadFiles(): void {
    if (this.files.length === 0) return;
    this.uploading = true;
    // Implementation for uploading files one by one or batch
    // For now we'll mock the progress
    this.mockUpload();
  }

  mockUpload(): void {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      this.files.forEach((_, i) => this.uploadProgress[i] = progress);
      if (progress >= 100) {
        clearInterval(interval);
        this.uploading = false;
        this.files = [];
        this.uploadProgress = {};
        this.filesUploaded.emit();
      }
    }, 200);
  }
}
