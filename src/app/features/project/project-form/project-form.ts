import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { Project, ProjectActions } from '../../../state/project/project.actions';

@Component({
  selector: 'app-project-form',
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
    <h2 mat-dialog-title>{{ isEdit ? 'Edit Project' : 'Create New Project' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="projectForm" class="project-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Project Name</mat-label>
          <input matInput formControlName="name" placeholder="e.g. Summer Ad Campaign" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Project goals and details..." rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width" *ngIf="isEdit">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="active">Active</mat-option>
            <mat-option value="completed">Completed</mat-option>
            <mat-option value="archived">Archived</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="onSave()" [disabled]="projectForm.invalid">
        {{ isEdit ? 'Save Changes' : 'Create Project' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .project-form {
      padding-top: 10px;
    }
  `
})
export class ProjectFormComponent implements OnInit {
  projectForm: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private dialogRef: MatDialogRef<ProjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { project?: Project, workspaceId?: string }
  ) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: ['active']
    });

    if (this.data?.project) {
      this.isEdit = true;
      this.projectForm.patchValue({
        name: this.data.project.name,
        description: this.data.project.description,
        status: this.data.project.status
      });
    }
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.projectForm.valid) {
      const { name, description, status } = this.data.workspaceId ? { ...this.projectForm.value, status: 'active' } : this.projectForm.value;
      if (this.isEdit && this.data.project) {
        this.store.dispatch(ProjectActions.updateProject({ 
          update: { id: this.data.project.id, changes: { name, description, status } } 
        }));
      } else if (this.data.workspaceId) {
        this.store.dispatch(ProjectActions.createProject({ 
          workspaceId: this.data.workspaceId, 
          name, 
          description 
        }));
      }
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
