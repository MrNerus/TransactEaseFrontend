import { Permission } from './../../users/user.interface';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../card.interface';
import { CardService } from '../card.service';
import { DataTableComponent, ColumnDef, PageChange, TableAction } from '../../data-table/data-table';
import { PermissionService } from '../../services/permission.service';

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
  permissionService = inject(PermissionService);

  cards = signal<Card[]>([]);
  totalItems = signal(0);
  pageSize = signal(10);

  columns: ColumnDef[] = [
    { key: 'cardNumber', label: 'Card Number' },
    { key: 'cardType', label: 'Card Type' },
    { key: 'status', label: 'Status' },
    { key: 'organizationId', label: 'Organization ID' },
    { key: 'userId', label: 'User ID' },
    { key: 'issueDate', label: 'Issue Date', isDate: true },
    { key: 'expiryDate', label: 'Expiry Date', isDate: true },
  ];

  actions: TableAction[] = [
    { type: 'add', label: 'Add', icon: 'add', placement: 'global', permission: this.permissionService.getPermission('cards_add') },
    { type: 'transfer', label: 'View', icon: 'visibility', placement: 'row', permission: this.permissionService.getPermission('cards_edit') },
    { type: 'assign', label: 'Edit', icon: 'edit', placement: 'row', permission: this.permissionService.getPermission('cards_edit') },
    { type: 'view', label: 'Delete', icon: 'visibility', placement: 'row', permission: this.permissionService.getPermission('cards_view') }
  ];


  constructor() {
    this.loadCards();
  }

  loadCards(page: number = 1): void {
    const { cards, totalItems } = this.cardService.getCards(page, this.pageSize());
    this.cards.set(cards);
    this.totalItems.set(totalItems);
  }

  onPageChange(pageChange: PageChange): void {
    this.pageSize.set(pageChange.pageSize);
    this.loadCards(pageChange.page);
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
        
    }
  }
}