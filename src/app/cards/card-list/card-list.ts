import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../card.interface';
import { CardService } from '../card.service';
import { DataTableComponent, ColumnDef, PageChange } from '../../data-table/data-table';

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

  addCard(): void {
    this.router.navigate(['/cards/add']);
  }

  transferCards(): void {
    this.router.navigate(['/cards/transfer']);
  }

  assignCard(card: Card): void {
    this.router.navigate(['/cards/assign', card.id]);
  }
}
