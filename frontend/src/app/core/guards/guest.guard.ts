import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth.service';

/**
 * Guest guard to redirect authenticated users away from login/register pages
 * Redirects to home page if user is already authenticated
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Redirect to home page
  return router.createUrlTree(['/']);
};
