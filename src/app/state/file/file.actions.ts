import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export interface CreatorFile {
  id: string;
  projectId: string;
  folderId?: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploaderId: string;
  createdAt: string;
  version: number;
}

export const FileActions = createActionGroup({
  source: 'File',
  events: {
    'Load Files': props<{ projectId: string; folderId?: string }>(),
    'Load Files Success': props<{ files: CreatorFile[] }>(),
    'Load Files Failure': props<{ error: string }>(),
    
    'Upload File': props<{ file: File; projectId: string; folderId?: string }>(),
    'Upload File Progress': props<{ progress: number }>(),
    'Upload File Success': props<{ file: CreatorFile }>(),
    'Upload File Failure': props<{ error: string }>(),
    
    'Delete File': props<{ id: string }>(),
    'Delete File Success': props<{ id: string }>(),
    'Delete File Failure': props<{ error: string }>(),
    
    'Update File': props<{ update: Update<CreatorFile> }>(),
  }
});
