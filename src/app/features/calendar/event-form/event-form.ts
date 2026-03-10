import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Store } from '@ngrx/store';
import { CalendarActions } from '../../../state/calendar/calendar.actions';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule,
    MatCheckboxModule
  ],
  template: `
    <h2 mat-dialog-title>Add Calendar Event</h2>
    <mat-dialog-content>
      <form [formGroup]="eventForm" class="event-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Event Title</mat-label>
          <input matInput formControlName="title" placeholder="e.g. Script Review Meeting" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Event Type</mat-label>
          <mat-select formControlName="type">
            <mat-option value="meeting">Meeting</mat-option>
            <mat-option value="deadline">Deadline</mat-option>
            <mat-option value="other">Other</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="row">
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Start Time</mat-label>
            <input matInput type="datetime-local" formControlName="start" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="half-width">
            <mat-label>End Time</mat-label>
            <input matInput type="datetime-local" formControlName="end" required>
          </mat-form-field>
        </div>

        <mat-checkbox formControlName="allDay">All Day Event</mat-checkbox>

        <mat-form-field appearance="outline" class="full-width" style="margin-top: 15px">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="eventForm.invalid">
        Create Event
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .full-width {
      width: 100%;
      margin-bottom: 10px;
    }
    .half-width {
      width: 48%;
    }
    .row {
      display: flex;
      justify-content: space-between;
    }
    .event-form {
      padding-top: 10px;
    }
  `
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<EventFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      type: ['meeting', Validators.required],
      start: [this.data?.start ? this.formatDate(this.data.start) : '', Validators.required],
      end: [this.data?.end ? this.formatDate(this.data.end) : '', Validators.required],
      allDay: [this.data?.allDay || false],
      description: ['']
    });
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.eventForm.valid) {
      this.store.dispatch(CalendarActions.createEvent({ 
        event: this.eventForm.value 
      }));
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
  }
}
