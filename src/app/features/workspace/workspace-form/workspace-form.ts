import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { Workspace, WorkspaceActions } from '../../../state/workspace/workspace.actions';

@Component({
  selector: 'app-workspace-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Workspace' : 'Create New Workspace' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="workspaceForm" class="workspace-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Workspace Name</mat-label>
          <input matInput formControlName="name" placeholder="e.g. Creative Studio" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="What is this workspace for?" rows="4"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="workspaceForm.invalid">
        {{ isEdit ? 'Save Changes' : 'Create Workspace' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .full-width {
      width: 100%;
      margin-bottom: 10px;
    }
    .workspace-form {
      padding-top: 10px;
    }
  `
})
export class WorkspaceFormComponent implements OnInit {
  workspaceForm: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<WorkspaceFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { workspace: Workspace }
  ) {
    this.workspaceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    if (this.data?.workspace) {
      this.isEdit = true;
      this.workspaceForm.patchValue({
        name: this.data.workspace.name,
        description: this.data.workspace.description
      });
    }
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.workspaceForm.valid) {
      const { name, description } = this.workspaceForm.value;
      if (this.isEdit) {
        this.store.dispatch(WorkspaceActions.updateWorkspace({ 
          update: { id: this.data.workspace.id, changes: { name, description } } 
        }));
      } else {
        this.store.dispatch(WorkspaceActions.createWorkspace({ name, description }));
      }
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
