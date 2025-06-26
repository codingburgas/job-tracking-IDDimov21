import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const RoleGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];
  const user = authService.getCurrentUser();

  if (user && requiredRoles.includes(user.role)) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};