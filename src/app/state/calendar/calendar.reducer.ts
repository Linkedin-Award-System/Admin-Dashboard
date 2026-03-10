import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CalendarEvent, CalendarActions } from './calendar.actions';

export interface CalendarState extends EntityState<CalendarEvent> {
  isLoading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<CalendarEvent> = createEntityAdapter<CalendarEvent>();

export const initialState: CalendarState = adapter.getInitialState({
  isLoading: false,
  error: null
});

export const calendarReducer = createReducer(
  initialState,
  on(CalendarActions.loadEvents, (state) => ({ ...state, isLoading: true })),
  on(CalendarActions.loadEventsSuccess, (state, { events }) => 
    adapter.setAll(events, { ...state, isLoading: false })),
  on(CalendarActions.loadEventsFailure, (state, { error }) => 
    ({ ...state, error, isLoading: false })),
    
  on(CalendarActions.createEventSuccess, (state, { event }) => 
    adapter.addOne(event, state)),
    
  on(CalendarActions.updateEventSuccess, (state, { event }) => 
    adapter.updateOne({ id: event.id, changes: event }, state)),
    
  on(CalendarActions.deleteEventSuccess, (state, { id }) => 
    adapter.removeOne(id, state))
);
