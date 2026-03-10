import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, mergeMap } from 'rxjs/operators';
import { CalendarService } from '../../core/services/calendar.service';
import { CalendarActions } from './calendar.actions';

@Injectable()
export class CalendarEffects {
  private actions$ = inject(Actions);
  private calendarService = inject(CalendarService);

  loadEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarActions.loadEvents),
      exhaustMap(({ startDate, endDate }) =>
        this.calendarService.getEvents(startDate, endDate).pipe(
          map(events => CalendarActions.loadEventsSuccess({ events })),
          catchError(error => of(CalendarActions.loadEventsFailure({ error: error.message })))
        )
      )
    )
  );

  createEvent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CalendarActions.createEvent),
      mergeMap(({ event }) =>
        this.calendarService.createEvent(event).pipe(
          map(newEvent => CalendarActions.createEventSuccess({ event: newEvent })),
          catchError(error => of(CalendarActions.createEventFailure({ error: error.message })))
        )
      )
    )
  );

  constructor() {}
}
