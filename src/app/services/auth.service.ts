import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);

  login(username: string) {
    if (username.toLowerCase() === 'staff') {
      localStorage.setItem('user', JSON.stringify({ username, role: 'staff', organization: 'org2' }));
    } else {
      localStorage.setItem('user', JSON.stringify({ username, role: 'admin', organization: 'org1' }));
    }
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return !!localStorage.getItem('user');
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
