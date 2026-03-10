import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../../core/services/toast.service';
import { TimeFormatPipe } from '../../../shared/pipes/time-format.pipe';

@Component({
  selector: 'app-voice-recorder',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, TimeFormatPipe],
  template: `
    <div class="recorder-container">
      <div class="recording-indicator" *ngIf="isRecording">
        <div class="dot"></div>
        <span class="timer">{{ recordingTime | timeFormat }}</span>
      </div>
      
      <div class="recorder-controls">
        <button mat-fab color="warn" *ngIf="!isRecording" (click)="startRecording()" class="record-btn">
          <mat-icon>mic</mat-icon>
        </button>
        
        <div class="active-controls" *ngIf="isRecording">
          <button mat-icon-button color="warn" (click)="cancelRecording()">
            <mat-icon>delete</mat-icon>
          </button>
          
          <button mat-fab color="primary" (click)="stopRecording()">
            <mat-icon>stop</mat-icon>
          </button>
        </div>
      </div>

      <div class="preview-container" *ngIf="audioBlob && !isRecording">
        <audio [src]="audioUrl" controls class="audio-preview"></audio>
        <div class="preview-actions">
           <button mat-button (click)="discardPreview()">Discard</button>
           <button mat-raised-button color="primary" (click)="onUpload()">Post Voice Comment</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .recorder-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px;
      gap: 15px;
      background: #fafafa;
      border-radius: 12px;
      border: 1px solid #eee;
    }
    .recording-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .dot {
      width: 12px;
      height: 12px;
      background: #f44336;
      border-radius: 50%;
      animation: blink 1s infinite;
    }
    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0.3; }
      100% { opacity: 1; }
    }
    .timer {
      font-weight: 500;
      font-size: 18px;
    }
    .active-controls {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .preview-container {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .audio-preview {
      width: 100%;
      height: 40px;
    }
    .preview-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  `
})
export class VoiceRecorderComponent implements OnInit, OnDestroy {
  @Output() voiceRecorded = new EventEmitter<Blob>();

  isRecording = false;
  recordingTime = 0;
  private timerInterval?: any;
  private mediaRecorder?: MediaRecorder;
  private audioChunks: Blob[] = [];
  
  audioBlob: Blob | null = null;
  audioUrl = '';

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {}

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/mpeg' });
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.startTimer();
    } catch (err) {
      this.toastService.error('Could not access microphone. Please check permissions.');
      console.error('Recording error:', err);
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.stopTimer();
    }
  }

  cancelRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.stopTimer();
      setTimeout(() => this.discardPreview(), 100);
    }
  }

  discardPreview(): void {
    this.audioBlob = null;
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = '';
    }
    this.audioChunks = [];
    this.recordingTime = 0;
  }

  onUpload(): void {
    if (this.audioBlob) {
      this.voiceRecorded.emit(this.audioBlob);
      this.discardPreview();
    }
  }

  private startTimer(): void {
    this.recordingTime = 0;
    this.timerInterval = setInterval(() => {
      this.recordingTime++;
      if (this.recordingTime >= 300) { // 5 min limit
        this.stopRecording();
        this.toastService.warning('Maximum recording time reached.');
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }
}
