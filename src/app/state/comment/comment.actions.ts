import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export interface Comment {
  id: string;
  fileId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp?: number; // For video/audio comments
  type: 'text' | 'voice';
  voiceUrl?: string;
  parentId?: string;
  createdAt: string;
  isEdited: boolean;
}

export const CommentActions = createActionGroup({
  source: 'Comment',
  events: {
    'Load Comments': props<{ fileId: string }>(),
    'Load Comments Success': props<{ comments: Comment[] }>(),
    'Load Comments Failure': props<{ error: string }>(),
    
    'Add Comment': props<{ comment: Partial<Comment> }>(),
    'Add Comment Success': props<{ comment: Comment }>(),
    'Add Comment Failure': props<{ error: string }>(),
    
    'Update Comment': props<{ update: Update<Comment> }>(),
    'Update Comment Success': props<{ comment: Comment }>(),
    'Update Comment Failure': props<{ error: string }>(),
    
    'Delete Comment': props<{ id: string }>(),
    'Delete Comment Success': props<{ id: string }>(),
    'Delete Comment Failure': props<{ error: string }>(),
    
    'Receive Realtime Comment': props<{ comment: Comment }>(),
  }
});
