import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

interface MenuItem {
  label: string;
  icon?: string; // Material Icon name
  route?: string;
  children?: MenuItem[];
  isDropdown?: boolean; // New property to indicate dropdown
}

@Component({
  selector: 'app-nav',
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, CommonModule]
})
export class NavComponent {

  menuItems = signal<MenuItem[]>([
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Organizations', icon: 'apartment', route: '/organizations' },
    { label: 'Users', icon: 'people', route: '/users' },
    { label: 'Transactions', icon: 'paid', route: '/transactions' },
    { label: 'Cashback Schemes', icon: 'card_giftcard', route: '/cashback-schemes' },
    { label: 'Reports', icon: 'bar_chart', route: '/reports' },
    { label: 'Audit Logs', icon: 'receipt_long', route: '/audit-logs' },
    { label: 'Documents', icon: 'folder', isDropdown: true, children: [
      { label: 'View Documents', icon: 'search', route: '/dashboard/documents' },
      { label: 'Upload Document', icon: 'upload', route: '/dashboard/documents/upload' }
    ]},
    { label: 'Accounts', icon: 'account_balance_wallet', route: '/dashboard/accounts' },
    { label: 'Profile', icon: 'person', route: '/dashboard/profile' }
  ]);

  searchTerm = signal('');

  filteredMenuItems = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) {
      return this.menuItems();
    }

    const filterItems = (items: MenuItem[]): MenuItem[] => {
      return items.filter(item => {
        const matches = item.label.toLowerCase().includes(term);
        if (item.children) {
          item.children = filterItems(item.children);
          return matches || item.children.length > 0;
        }
        return matches;
      });
    };

    return filterItems(this.menuItems());
  });

  constructor(private router: Router) {}

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  logout() {
    // Add logout logic here
    this.router.navigate(['/login']);
  }

}
