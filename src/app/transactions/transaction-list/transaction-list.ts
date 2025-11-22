import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataTableComponent, Controls, PageChange, SearchChange, TableAction } from '../../data-table/data-table';
import { PermissionService } from '../../services/permission.service';
import { Transaction } from '../transaction.interface';
import { TransactionService } from '../transaction.service';
import { SchemaService } from '../../services/schema.service';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DataTableComponent]
})
export class TransactionList {
  private transactionService = inject(TransactionService);
  private schemaService = inject(SchemaService);
  private router = inject(Router);
  private permissionService = inject(PermissionService);

  transactions = signal<Transaction[]>([]);
  totalItems = signal(0);
  pageSize = signal(20);
  searchTerm = signal('');
  searchField = signal<keyof Transaction | 'all'>('all');

  controls = signal<Controls>({ columns: [], searchableFields: [] });

  actions: TableAction[] = [
    { type: 'add', label: 'Add', icon: 'add', placement: 'global', permission: this.permissionService.getPermission('transaction_add') },
    { type: 'view', label: 'View', icon: 'visibility', placement: 'row', permission: this.permissionService.getPermission('user_view') },
  ];

  constructor() {
    this.loadSchema();
    this.loadTransactions();
  }

  loadSchema(): void {
    this.schemaService.getTableSchema('transactions').subscribe(schema => {
      this.controls.set(schema);
    });
  }

  loadTransactions(): void {
    const result = this.transactionService.getTransactions(
      this.searchTerm(),
      this.searchField(),
      1,
      this.pageSize()
    );
    this.transactions.set(result.transactions);
    this.totalItems.set(result.totalItems);
  }

  onSearchChange(searchChange: SearchChange): void {
    this.searchTerm.set(searchChange.searchTerm);
    this.searchField.set(searchChange.searchField as keyof Transaction | 'all');
    this.loadTransactions();
  }

  onPageChange(pageChange: PageChange): void {
    const result = this.transactionService.getTransactions(
      this.searchTerm(),
      this.searchField(),
      pageChange.page,
      pageChange.pageSize
    );
    this.transactions.set(result.transactions);
    this.totalItems.set(result.totalItems);
  }

  onTableAction(e: { type: string, row?: Transaction }) {
    switch (e.type) {
      case 'add':
        this.router.navigate(['/transactions/add']);
        break;

      case 'view':
        if (!(e.row)) break;
        this.router.navigate(['/transactions/view', e.row.id]);
        break;
    }
  }
}