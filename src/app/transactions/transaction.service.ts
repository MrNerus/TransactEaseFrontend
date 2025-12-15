import { Injectable, signal, inject } from '@angular/core';
import { Transaction } from './transaction.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { APP_CONSTANTS } from '../config/app.constants';
import { ApiResponse, PaginatedData } from '../shared/api-response.interface';
import { FilterPayload } from '../data-table/filter.interface';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private http = inject(HttpClient);
  private transactions = signal<Transaction[]>([
    {
      id: 'txn1',
      amount: 100,
      date: new Date().toISOString(),
      status: 'completed',
      type: 'debit',
      cardId: '1234-5678-9012-3456',
      merchantName: 'Amazon'
    },
    {
      id: 'txn2',
      amount: 50,
      date: new Date().toISOString(),
      status: 'pending',
      type: 'credit',
      cardId: '1234-5678-9012-3456',
      merchantName: 'Starbucks'
    }
  ]);

  getTransactions(
    searchTerm: string = '',
    searchField: keyof Transaction | 'all' = 'all',
    page: number = 1,
    pageSize: number = 10,
    filter: FilterPayload | null = null
  ): Observable<{
    transactions: Transaction[];
    totalItems: number;
  }> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.get<ApiResponse<PaginatedData<any>>>(`${APP_CONSTANTS.API_URL}/api/transactions/get-all`).pipe(
        map(response => {
          const transactions = response.data.data.map((item: any) => ({
            id: item.transactionId, // Map transactionId to id
            amount: item.amount,
            date: item.date,
            status: item.status,
            type: item.type,
            cardId: item.cardId,
            merchantName: item.merchantName
          }));
          const totalItems = (response.data as any).totalCount || response.data.totalItems || 0;
          return { transactions, totalItems };
        })
      );
    } else {
      let filtered = this.transactions();

      // Apply Advanced Filters (Simplified logic for mock)
      if (filter && filter.conditions.length > 0) {
        filtered = filtered.filter(item => {
          // ... existing filter logic or simplified ...
          return true;
        });
      }

      if (searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(transaction => {
          if (searchField === 'all') {
            return Object.values(transaction).some(value =>
              String(value).toLowerCase().includes(searchTerm)
            );
          } else {
            const value = transaction[searchField];
            return String(value).toLowerCase().includes(searchTerm);
          }
        });
      }

      const totalItems = filtered.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);
      const paginated = filtered.slice(startIndex, endIndex);

      return of({ transactions: paginated, totalItems });
    }
  }

  getTransactionById(id: string): Observable<Transaction | undefined> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.get<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/transactions/get/${id}`).pipe(
        map(response => ({
          id: response.data.transactionId,
          amount: response.data.amount,
          date: response.data.date,
          status: response.data.status,
          type: response.data.type,
          cardId: response.data.cardId,
          merchantName: response.data.merchantName
        }))
      );
    }
    return of(this.transactions().find(transaction => transaction.id === id));
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'date'>): Observable<Transaction | void> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.post<Transaction>(`${APP_CONSTANTS.API_URL}/api/transactions/create`, transaction);
    } else {
      const newTransaction: Transaction = {
        id: 'txn' + (this.transactions().length + 1),
        date: new Date().toISOString(),
        ...transaction,
      };
      this.transactions.update(transactions => [...transactions, newTransaction]);
      return of(newTransaction);
    }
  }
}
