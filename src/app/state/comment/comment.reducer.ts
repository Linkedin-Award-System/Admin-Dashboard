import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Comment, CommentActions } from './comment.actions';

export interface CommentState extends EntityState<Comment> {
  isLoading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Comment> = createEntityAdapter<Comment>({
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt)
});

export const initialState: CommentState = adapter.getInitialState({
  isLoading: false,
  error: null
});

export const commentReducer = createReducer(
  initialState,
  on(CommentActions.loadComments, (state) => ({ ...state, isLoading: true })),
  on(CommentActions.loadCommentsSuccess, (state, { comments }) => 
    adapter.setAll(comments, { ...state, isLoading: false })),
  on(CommentActions.loadCommentsFailure, (state, { error }) => 
    ({ ...state, error, isLoading: false })),
    
  on(CommentActions.addCommentSuccess, (state, { comment }) => 
    adapter.addOne(comment, state)),
    
  on(CommentActions.receiveRealtimeComment, (state, { comment }) => 
    adapter.addOne(comment, state)),
    
  on(CommentActions.updateCommentSuccess, (state, { comment }) => 
    adapter.updateOne({ id: comment.id, changes: comment }, state)),
    
  on(CommentActions.deleteCommentSuccess, (state, { id }) => 
    adapter.removeOne(id, state))
);
