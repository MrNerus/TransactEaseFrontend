import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../users/user.interface';
import { ROLES } from './permission.config';

const USERS: User[] = [
  {
    id: 'admin',
    fullName: 'User Admin',
    email: 'admin',
    organizationId: 'org001',
    role: 'admin',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'user002',
    fullName: 'user 002',
    email: 'transactease+user002@neruxin.com',
    organizationId: 'org002',
    role: 'basic',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'user003',
    fullName: 'user 003',
    email: 'transactease+user003@neruxin.com',
    organizationId: 'org003',
    role: 'basic',
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