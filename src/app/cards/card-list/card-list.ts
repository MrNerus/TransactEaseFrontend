import { Permission } from './../../users/user.interface';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../card.interface';
import { CardService } from '../card.service';
import { DataTableComponent, Controls, PageChange, SearchChange, TableAction } from '../../data-table/data-table';
import { PermissionService } from '../../services/permission.service';
import { SchemaService } from '../../services/schema.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.html',
  styleUrls: ['./card-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DataTableComponent]
})
export class CardListComponent {
  private router = inject(Router);
  private cardService = inject(CardService);
  private schemaService = inject(SchemaService);
  permissionService = inject(PermissionService);

  cards = signal<Card[]>([]);
  totalItems = signal(0);
  pageSize = signal(10);
  searchTerm = signal('');
  searchField = signal('all');

  controls = signal<Controls>({ columns: [], searchableFields: [] });

  actions: TableAction[] = [
    { type: 'add', label: 'Add', icon: 'add', placement: 'global', permission: this.permissionService.getPermission('cards_add') },
    { type: 'transfer', label: 'Transfer', icon: 'swap_horiz', placement: 'row', permission: this.permissionService.getPermission('cards_edit') },
    { type: 'assign', label: 'Assign', icon: 'person_add', placement: 'row', permission: this.permissionService.getPermission('cards_edit') },
    { type: 'edit', label: 'Edit', icon: 'edit', placement: 'row', permission: this.permissionService.getPermission('cards_edit') },
    { type: 'view', label: 'View', icon: 'visibility', placement: 'row', permission: this.permissionService.getPermission('cards_view') }
  ];

  constructor() {
    this.loadSchema();
    this.loadCards();
  }

  loadSchema(): void {
    this.schemaService.getTableSchema('cards').subscribe(schema => {
      this.controls.set(schema);
    });
  }

  loadCards(page: number = 1): void {
    this.cardService.getCards(page, this.pageSize()).subscribe(result => {
      this.cards.set(result.cards);
      this.totalItems.set(result.totalItems);
    });
  }

  onPageChange(pageChange: PageChange): void {
    this.pageSize.set(pageChange.pageSize);
    this.loadCards(pageChange.page);
  }

  onSearchChange(searchChange: SearchChange): void {
    this.searchTerm.set(searchChange.searchTerm);
    this.searchField.set(searchChange.searchField);
    // Implement search logic in service if needed, currently just reloading
    this.loadCards(1);
  }

  onTableAction(e: { type: string, row?: Card }) {
    switch (e.type) {
      case 'add':
        this.router.navigate(['/cards/add']);
        break;
      case 'transfer':
        if (!(e.row)) break;
        this.router.navigate(['/cards/transfer', e.row.id]);
        break;
      case 'assign':
        if (!(e.row)) break;
        this.router.navigate(['/cards/assign', e.row.id]);
        break;

      case 'view':
        if (!(e.row)) break;
        this.router.navigate(['/cards/view', e.row.id]);
        break;

      case 'edit':
        if (!(e.row)) break;
        this.router.navigate(['/cards/edit', e.row.id]);
        break;

    }
  }
}