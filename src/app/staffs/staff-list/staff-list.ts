import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffService } from '../staff.service';
import { Staff } from '../staff.interface';
import { Router } from '@angular/router';
import { DataTableComponent, Controls, PageChange, SearchChange, TableAction } from '../../data-table/data-table';
import { PermissionService } from '../../services/permission.service';
import { SchemaService } from '../../services/schema.service';

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
  private schemaService = inject(SchemaService);

  staffs = signal<Staff[]>([]);
  controls = signal<Controls>({ columns: [], searchableFields: [] });
  totalItems = signal(0);
  pageSize = signal(20);
  searchTerm = signal('');
  searchField = signal<keyof Staff | 'all'>('all');

  actions: TableAction[] = [
    { type: 'add', label: 'Add', icon: 'add', placement: 'global', permission: this.permissionService.getPermission('staff_add') },
    { type: 'view', label: 'View', icon: 'visibility', placement: 'row', permission: this.permissionService.getPermission('staff_view') },
    { type: 'edit', label: 'Edit', icon: 'edit', placement: 'row', permission: this.permissionService.getPermission('staff_edit') },
    { type: 'delete', label: 'Delete', icon: 'delete', placement: 'row', permission: this.permissionService.getPermission('staff_delete') }
  ];

  constructor() {
    this.schemaService.getTableSchema('staffs').subscribe(schema => {
      this.controls.set(schema);
    });
    this.loadStaffs();
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

  deleteStaff(id: string): void {
    if (confirm(`Are you sure you want to delete staff ${id}?`)) {
      this.staffService.deleteStaff(id);
      this.loadStaffs();
    }
  }

  onTableAction(e: { type: string, row?: Staff }) {
    switch (e.type) {
      case 'add':
        this.router.navigate(['/staffs/add']);
        break;

      case 'view':
        if (!(e.row)) break;
        this.router.navigate(['/staffs/view', e.row.id]);
        break;

      case 'edit':
        if (!(e.row)) break;
        this.router.navigate(['/staffs/edit', e.row.id]);
        break;

      case 'delete':
        if (!(e.row)) break;
        this.deleteStaff(e.row.id);
        break;
    }
  }
}