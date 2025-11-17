import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../organization.service';
import { Organization } from '../organization.interface';
import { Router } from '@angular/router';
import { DataTableComponent, Controls, PageChange, SearchChange, TableAction } from '../../data-table/data-table';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.html',
  styleUrls: ['./organization-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DataTableComponent]
})
export class OrganizationListComponent {
  private organizationService = inject(OrganizationService);
  private router = inject(Router);
  private permissionService = inject(PermissionService);

  organizations = signal<Organization[]>([]);
  totalItems = signal(0);
  pageSize = signal(20);
  searchTerm = signal('');
  searchField = signal<keyof Organization | 'all'>('all');

  controls: Controls = {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'parentId', label: 'Parent ID' },
      { key: 'createdAt', label: 'Created At', isDate: true },
    ],
    searchableFields: ['id', 'name', 'parentId']
  };

  actions: TableAction[] = [
    { type: 'add', label: 'Add', icon: 'add', placement: 'global', permission: this.permissionService.getPermission('organization_add') },
    { type: 'view', label: 'View', icon: 'visibility', placement: 'row', permission: this.permissionService.getPermission('organization_view') },
    { type: 'edit', label: 'Edit', icon: 'edit', placement: 'row', permission: this.permissionService.getPermission('organization_edit') },
    { type: 'delete', label: 'Delete', icon: 'delete', placement: 'row', permission: this.permissionService.getPermission('organization_delete') }
  ];

  constructor() {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    const result = this.organizationService.getOrganizations(
      this.searchTerm(),
      this.searchField(),
      1,
      this.pageSize()
    );
    this.organizations.set(result.organizations);
    this.totalItems.set(result.totalItems);
  }

  onSearchChange(searchChange: SearchChange): void {
    this.searchTerm.set(searchChange.searchTerm);
    this.searchField.set(searchChange.searchField as keyof Organization | 'all');
    this.loadOrganizations();
  }

  onPageChange(pageChange: PageChange): void {
    const result = this.organizationService.getOrganizations(
      this.searchTerm(),
      this.searchField(),
      pageChange.page,
      pageChange.pageSize
    );
    this.organizations.set(result.organizations);
    this.totalItems.set(result.totalItems);
  }

  deleteOrganization(id: string): void {
    if (confirm(`Are you sure you want to delete organization ${id}?`)) {
      this.organizationService.deleteOrganization(id);
      this.loadOrganizations();
    }
  }

    onTableAction(e: { type: string, row?: Organization }) {
    switch (e.type) {
      case 'add':
        this.router.navigate(['/organizations/add']);
        break;

      case 'view':
        if (!(e.row)) break;
        this.router.navigate(['/organizations/view', e.row.id]);
        break;
        
      case 'edit':
        if (!(e.row)) break;
        this.router.navigate(['/organizations/edit', e.row.id]);
        break;
        
      case 'delete':
        if (!(e.row)) break;
        this.deleteOrganization(e.row.id);
        break;
    }
  }
}