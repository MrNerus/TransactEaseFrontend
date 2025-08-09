import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../staff.service';
import { Staff } from '../staff.interface';
import { Router } from '@angular/router';
import { DataTableComponent, Controls, PageChange, SearchChange } from '../../data-table/data-table';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.html',
  styleUrls: ['./staff-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DataTableComponent]
})
export class StaffListComponent {
  private staffService = inject(StaffService);
  private router = inject(Router);
  private permissionService = inject(PermissionService);

  staffs = signal<Staff[]>([]);
  totalItems = signal(0);
  pageSize = signal(20);
  searchTerm = signal('');
  searchField = signal<keyof Staff | 'all'>('all');
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
    this.loadStaffs();
    this.canAdd.set(this.permissionService.hasPermission('staffs', 'canAdd'));
    this.canEdit.set(this.permissionService.hasPermission('staffs', 'canEdit'));
    this.canDelete.set(this.permissionService.hasPermission('staffs', 'canDelete'));
    this.canView.set(this.permissionService.hasPermission('staffs', 'canView'));
  }

  loadStaffs(): void {
    const result = this.staffService.getStaffs(
      this.searchTerm(),
      this.searchField(),
      1,
      this.pageSize()
    );
    this.staffs.set(result.staffs);
    this.totalItems.set(result.totalItems);
  }

  onSearchChange(searchChange: SearchChange): void {
    this.searchTerm.set(searchChange.searchTerm);
    this.searchField.set(searchChange.searchField as keyof Staff | 'all');
    this.loadStaffs();
  }

  onPageChange(pageChange: PageChange): void {
    const result = this.staffService.getStaffs(
      this.searchTerm(),
      this.searchField(),
      pageChange.page,
      pageChange.pageSize
    );
    this.staffs.set(result.staffs);
    this.totalItems.set(result.totalItems);
  }

  addStaff(): void {
    this.router.navigate(['/staffs/add']);
  }

  editStaff(staff: Staff): void {
    this.router.navigate(['/staffs/edit', staff.id]);
  }

  viewStaff(staff: Staff): void {
    this.router.navigate(['/staffs/view', staff.id]);
  }

  deleteStaff(id: string): void {
    if (confirm(`Are you sure you want to delete staff ${id}?`)) {
      this.staffService.deleteStaff(id);
      this.loadStaffs();
    }
  }
}