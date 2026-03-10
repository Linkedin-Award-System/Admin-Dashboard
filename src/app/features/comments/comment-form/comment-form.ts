import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <form [formGroup]="commentForm" (ngSubmit)="onSubmit()" class="comment-form">
      <mat-form-field appearance="outline" class="full-width">
        <textarea matInput 
                  formControlName="content" 
                  [placeholder]="placeholder" 
                  rows="2" 
                  (keydown.enter)="$event.shiftKey ? null : onSubmit(); $event.preventDefault()"></textarea>
        <button mat-icon-button matSuffix (click)="onSubmit()" [disabled]="commentForm.invalid">
          <mat-icon color="primary">send</mat-icon>
        </button>
      </mat-form-field>
      
      <div class="voice-comment-hint" *ngIf="showVoiceOption">
        <button mat-icon-button type="button" color="accent" title="Record Voice Comment">
          <mat-icon>mic</mat-icon>
        </button>
        <span>Record a voice comment</span>
      </div>
    </form>
  `,
  styles: `
    .full-width {
      width: 100%;
    }
    .comment-form {
      margin-top: 15px;
    }
    .voice-comment-hint {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;
      color: #666;
      margin-top: -10px;
    }
  `
})
export class CommentFormComponent {
  @Input() placeholder = 'Write a comment...';
  @Input() showVoiceOption = true;
  @Output() commentSubmitted = new EventEmitter<string>();

  commentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  onSubmit(): void {
    if (this.commentForm.valid) {
      this.commentSubmitted.emit(this.commentForm.value.content);
      this.commentForm.reset();
    }
  }
}
