import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { EntityMap, EntityMapOne, Predicate, Update } from '@ngrx/entity';

export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: any[];
  storageUsed: number;
  storageQuota: number;
}

export const WorkspaceActions = createActionGroup({
  source: 'Workspace',
  events: {
    'Load Workspaces': emptyProps(),
    'Load Workspaces Success': props<{ workspaces: Workspace[] }>(),
    'Load Workspaces Failure': props<{ error: string }>(),
    
    'Create Workspace': props<{ name: string; description: string }>(),
    'Create Workspace Success': props<{ workspace: Workspace }>(),
    'Create Workspace Failure': props<{ error: string }>(),
    
    'Update Workspace': props<{ update: Update<Workspace> }>(),
    'Update Workspace Success': props<{ workspace: Workspace }>(),
    'Update Workspace Failure': props<{ error: string }>(),
    
    'Delete Workspace': props<{ id: string }>(),
    'Delete Workspace Success': props<{ id: string }>(),
    'Delete Workspace Failure': props<{ error: string }>(),
    
    'Select Workspace': props<{ id: string }>(),
  }
});
