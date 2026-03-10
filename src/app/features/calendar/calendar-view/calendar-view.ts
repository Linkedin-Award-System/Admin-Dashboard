import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { CalendarEvent, CalendarActions } from '../../../state/calendar/calendar.actions';
import { selectAllCalendarEvents } from '../../../state/app.selectors';
import { EventFormComponent } from '../event-form/event-form';

@Component({
  selector: 'app-calendar-view',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="calendar-container">
      <header class="calendar-header">
        <h1>Calendar & Schedule</h1>
        <button mat-raised-button color="primary" (click)="onAddEvent()">
          <mat-icon>add</mat-icon>
          Add Event
        </button>
      </header>

      <div class="calendar-wrapper">
        <full-calendar [options]="calendarOptions"></full-calendar>
      </div>
    </div>
  `,
  styles: `
    .calendar-container {
      padding: 30px;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .calendar-wrapper {
      flex: 1;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    :host ::ng-deep .fc {
      height: 100%;
    }
    :host ::ng-deep .fc-toolbar-title {
      font-size: 1.5rem !important;
    }
  `
})
export class CalendarViewComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [], // Will be updated from store
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this)
  };

  constructor(private store: Store, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.store.select(selectAllCalendarEvents).pipe(
      map(events => events.map(e => ({
        id: e.id,
        title: e.title,
        start: e.start,
        end: e.end,
        allDay: e.allDay,
        backgroundColor: this.getEventColor(e.type)
      })))
    ).subscribe(formattedEvents => {
      this.calendarOptions.events = formattedEvents;
    });

    // Load events for current month (simplified range)
    this.store.dispatch(CalendarActions.loadEvents({ 
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
    }));
  }

  handleDateSelect(selectInfo: any): void {
    this.dialog.open(EventFormComponent, {
      width: '450px',
      data: { start: selectInfo.startStr, end: selectInfo.endStr, allDay: selectInfo.allDay }
    });
  }

  handleEventClick(clickInfo: any): void {
     // TODO: Implement event details/edit
     console.log('Event clicked:', clickInfo.event.id);
  }

  onAddEvent(): void {
    this.dialog.open(EventFormComponent, {
      width: '450px'
    });
  }

  getEventColor(type: string): string {
    switch (type) {
      case 'meeting': return '#3f51b5';
      case 'deadline': return '#f44336';
      default: return '#4caf50';
    }
  }
}
