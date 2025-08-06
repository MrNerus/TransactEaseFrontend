import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationService } from '../organization.service';
import { Organization } from '../organization.interface';
import { Router } from '@angular/router';
import { DataTableComponent, Controls, PageChange, SearchChange } from '../../data-table/data-table';

import { AuthService } from '../../services/auth.service';

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
  private authService = inject(AuthService);

  organizations = signal<Organization[]>([]);
  totalItems = signal(0);
  pageSize = signal(20);
  searchTerm = signal('');
  searchField = signal<keyof Organization | 'all'>('all');
  canAdd = signal(false);
  canEdit = signal(false);
  canDelete = signal(false);
  canView = signal(false);

  controls: Controls = {
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Name' },
      { key: 'parentId', label: 'Parent ID' },
      { key: 'createdAt', label: 'Created At', isDate: true },
    ],
    searchableFields: ['id', 'name', 'parentId']
  };

  constructor() {
    this.loadOrganizations();
    const userRole = this.authService.getUser()?.role;
    this.canAdd.set(userRole === 'admin');
    this.canEdit.set(userRole === 'admin');
    this.canDelete.set(userRole === 'admin');
    this.canView.set(userRole === 'admin');
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

  addOrganization(): void {
    this.router.navigate(['/organizations/add']);
  }

  editOrganization(org: Organization): void {
    this.router.navigate(['/organizations/edit', org.id]);
  }

  viewOrganization(org: Organization): void {
    this.router.navigate(['/organizations/view', org.id]);
  }

  deleteOrganization(id: string): void {
    if (confirm(`Are you sure you want to delete organization ${id}?`)) {
      this.organizationService.deleteOrganization(id);
      this.loadOrganizations();
    }
  }
}
