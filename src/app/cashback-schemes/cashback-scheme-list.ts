import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataTableComponent, PageChange, SearchChange, TableAction, Controls } from '../data-table/data-table';
import { CashbackSchemeService } from './cashback-scheme.service';
import { PermissionService } from '../services/permission.service';
import { SchemaService } from '../services/schema.service';
import { CashbackScheme } from './cashback-scheme.interface';

@Component({
  selector: 'app-cashback-scheme-list',
  templateUrl: './cashback-scheme-list.html',
  styleUrls: ['./cashback-scheme-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DataTableComponent]
})
export class CashbackSchemeListComponent {
  private router = inject(Router);
  private cashbackSchemeService = inject(CashbackSchemeService);
  private permissionService = inject(PermissionService);
  private schemaService = inject(SchemaService);

  cashbackSchemes = signal<CashbackScheme[]>([]);
  controls = signal<Controls>({ columns: [], searchableFields: [] });

  totalItems = signal(0);
  pageSize = signal(10);
  searchTerm = signal('');
  searchField = signal<keyof CashbackScheme | 'all'>('all');

  actions: TableAction[] = [
    { type: 'add', label: 'Add', icon: 'add', placement: 'global', permission: this.permissionService.getPermission('cashbackScheme_add') },
    { type: 'view', label: 'View', icon: 'visibility', placement: 'row', permission: this.permissionService.getPermission('cashbackScheme_view') },
    { type: 'edit', label: 'Edit', icon: 'edit', placement: 'row', permission: this.permissionService.getPermission('cashbackScheme_edit') },
    { type: 'delete', label: 'Delete', icon: 'delete', placement: 'row', permission: this.permissionService.getPermission('cashbackScheme_delete') }
  ];

  constructor() {
    this.schemaService.getTableSchema('cashback-schemes').subscribe(schema => {
      this.controls.set(schema);
    });
    this.loadCashbackSchemes();
  }

  loadCashbackSchemes(): void {
    this.cashbackSchemeService.getCashbackSchemes(
      this.searchTerm(),
      this.searchField(),
      1,
      this.pageSize()
    ).subscribe(result => {
      this.cashbackSchemes.set(result.cashbackSchemes);
      this.totalItems.set(result.totalItems);
    });
  }

  onSearchChange(searchChange: SearchChange): void {
    this.searchTerm.set(searchChange.searchTerm);
    this.searchField.set(searchChange.searchField as keyof CashbackScheme | 'all');
    this.loadCashbackSchemes();
  }

  onPageChange(pageChange: PageChange): void {
    this.pageSize.set(pageChange.pageSize);
    this.cashbackSchemeService.getCashbackSchemes(
      this.searchTerm(),
      this.searchField(),
      pageChange.page,
      pageChange.pageSize
    ).subscribe(result => {
      this.cashbackSchemes.set(result.cashbackSchemes);
      this.totalItems.set(result.totalItems);
    });
  }

  deleteCashbackScheme(id: string): void {
    if (confirm(`Are you sure you want to delete scheme ${id}?`)) {
      this.cashbackSchemeService.deleteCashbackScheme(id).subscribe(() => {
        this.loadCashbackSchemes();
      });
    }
  }

  onTableAction(e: { type: string, row?: CashbackScheme }) {
    switch (e.type) {
      case 'add':
        this.router.navigate(['/cashback-schemes/add']);
        break;

      case 'view':
        if (!(e.row)) break;
        this.router.navigate(['/cashback-schemes/view', e.row.id]);
        break;

      case 'edit':
        if (!(e.row)) break;
        this.router.navigate(['/cashback-schemes/edit', e.row.id]);
        break;

      case 'delete':
        if (!(e.row)) break;
        this.deleteCashbackScheme(e.row.id);
        break;
    }
  }
}
