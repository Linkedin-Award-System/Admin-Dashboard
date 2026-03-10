import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Comment, CommentActions } from '../../../state/comment/comment.actions';
import { selectAllComments } from '../../../state/app.selectors';
import { CommentItemComponent } from '../comment-item/comment-item';
import { CommentFormComponent } from '../comment-form/comment-form';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, MatListModule, MatDividerModule, CommentItemComponent, CommentFormComponent],
  template: `
    <div class="comment-list-container">
      <h3>Comments ({{ (comments$ | async)?.length || 0 }})</h3>
      
      <div class="comments-scroll">
        <div *ngFor="let comment of comments$ | async">
          <app-comment-item [comment]="comment"></app-comment-item>
          <mat-divider inset></mat-divider>
        </div>
        
        <div class="empty-comments" *ngIf="(comments$ | async)?.length === 0">
           <p>No comments yet. Be the first to start the discussion!</p>
        </div>
      </div>

      <app-comment-form (commentSubmitted)="onAddComment($event)"></app-comment-form>
    </div>
  `,
  styles: `
    .comment-list-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 10px;
    }
    .comments-scroll {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 20px;
    }
    .empty-comments {
      text-align: center;
      padding: 30px;
      color: #999;
    }
  `
})
export class CommentListComponent implements OnInit {
  @Input() fileId: string = '';
  comments$: Observable<Comment[]>;

  constructor(private store: Store) {
    this.comments$ = this.store.select(selectAllComments);
  }

  ngOnInit(): void {
    if (this.fileId) {
      this.store.dispatch(CommentActions.loadComments({ fileId: this.fileId }));
    }
  }

  onAddComment(content: string): void {
    if (this.fileId) {
      this.store.dispatch(CommentActions.addComment({ 
        comment: { fileId: this.fileId, content, type: 'text' } 
      }));
    }
  }
}
