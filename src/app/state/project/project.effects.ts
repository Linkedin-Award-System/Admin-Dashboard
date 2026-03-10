import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap } from 'rxjs/operators';
import { ProjectService } from '../../core/services/project.service';
import { ProjectActions } from './project.actions';

@Injectable()
export class ProjectEffects {
  loadProjects$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.loadProjects),
      exhaustMap(({ workspaceId }) =>
        this.projectService.getProjects(workspaceId).pipe(
          map(projects => ProjectActions.loadProjectsSuccess({ projects })),
          catchError(error => of(ProjectActions.loadProjectsFailure({ error: error.message })))
        )
      )
    )
  );

  createProject$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectActions.createProject),
      mergeMap(({ workspaceId, name, description }) =>
        this.projectService.createProject(workspaceId, name, description).pipe(
          map(project => ProjectActions.createProjectSuccess({ project })),
          catchError(error => of(ProjectActions.createProjectFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private projectService: ProjectService
  ) {}
}
