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
  selector: 'app-register',
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
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join the CreatorFlow community</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <mat-stepper [linear]="true" #stepper>
            <!-- Step 1: User Info -->
            <mat-step [stepControl]="registerForm">
              <form [formGroup]="registerForm">
                <ng-template matStepLabel>Basic Info</ng-template>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="name" placeholder="Enter your full name" required>
                  <mat-error *ngIf="registerForm.get('name')?.hasError('required')">Name is required</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="Enter your email" required>
                  <mat-error *ngIf="registerForm.get('email')?.hasError('required')">Email is required</mat-error>
                  <mat-error *ngIf="registerForm.get('email')?.hasError('email')">Invalid email address</mat-error>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Password</mat-label>
                  <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="Create a password" required>
                  <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                    <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                  </button>
                  <mat-error *ngIf="registerForm.get('password')?.hasError('required')">Password is required</mat-error>
                  <mat-error *ngIf="registerForm.get('password')?.hasError('passwordStrength')">Password must contain uppercase, lowercase, number and special character</mat-error>
                </mat-form-field>

                <div class="stepper-actions">
                  <button mat-raised-button color="primary" matStepperNext [disabled]="registerForm.invalid">Next</button>
                </div>
              </form>
            </mat-step>

            <!-- Step 2: OTP Verification -->
            <mat-step [stepControl]="otpForm">
              <form [formGroup]="otpForm">
                <ng-template matStepLabel>Verification</ng-template>
                <p>An OTP has been sent to your email. Please enter it below.</p>
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>OTP Code</mat-label>
                  <input matInput formControlName="otp" placeholder="Enter 6-digit OTP" required maxlength="6">
                  <mat-error *ngIf="otpForm.get('otp')?.hasError('required')">OTP is required</mat-error>
                </mat-form-field>

                <div class="stepper-actions">
                  <button mat-button matStepperPrevious>Back</button>
                  <button mat-raised-button color="primary" (click)="onRegister()" [disabled]="otpForm.invalid || isLoading">
                    <span *ngIf="!isLoading">Complete Registration</span>
                    <span *ngIf="isLoading">Verifying...</span>
                  </button>
                </div>
              </form>
            </mat-step>
          </mat-stepper>
        </mat-card-content>
        <mat-card-footer class="register-footer">
          <p>Already have an account? <a routerLink="/auth/login">Sign In</a></p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: `
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 20px;
    }
    .register-card {
      width: 500px;
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
    .register-footer {
      text-align: center;
      padding: 20px;
    }
    mat-card-header {
      margin-bottom: 20px;
      text-align: center;
    }
    mat-card-title {
      font-size: 24px;
      font-weight: bold;
    }
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  otpForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator()]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
    });
  }

  onRegister(): void {
    if (this.registerForm.valid && this.otpForm.valid) {
      this.isLoading = true;
      const registrationData = {
        ...this.registerForm.value,
        otp: this.otpForm.value.otp
      };

      this.authService.register(registrationData).subscribe({
        next: () => {
          this.isLoading = false;
          this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open(err.message || 'Registration failed', 'Close', { duration: 5000 });
        }
      });
    }
  }
}
