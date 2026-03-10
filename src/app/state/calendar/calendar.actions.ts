import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay: boolean;
  type: 'meeting' | 'deadline' | 'other';
  projectId?: string;
  attendees: string[];
  createdAt: string;
}

export const CalendarActions = createActionGroup({
  source: 'Calendar',
  events: {
    'Load Events': props<{ startDate: string; endDate: string }>(),
    'Load Events Success': props<{ events: CalendarEvent[] }>(),
    'Load Events Failure': props<{ error: string }>(),
    
    'Create Event': props<{ event: Partial<CalendarEvent> }>(),
    'Create Event Success': props<{ event: CalendarEvent }>(),
    'Create Event Failure': props<{ error: string }>(),
    
    'Update Event': props<{ update: Update<CalendarEvent> }>(),
    'Update Event Success': props<{ event: CalendarEvent }>(),
    'Update Event Failure': props<{ error: string }>(),
    
    'Delete Event': props<{ id: string }>(),
    'Delete Event Success': props<{ id: string }>(),
    'Delete Event Failure': props<{ error: string }>(),
  }
});
