import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Project, ProjectActions } from './project.actions';

export interface ProjectState extends EntityState<Project> {
  isLoading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Project> = createEntityAdapter<Project>();

export const initialState: ProjectState = adapter.getInitialState({
  isLoading: false,
  error: null
});

export const projectReducer = createReducer(
  initialState,
  on(ProjectActions.loadProjects, (state) => ({ ...state, isLoading: true })),
  on(ProjectActions.loadProjectsSuccess, (state, { projects }) => 
    adapter.setAll(projects, { ...state, isLoading: false })),
  on(ProjectActions.loadProjectsFailure, (state, { error }) => 
    ({ ...state, error, isLoading: false })),
    
  on(ProjectActions.createProjectSuccess, (state, { project }) => 
    adapter.addOne(project, state)),
    
  on(ProjectActions.updateProjectSuccess, (state, { project }) => 
    adapter.updateOne({ id: project.id, changes: project }, state)),
    
  on(ProjectActions.deleteProjectSuccess, (state, { id }) => 
    adapter.removeOne(id, state))
);
