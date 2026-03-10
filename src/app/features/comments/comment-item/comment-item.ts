import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Comment } from '../../../state/comment/comment.actions';
import { VoicePlayerComponent } from '../voice-player/voice-player';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, VoicePlayerComponent],
  template: `
    <div class="comment-item">
      <div class="comment-avatar">
        <img *ngIf="comment.authorAvatar" [src]="comment.authorAvatar" [alt]="comment.authorName">
        <div *ngIf="!comment.authorAvatar" class="avatar-placeholder">
          {{ comment.authorName[0] | uppercase }}
        </div>
      </div>
      <div class="comment-content">
        <div class="comment-header">
          <span class="author-name">{{ comment.authorName }}</span>
          <span class="timestamp">{{ comment.createdAt }}</span>
          <span class="timestamp" *ngIf="comment.timestamp"> @ {{ formatTimestamp(comment.timestamp) }}</span>
        </div>
        <div class="message">
          <p *ngIf="comment.type === 'text'">{{ comment.content }}</p>
          <div *ngIf="comment.type === 'voice'" class="voice-comment">
             <app-voice-player [src]="comment.audioUrl!"></app-voice-player>
          </div>
        </div>
        <div class="comment-actions">
          <button mat-button class="reply-btn">Reply</button>
          <button mat-icon-button title="Reaction">
             <mat-icon class="reaction-icon">add_reaction</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .comment-item {
      display: flex;
      padding: 15px 0;
    }
    .comment-avatar {
      margin-right: 15px;
    }
    .avatar-placeholder {
      width: 36px;
      height: 36px;
      background-color: #ff4081;
      color: white;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
    }
    .comment-content {
      flex: 1;
    }
    .comment-header {
      margin-bottom: 5px;
    }
    .author-name {
      font-weight: 600;
      margin-right: 10px;
    }
    .timestamp {
      font-size: 11px;
      color: #757575;
    }
    .message p {
      margin: 0;
      color: #333;
      line-height: 1.4;
    }
    .voice-comment {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #3f51b5;
      cursor: pointer;
    }
    .comment-actions {
      display: flex;
      align-items: center;
      margin-top: 5px;
    }
    .reply-btn {
      font-size: 11px;
      height: 24px;
      line-height: 24px;
      padding: 0 8px;
    }
    .reaction-icon {
       font-size: 16px;
       width: 16px;
       height: 16px;
       color: #999;
    }
  `
})
export class CommentItemComponent {
  @Input() comment!: Comment;

  formatTimestamp(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}
