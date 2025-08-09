import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';
import { ROLES } from './permission.config';
import { Permission, User } from '../users/user.interface';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private authService = inject(AuthService);

  hasPermission(feature: string, action: keyof Permission): boolean {
    const user: User | undefined = this.authService.getUser();
    if (!user) return false;

    // 1. Check for user-specific permission override
    if (user.permissions && user.permissions[feature] && user.permissions[feature][action] !== undefined) {
      return user.permissions[feature][action]!;
    }

    // 2. Get permissions from role
    const role = ROLES.find(r => r.name === user.role.name);
    if (!role) return false;

    const rolePermission = role.permissions[feature] ? role.permissions[feature][action] : undefined;
    if (rolePermission !== undefined) {
      return rolePermission!;
    }

    // 3. Default to false if no permission is defined
    return false;
  }
}
