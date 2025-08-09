import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../card.interface';
import { CardService } from '../card.service';
import { DataTableComponent, ColumnDef, PageChange } from '../../data-table/data-table';
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
  private permissionService = inject(PermissionService);

  cards = signal<Card[]>([]);
  totalItems = signal(0);
  pageSize = signal(10);
  canAdd = signal(false);
  canEdit = signal(false);
  canDelete = signal(false);
  canView = signal(false);

  columns: ColumnDef[] = [
    { key: 'cardNumber', label: 'Card Number' },
    { key: 'cardType', label: 'Card Type' },
    { key: 'status', label: 'Status' },
    { key: 'organizationId', label: 'Organization ID' },
    { key: 'userId', label: 'User ID' },
    { key: 'issueDate', label: 'Issue Date', isDate: true },
    { key: 'expiryDate', label: 'Expiry Date', isDate: true },
  ];

  constructor() {
    this.loadCards();
    this.canAdd.set(this.permissionService.hasPermission('cards', 'canAdd'));
    this.canEdit.set(this.permissionService.hasPermission('cards', 'canEdit'));
    this.canDelete.set(this.permissionService.hasPermission('cards', 'canDelete'));
    this.canView.set(this.permissionService.hasPermission('cards', 'canView'));
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

  addCard(): void {
    this.router.navigate(['/cards/add']);
  }

  transferCards(): void {
    this.router.navigate(['/cards/transfer']);
  }

  assignCard(card: Card): void {
    this.router.navigate(['/cards/assign', card.id]);
  }

  viewCard(card: Card): void {
    this.router.navigate(['/cards/view', card.id]);
  }
}