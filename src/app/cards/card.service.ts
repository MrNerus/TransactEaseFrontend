import { Injectable, signal } from '@angular/core';
import { Card } from './card.interface';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cards = signal<Card[]>([
  {
    "id": "card001",
    "cardNumber": "1234-5678-9012-3456",
    "cardType": "debit",
    "status": "active",
    "organizationId": "org001",
    "userId": "user001",
    "issueDate": new Date("2023-01-01T00:00:00Z"),
    "expiryDate": new Date("2026-01-01T00:00:00Z")
  },
  {
    "id": "card002",
    "cardNumber": "2345-6789-0123-4567",
    "cardType": "credit",
    "status": "inactive",
    "organizationId": "org002",
    "userId": "user002",
    "issueDate": new Date("2022-05-15T00:00:00Z"),
    "expiryDate": new Date("2025-05-15T00:00:00Z")
  },
  {
    "id": "card003",
    "cardNumber": "3456-7890-1234-5678",
    "cardType": "debit",
    "status": "expired",
    "organizationId": "org003",
    "issueDate": new Date("2019-07-01T00:00:00Z"),
    "expiryDate": new Date("2022-07-01T00:00:00Z")
  },
  {
    "id": "card004",
    "cardNumber": "4567-8901-2345-6789",
    "cardType": "credit",
    "status": "active",
    "organizationId": "org004",
    "userId": "user004",
    "issueDate": new Date("2024-02-20T00:00:00Z"),
    "expiryDate": new Date("2027-02-20T00:00:00Z")
  },
  {
    "id": "card005",
    "cardNumber": "5678-9012-3456-7890",
    "cardType": "debit",
    "status": "inactive",
    "issueDate": new Date("2023-08-01T00:00:00Z"),
    "expiryDate": new Date("2026-08-01T00:00:00Z")
  },
  {
    "id": "card006",
    "cardNumber": "6789-0123-4567-8901",
    "cardType": "credit",
    "status": "active",
    "organizationId": "org005",
    "issueDate": new Date("2023-09-01T00:00:00Z"),
    "expiryDate": new Date("2026-09-01T00:00:00Z")
  },
  {
    "id": "card007",
    "cardNumber": "7890-1234-5678-9012",
    "cardType": "debit",
    "status": "expired",
    "organizationId": "org006",
    "userId": "user006",
    "issueDate": new Date("2020-04-10T00:00:00Z"),
    "expiryDate":new Date("2023-04-10T00:00:00Z")
  },
  {
    "id": "card008",
    "cardNumber": "8901-2345-6789-0123",
    "cardType": "credit",
    "status": "active",
    "organizationId": "org007",
    "issueDate": new Date("2024-01-01T00:00:00Z"),
    "expiryDate": new Date("2027-01-01T00:00:00Z")
  },
  {
    "id": "card009",
    "cardNumber": "9012-3456-7890-1234",
    "cardType": "debit",
    "status": "inactive",
    "organizationId": "org008",
    "userId": "user008",
    "issueDate": new Date("2023-03-01T00:00:00Z"),
    "expiryDate": new Date("2026-03-01T00:00:00Z")
  },
  {
    "id": "card010",
    "cardNumber": "0123-4567-8901-2345",
    "cardType": "credit",
    "status": "expired",
    "issueDate": new Date("2020-12-01T00:00:00Z"),
    "expiryDate": new Date("2023-12-01T00:00:00Z")
  }
]
);

  addCards(newCards: Omit<Card, 'id'>[]): void {
    const createdCards: Card[] = newCards.map(card => ({
      ...card,
      id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    }));
    this.cards.update(currentCards => [...currentCards, ...createdCards]);
  }

  getCards(page: number = 1, pageSize: number = 10): { cards: Card[], totalItems: number } {
    const allCards = this.cards();
    const totalItems = allCards.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedCards = allCards.slice(startIndex, endIndex);
    return { cards: paginatedCards, totalItems };
  }

  transferCards(cardIds: string[], organizationId: string): void {
    this.cards.update(cards =>
      cards.map(card =>
        cardIds.includes(card.id) ? { ...card, organizationId } : card
      )
    );
  }

  assignCard(cardId: string, userId: string): void {
    this.cards.update(cards =>
      cards.map(card =>
        card.id === cardId ? { ...card, userId, status: 'active' } : card
      )
    );
  }

  getCardById(id: string): Card | undefined {
    return this.cards().find(card => card.id === id);
  }

  revokeCard(cardId: string): void {
    this.cards.update(cards =>
      cards.map(card =>
        card.id === cardId ? { ...card, userId: undefined, status: 'inactive' } : card
      )
    );
  }

  updateCardStatus(cardId: string, status: 'active' | 'inactive' | 'expired'): void {
    this.cards.update(cards =>
      cards.map(card =>
        card.id === cardId ? { ...card, status } : card
      )
    );
  }
}
