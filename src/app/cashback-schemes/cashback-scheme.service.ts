import { Injectable, signal, inject } from '@angular/core';
import { CashbackScheme } from './cashback-scheme.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { APP_CONSTANTS } from '../config/app.constants';
import { ApiResponse, PaginatedData } from '../shared/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CashbackSchemeService {
  private http = inject(HttpClient);
  private cashbackSchemes = signal<CashbackScheme[]>([
    {
      id: 'scheme_1',
      name: 'Standard Cashback',
      type: 'percentage',
      value: 1.5,
      minTransactionAmount: 100,
      description: 'A standard cashback scheme for all users.',
      isActive: true,
    },
    {
      id: 'scheme_2',
      name: 'Premium Cashback',
      type: 'percentage',
      value: 3.0,
      minTransactionAmount: 500,
      description: 'A premium cashback scheme for premium users.',
      isActive: true,
    },
    {
      id: 'scheme_3',
      name: 'Flat Bonus',
      type: 'flat',
      value: 50,
      minTransactionAmount: 1000,
      description: 'A special flat bonus for large transactions.',
      isActive: false,
    },
  ]);

  getCashbackSchemes(searchTerm: string = '', searchField: keyof CashbackScheme | 'all' = 'all', page: number = 1, pageSize: number = 10): Observable<{
    cashbackSchemes: CashbackScheme[];
    totalItems: number;
  }> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.get<ApiResponse<PaginatedData<any>>>(`${APP_CONSTANTS.API_URL}/api/cashback-schemes/get-all`).pipe(
        map(response => {
          const cashbackSchemes = response.data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            type: item.type,
            value: item.value,
            minTransactionAmount: item.minTransactionAmount,
            description: item.description, // Assuming backend might return it, if not undefined
            isActive: item.isActive // Assuming backend might return it
          }));
          const totalItems = (response.data as any).totalCount || response.data.totalItems || 0;
          return {
            cashbackSchemes,
            totalItems
          };
        })
      );
    } else {
      let filtered = this.cashbackSchemes();

      if (searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(scheme => {
          if (searchField === 'all') {
            return Object.values(scheme).some(value =>
              String(value).toLowerCase().includes(searchTerm)
            );
          } else {
            const value = scheme[searchField];
            return String(value).toLowerCase().includes(searchTerm);
          }
        });
      }

      const totalItems = filtered.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);
      const paginated = filtered.slice(startIndex, endIndex);

      return of({ cashbackSchemes: paginated, totalItems });
    }
  }

  getCashbackSchemeById(id: string): Observable<CashbackScheme | undefined> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.get<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/cashback-schemes/get/${id}`).pipe(
        map(response => ({
          id: response.data.id,
          name: response.data.name,
          type: response.data.type,
          value: response.data.value,
          minTransactionAmount: response.data.minTransactionAmount,
          description: response.data.description,
          isActive: response.data.isActive
        }))
      );
    }
    return of(this.cashbackSchemes().find(scheme => scheme.id === id));
  }

  addCashbackScheme(scheme: Omit<CashbackScheme, 'id'>): Observable<CashbackScheme | void> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.post<CashbackScheme>(`${APP_CONSTANTS.API_URL}/api/cashback-schemes/create`, scheme);
    } else {
      const newScheme: CashbackScheme = {
        id: 'scheme_' + (this.cashbackSchemes().length + 1),
        ...scheme,
      };
      this.cashbackSchemes.update(schemes => [...schemes, newScheme]);
      return of(newScheme);
    }
  }

  updateCashbackScheme(updatedScheme: CashbackScheme): Observable<CashbackScheme | boolean> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.put<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/cashback-schemes/update`, updatedScheme).pipe(
        map(response => ({
          id: response.data.id,
          name: response.data.name,
          type: response.data.type,
          value: response.data.value,
          minTransactionAmount: response.data.minTransactionAmount,
          description: response.data.description,
          isActive: response.data.isActive
        }))
      );
    } else {
      let updated = false;
      this.cashbackSchemes.update(schemes =>
        schemes.map(scheme => {
          if (scheme.id === updatedScheme.id) {
            updated = true;
            return { ...scheme, ...updatedScheme };
          }
          return scheme;
        })
      );
      return of(updated ? updatedScheme : false);
    }
  }

  deleteCashbackScheme(id: string): Observable<boolean> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.delete<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/cashback-schemes/delete/${id}`).pipe(
        map(response => response.status === 0 || response.status === 'SUCCESS')
      );
    } else {
      const initialLength = this.cashbackSchemes().length;
      this.cashbackSchemes.update(schemes => schemes.filter(scheme => scheme.id !== id));
      return of(this.cashbackSchemes().length < initialLength);
    }
  }
}
