import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ROLES } from './permission.config';
import { Permission, User } from '../users/user.interface';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private authService = inject(AuthService);

  getPermission(permission: string): Permission {
    const user: User | undefined = this.authService.getUser();
    if (!user) return Permission.blocked;

    if (user.permissions && user.permissions[permission] && user.permissions[permission] !== undefined) {
      return user.permissions[permission];
    }

    const role = ROLES.find(r => r.name === user.role);
    if (!role) return Permission.blocked;

    return role.permissions[permission] ? role.permissions[permission] : Permission.blocked;
  }
}