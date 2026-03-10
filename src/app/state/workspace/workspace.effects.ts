import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap } from 'rxjs/operators';
import { WorkspaceService } from '../../core/services/workspace.service';
import { WorkspaceActions } from './workspace.actions';

@Injectable()
export class WorkspaceEffects {
  loadWorkspaces$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.loadWorkspaces),
      exhaustMap(() =>
        this.workspaceService.getWorkspaces().pipe(
          map(workspaces => WorkspaceActions.loadWorkspacesSuccess({ workspaces })),
          catchError(error => of(WorkspaceActions.loadWorkspacesFailure({ error: error.message })))
        )
      )
    )
  );

  createWorkspace$ = createEffect(() =>
    this.actions$.pipe(
      ofType(WorkspaceActions.createWorkspace),
      mergeMap(({ name, description }) =>
        this.workspaceService.createWorkspace(name, description).pipe(
          map(workspace => WorkspaceActions.createWorkspaceSuccess({ workspace })),
          catchError(error => of(WorkspaceActions.createWorkspaceFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private workspaceService: WorkspaceService
  ) {}
}
