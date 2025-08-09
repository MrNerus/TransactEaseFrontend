import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataTableComponent, ColumnDef, PageChange, SearchChange } from '../data-table/data-table';
import { CashbackSchemeService } from './cashback-scheme.service';

interface CashbackScheme {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

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

  cashbackSchemes = signal<CashbackScheme[]>([]);

  totalItems = signal(0);
  pageSize = signal(10);
  searchTerm = signal('');
  searchField = signal<keyof CashbackScheme | 'all'>('all');

  columns: ColumnDef[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'isActive', label: 'Active', isBoolean: true },
  ];

  constructor() {
    this.loadCashbackSchemes();
  }

  loadCashbackSchemes(): void {
    const result = this.cashbackSchemeService.getCashbackSchemes(
      this.searchTerm(),
      this.searchField(),
      1,
      this.pageSize()
    );
    this.cashbackSchemes.set(result.cashbackSchemes);
    this.totalItems.set(result.totalItems);
  }

  onSearchChange(searchChange: SearchChange): void {
    this.searchTerm.set(searchChange.searchTerm);
    this.searchField.set(searchChange.searchField as keyof CashbackScheme | 'all');
    this.loadCashbackSchemes();
  }

  onPageChange(pageChange: PageChange): void {
    this.pageSize.set(pageChange.pageSize);
    const result = this.cashbackSchemeService.getCashbackSchemes(
      this.searchTerm(),
      this.searchField(),
      pageChange.page,
      pageChange.pageSize
    );
    this.cashbackSchemes.set(result.cashbackSchemes);
    this.totalItems.set(result.totalItems);
  }

  addCashbackScheme(): void {
    this.router.navigate(['/cashback-schemes/add']);
  }

  editCashbackScheme(scheme: CashbackScheme): void {
    this.router.navigate(['/cashback-schemes/edit', scheme.id]);
  }

  viewCashbackScheme(scheme: CashbackScheme): void {
    this.router.navigate(['/cashback-schemes/view', scheme.id]);
  }

  deleteCashbackScheme(id: string): void {
    if (confirm(`Are you sure you want to delete scheme ${id}?`)) {
      this.cashbackSchemeService.deleteCashbackScheme(id);
      this.loadCashbackSchemes();
    }
  }
}
