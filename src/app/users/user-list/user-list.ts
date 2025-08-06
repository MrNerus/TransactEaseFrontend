import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { User } from '../user.interface';
import { Router } from '@angular/router';
import { DataTableComponent, Controls, PageChange, SearchChange } from '../../data-table/data-table';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styleUrls: ['./user-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DataTableComponent]
})
export class UserListComponent {
  private userService = inject(UserService);
  private router = inject(Router);
  private authService = inject(AuthService);

  users = signal<User[]>([]);
  totalItems = signal(0);
  pageSize = signal(20);
  searchTerm = signal('');
  searchField = signal<keyof User | 'all'>('all');
  canAdd = signal(false);
  canEdit = signal(false);
  canDelete = signal(false);
  canView = signal(false);

  controls: Controls = {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'fullName', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'organizationId', label: 'Organization ID' },
      { key: 'role', label: 'Role' },
      { key: 'isActive', label: 'Active', isBoolean: true },
      { key: 'createdAt', label: 'Created At', isDate: true },
    ],
    searchableFields: ['fullName', 'email', 'organizationId', 'role']
  };

  constructor() {
    this.loadUsers();
    const userRole = this.authService.getUser()?.role;
    this.canAdd.set(userRole === 'admin');
    this.canEdit.set(userRole === 'admin');
    this.canDelete.set(userRole === 'admin');
    this.canView.set(userRole === 'admin');
  }

  loadUsers(): void {
    const result = this.userService.getUsers(
      this.searchTerm(),
      this.searchField(),
      1,
      this.pageSize()
    );
    this.users.set(result.users);
    this.totalItems.set(result.totalItems);
  }

  onSearchChange(searchChange: SearchChange): void {
    this.searchTerm.set(searchChange.searchTerm);
    this.searchField.set(searchChange.searchField as keyof User | 'all');
    this.loadUsers();
  }

  onPageChange(pageChange: PageChange): void {
    const result = this.userService.getUsers(
      this.searchTerm(),
      this.searchField(),
      pageChange.page,
      pageChange.pageSize
    );
    this.users.set(result.users);
    this.totalItems.set(result.totalItems);
  }

  addUser(): void {
    this.router.navigate(['/users/add']);
  }

  editUser(user: User): void {
    this.router.navigate(['/users/edit', user.id]);
  }

  viewUser(user: User): void {
    this.router.navigate(['/users/view', user.id]);
  }

  deleteUser(id: string): void {
    if (confirm(`Are you sure you want to delete user ${id}?`)) {
      this.userService.deleteUser(id);
      this.loadUsers();
    }
  }
}
