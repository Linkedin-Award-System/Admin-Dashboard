import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CreatorFile, FileActions } from './file.actions';

export interface FileState extends EntityState<CreatorFile> {
  isLoading: boolean;
  uploadProgress: number;
  error: string | null;
}

export const adapter: EntityAdapter<CreatorFile> = createEntityAdapter<CreatorFile>();

export const initialState: FileState = adapter.getInitialState({
  isLoading: false,
  uploadProgress: 0,
  error: null
});

export const fileReducer = createReducer(
  initialState,
  on(FileActions.loadFiles, (state) => ({ ...state, isLoading: true })),
  on(FileActions.loadFilesSuccess, (state, { files }) => 
    adapter.setAll(files, { ...state, isLoading: false })),
  on(FileActions.loadFilesFailure, (state, { error }) => 
    ({ ...state, error, isLoading: false })),
    
  on(FileActions.uploadFile, (state) => ({ ...state, uploadProgress: 0 })),
  on(FileActions.uploadFileProgress, (state, { progress }) => ({ ...state, uploadProgress: progress })),
  on(FileActions.uploadFileSuccess, (state, { file }) => 
    adapter.addOne(file, { ...state, uploadProgress: 100 })),
    
  on(FileActions.deleteFileSuccess, (state, { id }) => 
    adapter.removeOne(id, state))
);
