import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VoiceRecorderComponent } from '../voice-recorder/voice-recorder';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, VoiceRecorderComponent],
  template: `
    <div class="comment-form-container">
      <div class="mode-toggle" *ngIf="showVoiceOption">
        <button mat-button [color]="mode === 'text' ? 'primary' : ''" (click)="setMode('text')">
          <mat-icon>chat</mat-icon> Text
        </button>
        <button mat-button [color]="mode === 'voice' ? 'primary' : ''" (click)="setMode('voice')">
          <mat-icon>mic</mat-icon> Voice
        </button>
      </div>

      <form [formGroup]="commentForm" (ngSubmit)="onSubmit()" class="comment-form" *ngIf="mode === 'text'">
        <mat-form-field appearance="outline" class="full-width">
          <textarea matInput 
                    formControlName="content" 
                    [placeholder]="placeholder" 
                    rows="2" 
                    (keydown.enter)="onKeydown($event)"></textarea>
          <button mat-icon-button matSuffix (click)="onSubmit()" [disabled]="commentForm.invalid">
            <mat-icon color="primary">send</mat-icon>
          </button>
        </mat-form-field>
      </form>

      <app-voice-recorder *ngIf="mode === 'voice'" (voiceRecorded)="onVoiceRecorded($event)"></app-voice-recorder>
    </div>
  `,
  styles: `
    .full-width {
      width: 100%;
    }
    .comment-form-container {
      margin-top: 15px;
    }
    .mode-toggle {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }
    .mode-toggle button {
       font-size: 12px;
       height: 32px;
       line-height: 32px;
    }
    .mode-toggle mat-icon {
       font-size: 18px;
       width: 18px;
       height: 18px;
    }
  `
})
export class CommentFormComponent {
  @Input() placeholder = 'Write a comment...';
  @Input() showVoiceOption = true;
  @Output() commentSubmitted = new EventEmitter<string>();
  @Output() voiceCommentSubmitted = new EventEmitter<Blob>();

  commentForm: FormGroup;
  mode: 'text' | 'voice' = 'text';

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  setMode(mode: 'text' | 'voice'): void {
    this.mode = mode;
  }

  onVoiceRecorded(blob: Blob): void {
    this.voiceCommentSubmitted.emit(blob);
    this.setMode('text');
  }

  onKeydown(event: any): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      this.onSubmit();
      event.preventDefault();
    }
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      this.commentSubmitted.emit(this.commentForm.value.content);
      this.commentForm.reset();
    }
  }
}
