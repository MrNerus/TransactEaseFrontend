import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../users/user.interface';
import { ROLES } from './permission.config';

const USERS: User[] = [
  {
    id: 'user001',
    fullName: 'Admin User',
    email: 'admin',
    organizationId: 'org001',
    role: ROLES.find(r => r.name === 'admin')!,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    permissions: {
      users: { canDelete: false, canEdit: true },
    },
  },
  {
    id: 'user002',
    fullName: 'Editor User',
    email: 'editor@transactease.com',
    organizationId: 'org002',
    role: ROLES.find(r => r.name === 'editor')!,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    permissions: {
      users: { canDelete: true },
    },
  },
  {
    id: 'user003',
    fullName: 'Viewer User',
    email: 'viewer@transactease.com',
    organizationId: 'org003',
    role: ROLES.find(r => r.name === 'viewer')!,
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private currentUser = signal<User | undefined>(undefined);

  login(email: string): boolean {
    const user = USERS.find(u => u.email === email);
    if (user) {
      this.currentUser.set(user);
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(undefined);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  getUser(): User | undefined {
    return this.currentUser();
  }
}