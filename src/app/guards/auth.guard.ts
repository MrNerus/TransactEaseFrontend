import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionService } from '../services/permission.service';
import { Permission } from '../users/user.interface';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const authService = inject(AuthService);
  const permissionService = inject(PermissionService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    let permissionKey: string = route.data?.['permission'] || {};
    let permissionValue: Permission = permissionService.getPermission(permissionKey);
    if (permissionValue != Permission.allowInteraction) {
      router.navigate(['/dashboard']); // Or a dedicated 'unauthorized' page
      return false;
    }
    return true;
  }

  router.navigate(['/login']);
  return false;
};