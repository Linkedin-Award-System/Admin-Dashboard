import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export const ProjectActions = createActionGroup({
  source: 'Project',
  events: {
    'Load Projects': props<{ workspaceId: string }>(),
    'Load Projects Success': props<{ projects: Project[] }>(),
    'Load Projects Failure': props<{ error: string }>(),
    
    'Create Project': props<{ workspaceId: string; name: string; description: string }>(),
    'Create Project Success': props<{ project: Project }>(),
    'Create Project Failure': props<{ error: string }>(),
    
    'Update Project': props<{ update: Update<Project> }>(),
    'Update Project Success': props<{ project: Project }>(),
    'Update Project Failure': props<{ error: string }>(),
    
    'Delete Project': props<{ id: string }>(),
    'Delete Project Success': props<{ id: string }>(),
    'Delete Project Failure': props<{ error: string }>(),
  }
});
