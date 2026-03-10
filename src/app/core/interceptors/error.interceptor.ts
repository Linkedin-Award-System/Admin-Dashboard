import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Handle unauthorized error (e.g., token expired)
        // In a real app, you might try to refresh the token here
        // or just logout the user
        authService.logout();
      }

      const errorMessage = error.error?.message || error.statusText || 'An unknown error occurred';
      return throwError(() => new Error(errorMessage));
    })
  );
};
