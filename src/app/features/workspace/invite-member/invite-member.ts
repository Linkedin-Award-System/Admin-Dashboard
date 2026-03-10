import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-invite-member',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Invite New Member</h2>
    <mat-dialog-content>
      <form [formGroup]="inviteForm" class="invite-form">
        <p>Invite participants to your workspace via email.</p>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email Address</mat-label>
          <input matInput formControlName="email" type="email" placeholder="email@example.com" required>
          <mat-error *ngIf="inviteForm.get('email')?.hasError('required')">Email is required</mat-error>
          <mat-error *ngIf="inviteForm.get('email')?.hasError('email')">Invalid email address</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role" required>
            <mat-option value="ADMIN">Admin</mat-option>
            <mat-option value="COLLABORATOR">Collaborator</mat-option>
            <mat-option value="VIEWER">Viewer</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Personal Message (Optional)</mat-label>
          <textarea matInput formControlName="message" rows="3" placeholder="Add a personal touch..."></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onInvite()" [disabled]="inviteForm.invalid">
        Send Invitation
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .full-width {
      width: 100%;
      margin-bottom: 10px;
    }
    .invite-form {
      padding-top: 10px;
    }
  `
})
export class InviteMemberComponent implements OnInit {
  inviteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<InviteMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { workspaceId: string }
  ) {
    this.inviteForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['COLLABORATOR', Validators.required],
      message: ['']
    });
  }

  ngOnInit(): void {}

  onInvite(): void {
    if (this.inviteForm.valid) {
      const inviteData = {
        workspaceId: this.data.workspaceId,
        ...this.inviteForm.value
      };
      // Dispatch action to send invite
      console.log('Invite Sent:', inviteData);
      this.dialogRef.close(inviteData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
