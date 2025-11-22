import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { User } from '../user.interface';
import { Router } from '@angular/router';
import { DataTableComponent, Controls, PageChange, SearchChange, TableAction } from '../../data-table/data-table';
import { PermissionService } from '../../services/permission.service';
import { SchemaService } from '../../services/schema.service';

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
  private permissionService = inject(PermissionService);
  private schemaService = inject(SchemaService);

  users = signal<User[]>([]);
  controls = signal<Controls>({ columns: [], searchableFields: [] });
  totalItems = signal(0);
  pageSize = signal(20);
  searchTerm = signal('');
  searchField = signal<keyof User | 'all'>('all');

  actions: TableAction[] = [
    { type: 'add', label: 'Add', icon: 'add', placement: 'global', permission: this.permissionService.getPermission('user_add') },
    { type: 'view', label: 'View', icon: 'visibility', placement: 'row', permission: this.permissionService.getPermission('user_view') },
    { type: 'edit', label: 'Edit', icon: 'edit', placement: 'row', permission: this.permissionService.getPermission('user_edit') },
    { type: 'delete', label: 'Delete', icon: 'delete', placement: 'row', permission: this.permissionService.getPermission('user_delete') }
  ];

  constructor() {
    this.schemaService.getTableSchema('users').subscribe(schema => {
      this.controls.set(schema);
    });
    this.loadUsers();
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

  deleteUser(id: string): void {
    if (confirm(`Are you sure you want to delete user ${id}?`)) {
      this.userService.deleteUser(id);
      this.loadUsers();
    }
  }
  onTableAction(e: { type: string, row?: User }) {
    switch (e.type) {
      case 'add':
        this.router.navigate(['/users/add']);
        break;

      case 'view':
        if (!(e.row)) break;
        this.router.navigate(['/users/view', e.row.id]);
        break;

      case 'edit':
        if (!(e.row)) break;
        this.router.navigate(['/users/edit', e.row.id]);
        break;

      case 'delete':
        if (!(e.row)) break;
        this.deleteUser(e.row.id);
        break;
    }
  }
}