import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const { feature, action } = route.data?.['permission'] || {};
    if (feature && action && !permissionService.hasPermission(feature, action)) {
      router.navigate(['/dashboard']); // Or a dedicated 'unauthorized' page
      return false;
    }
    return true;
  }

  router.navigate(['/login']);
  return false;
};