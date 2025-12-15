import { Injectable, signal, inject } from '@angular/core';
import { Card } from './card.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, forkJoin, switchMap } from 'rxjs';
import { APP_CONSTANTS } from '../config/app.constants';
import { ApiResponse, PaginatedData } from '../shared/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private http = inject(HttpClient);
  private cards = signal<Card[]>([
    {
      "id": "card001",
      "cardNumber": "1234-5678-9012-3456",
      "cardType": "debit",
      "status": "active",
      "organizationId": 1,
      "userId": 1,
      "issueDate": "2023-01-01T00:00:00Z",
      "expiryDate": "2026-01-01T00:00:00Z"
    },
    // ... (Mock data simplified for brevity, assume similar structure but with number IDs)
  ]);

  addCards(newCards: Omit<Card, 'id'>[]): Observable<Card[] | void> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      // api/cards/create accepts list of objects
      return this.http.post<Card[]>(`${APP_CONSTANTS.API_URL}/api/cards/create`, newCards);
    } else {
      const createdCards: Card[] = newCards.map(card => ({
        ...card,
        id: `card_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        organizationId: card.organizationId || 0,
        issueDate: card.issueDate || new Date().toISOString(),
        expiryDate: card.expiryDate || new Date().toISOString()
      }));
      this.cards.update(currentCards => [...currentCards, ...createdCards]);
      return of(createdCards);
    }
  }

  getCards(page: number = 1, pageSize: number = 10): Observable<{ cards: Card[], totalItems: number }> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.get<ApiResponse<PaginatedData<any>>>(`${APP_CONSTANTS.API_URL}/api/cards/get-all`).pipe(
        map(response => {
          const cards = response.data.data.map((item: any) => ({
            id: item.id || item.cardNumber,
            cardNumber: item.cardNumber,
            cardType: item.cardType,
            status: item.status,
            organizationId: item.organizationId,
            userId: item.userId,
            issueDate: item.issueDate,
            expiryDate: item.expiryDate,
            cvv: item.cvv
          }));
          const totalItems = (response.data as any).totalCount || response.data.totalItems || 0;
          return { cards, totalItems };
        })
      );
    } else {
      const allCards = this.cards();
      const totalItems = allCards.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);
      const paginatedCards = allCards.slice(startIndex, endIndex);
      return of({ cards: paginatedCards, totalItems });
    }
  }

  // Helper to update a single card (used by transfer, assign, etc.)
  private updateSingleCard(card: Card): Observable<Card> {
    return this.http.put<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/cards/update`, card).pipe(
      map(response => ({
        id: response.data.cardId || response.data.cardNumber, // Prioritize returned ID if any
        cardNumber: response.data.cardNumber,
        cardType: response.data.cardType,
        status: response.data.status,
        organizationId: response.data.organizationId,
        userId: response.data.userId,
        issueDate: response.data.issueDate,
        expiryDate: response.data.expiryDate
      }))
    );
  }

  transferCards(cardsToTransfer: Card, targetOrganizationId: number, cardNumber: string): Observable<Card | void> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      const updatedCard = { ...cardsToTransfer, organizationId: targetOrganizationId, cardNumber };
      return this.updateSingleCard(updatedCard);
    } else {
      const cardIds = cardsToTransfer.id;
      this.cards.update(cards =>
        cards.map(card =>
          cardIds.includes(card.id) ? { ...card, organizationId: targetOrganizationId } : card
        )
      );
      return of();
    }
  }

  assignCard(card: Card, userId: number, issueDate: string, expiryDate: string, cardNumber: string): Observable<Card | void> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      const updatedCard = { ...card, userId, status: 'active', issueDate, expiryDate, cardNumber };
      return this.updateSingleCard(updatedCard as Card);
    } else {
      this.cards.update(cards =>
        cards.map(c =>
          c.id === card.id ? { ...c, userId, status: 'active', issueDate, expiryDate } : c
        )
      );
      return of();
    }
  }

  getCardById(id: string): Observable<Card | undefined> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      // API uses cardNumber for get, assuming ID passed here IS the cardNumber or mapped to it properly
      return this.http.get<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/cards/get/${id}`).pipe(
        map(response => ({
          id: response.data.id || response.data.cardNumber,
          cardNumber: response.data.cardNumber,
          cardType: response.data.cardType,
          status: response.data.status,
          organizationId: response.data.organizationId,
          userId: response.data.userId,
          issueDate: response.data.issueDate,
          expiryDate: response.data.expiryDate,
          cvv: response.data.cvv
        }))
      );
    }
    return of(this.cards().find(card => card.id === id));
  }

  revokeCard(card: Card): Observable<Card | void> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      const updatedCard = { ...card, userId: undefined, status: 'inactive' };
      return this.updateSingleCard(updatedCard as Card);
    } else {
      this.cards.update(cards =>
        cards.map(c =>
          c.id === card.id ? { ...c, userId: undefined, status: 'inactive' } : c
        )
      );
      return of();
    }
  }

  updateCardStatus(card: Card, status: string): Observable<Card | void> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      const updatedCard = { ...card, status };
      return this.updateSingleCard(updatedCard as Card);
    } else {
      this.cards.update(cards =>
        cards.map(c =>
          c.id === card.id ? { ...c, status } : c
        )
      );
      return of();
    }
  }

  updateCard(updatedCard: Card): Observable<Card | void> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.updateSingleCard(updatedCard);
    } else {
      this.cards.update(cards =>
        cards.map(card =>
          card.id === updatedCard.id ? { ...card, ...updatedCard } : card
        )
      );
      return of();
    }
  }
}
