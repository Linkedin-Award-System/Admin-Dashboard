import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Workspace, WorkspaceActions } from './workspace.actions';

export interface WorkspaceState extends EntityState<Workspace> {
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Workspace> = createEntityAdapter<Workspace>();

export const initialState: WorkspaceState = adapter.getInitialState({
  selectedId: null,
  isLoading: false,
  error: null
});

export const workspaceReducer = createReducer(
  initialState,
  on(WorkspaceActions.loadWorkspaces, (state) => ({ ...state, isLoading: true })),
  on(WorkspaceActions.loadWorkspacesSuccess, (state, { workspaces }) => 
    adapter.setAll(workspaces, { ...state, isLoading: false })),
  on(WorkspaceActions.loadWorkspacesFailure, (state, { error }) => 
    ({ ...state, error, isLoading: false })),
    
  on(WorkspaceActions.createWorkspaceSuccess, (state, { workspace }) => 
    adapter.addOne(workspace, state)),
    
  on(WorkspaceActions.updateWorkspaceSuccess, (state, { workspace }) => 
    adapter.updateOne({ id: workspace.id, changes: workspace }, state)),
    
  on(WorkspaceActions.deleteWorkspaceSuccess, (state, { id }) => 
    adapter.removeOne(id, state)),
    
  on(WorkspaceActions.selectWorkspace, (state, { id }) => 
    ({ ...state, selectedId: id }))
);
