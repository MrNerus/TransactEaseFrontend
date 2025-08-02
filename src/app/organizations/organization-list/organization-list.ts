import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from '../organization.service';
import { Organization } from '../organization.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.html',
  styleUrls: ['./organization-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, DatePipe]
})
export class OrganizationListComponent {
  private organizationService = inject(OrganizationService);
  private router = inject(Router);

  organizations = signal<Organization[]>([]);
  searchTerm = signal('');
  searchField = signal<keyof Organization | 'all'>('all');
  currentPage = signal(1);
  pageSize = signal(20); // Default page size set to 20
  pageSizeOptions = [5, 10, 20, 50];
  totalItems = signal(0);
  pageInput = signal(1);

  totalPages = computed(() => Math.ceil(this.totalItems() / this.pageSize()));

  constructor() {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    const result = this.organizationService.getOrganizations(
      this.searchTerm(),
      this.searchField(),
      this.currentPage(),
      this.pageSize()
    );
    this.organizations.set(result.organizations);
    this.totalItems.set(result.totalItems);
    this.pageInput.set(this.currentPage());
  }

  onSearchChange(): void {
    this.currentPage.set(1);
    this.loadOrganizations();
  }

  onSearchFieldChange(): void {
    this.currentPage.set(1);
    this.loadOrganizations();
  }

  onPageSizeChange(): void {
    this.currentPage.set(1);
    this.loadOrganizations();
  }

  goToPage(): void {
    const page = this.pageInput();
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.loadOrganizations();
    } else {
      this.pageInput.set(this.currentPage());
    }
  }

  firstPage(): void {
    if (this.currentPage() !== 1) {
      this.currentPage.set(1);
      this.loadOrganizations();
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.loadOrganizations();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
      this.loadOrganizations();
    }
  }

  lastPage(): void {
    if (this.currentPage() !== this.totalPages()) {
      this.currentPage.set(this.totalPages());
      this.loadOrganizations();
    }
  }

  addOrganization(): void {
    this.router.navigate(['/organizations/add']);
  }

  editOrganization(org: Organization): void {
    this.router.navigate(['/organizations/edit', org.id]);
  }

  deleteOrganization(id: string): void {
    if (confirm(`Are you sure you want to delete organization ${id}?`)) {
      this.organizationService.deleteOrganization(id);
      this.loadOrganizations();
    }
  }
}