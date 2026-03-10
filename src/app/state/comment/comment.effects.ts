import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap } from 'rxjs/operators';
import { CommentService } from '../../core/services/comment.service';
import { CommentActions } from './comment.actions';

@Injectable()
export class CommentEffects {
  private actions$ = inject(Actions);
  private commentService = inject(CommentService);

  loadComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.loadComments),
      exhaustMap(({ fileId }) =>
        this.commentService.getComments(fileId).pipe(
          map(comments => CommentActions.loadCommentsSuccess({ comments })),
          catchError(error => of(CommentActions.loadCommentsFailure({ error: error.message })))
        )
      )
    )
  );

  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.addComment),
      mergeMap(({ comment }) =>
        this.commentService.addComment(
          comment.fileId!, 
          comment.content!, 
          comment.type, 
          comment.timestamp, 
          comment.audioUrl
        ).pipe(
          map(newComment => CommentActions.addCommentSuccess({ comment: newComment })),
          catchError(error => of(CommentActions.addCommentFailure({ error: error.message })))
        )
      )
    )
  );

  constructor() {}
}
