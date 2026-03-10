import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRole = route.data['role'];

  if (authService.isAuthenticated() && authService.hasRole(expectedRole)) {
    return true;
  }

  // Unauthorized, redirect to home or unauthorized page
  router.navigate(['/']);
  return false;
};
