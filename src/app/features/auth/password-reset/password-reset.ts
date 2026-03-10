import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { passwordStrengthValidator } from '../../../core/validators/password-strength.validator';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatStepperModule,
    RouterModule
  ],
  template: `
    <div class="reset-container">
      <mat-card class="reset-card">
        <mat-card-header>
          <mat-card-title>Reset Password</mat-card-title>
          <mat-card-subtitle>Recover access to your account</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-stepper [linear]="true" #stepper>
            <!-- Step 1: Request -->
            <mat-step [stepControl]="requestForm">
              <form [formGroup]="requestForm">
                <ng-template matStepLabel>Request</ng-template>
                <p>Enter your email and we'll send you an OTP code.</p>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="Enter your email" required>
                  <mat-error *ngIf="requestForm.get('email')?.hasError('required')">Email is required</mat-error>
                  <mat-error *ngIf="requestForm.get('email')?.hasError('email')">Invalid email address</mat-error>
                </mat-form-field>

                <div class="stepper-actions">
                  <button mat-raised-button color="primary" (click)="onRequestReset(stepper)" [disabled]="requestForm.invalid || isLoading">
                    <span *ngIf="!isLoading">Send OTP</span>
                    <span *ngIf="isLoading">Sending...</span>
                  </button>
                </div>
              </form>
            </mat-step>

            <!-- Step 2: New Password -->
            <mat-step [stepControl]="resetForm">
              <form [formGroup]="resetForm">
                <ng-template matStepLabel>New Password</ng-template>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>OTP Code</mat-label>
                  <input matInput formControlName="otp" placeholder="Enter 6-digit OTP" required maxlength="6">
                  <mat-error *ngIf="resetForm.get('otp')?.hasError('required')">OTP is required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>New Password</mat-label>
                  <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Create new password" required>
                  <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                    <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                  <mat-error *ngIf="resetForm.get('password')?.hasError('required')">Password is required</mat-error>
                  <mat-error *ngIf="resetForm.get('password')?.hasError('passwordStrength')">Password too weak</mat-error>
                </mat-form-field>

                <div class="stepper-actions">
                  <button mat-button matStepperPrevious>Back</button>
                  <button mat-raised-button color="primary" (click)="onResetPassword()" [disabled]="resetForm.invalid || isLoading">
                    <span *ngIf="!isLoading">Reset Password</span>
                    <span *ngIf="isLoading">Resetting...</span>
                  </button>
                </div>
              </form>
            </mat-step>
          </mat-stepper>
        </mat-card-content>
        <mat-card-footer class="reset-footer">
          <p>Remembered your password? <a routerLink="/auth/login">Sign In</a></p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: `
    .reset-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f5f5;
    }
    .reset-card {
      width: 450px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .stepper-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }
    .reset-footer {
      text-align: center;
      padding: 20px;
    }
  `
})
export class PasswordResetComponent {
  requestForm: FormGroup;
  resetForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetForm = this.fb.group({
      otp: ['', [Validators.required]],
      password: ['', [Validators.required, passwordStrengthValidator()]]
    });
  }

  onRequestReset(stepper: any): void {
    if (this.requestForm.valid) {
      this.isLoading = true;
      const { email } = this.requestForm.value;
      
      this.authService.resetPasswordRequest(email).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('OTP sent to your email!', 'Close', { duration: 3000 });
          stepper.next();
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open(err.message || 'Failed to send OTP', 'Close', { duration: 5000 });
        }
      });
    }
  }

  onResetPassword(): void {
    if (this.resetForm.valid) {
      this.isLoading = true;
      const resetData = {
        email: this.requestForm.value.email,
        ...this.resetForm.value
      };

      this.authService.resetPassword(resetData).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Password reset successful! Please login.', 'Close', { duration: 3000 });
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open(err.message || 'Password reset failed', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
