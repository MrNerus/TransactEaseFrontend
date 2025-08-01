import { Injectable } from '@angular/core';
import { of } from 'rxjs';

export interface NavItem {
  label: string;
  icon?: string;
  link?: string;
  children?: NavItem[];
}

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', link: '/dashboard' },
    {
      label: 'Transactions',
      icon: 'receipt_long',
      children: [
        { label: 'View All', link: '/transactions' },
        { label: 'New Transaction', link: '/transactions/new' },
      ],
    },
    {
      label: 'Accounts',
      icon: 'account_balance_wallet',
      children: [
        { label: 'Checking', link: '/accounts/checking' },
        { label: 'Savings', link: '/accounts/savings' },
      ],
    },
    {
      label: 'Documents',
      icon: 'folder',
      children: [
        { label: 'View Documents', link: '/documents' },
        { label: 'Upload Document', link: '/documents/upload' },
      ],
    },
    { label: 'Profile', icon: 'person', link: '/profile' },
  ];

  getNavItems() {
    return of(this.navItems);
  }
}
