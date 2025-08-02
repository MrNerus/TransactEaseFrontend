import { Injectable, signal } from '@angular/core';

interface CashbackScheme {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CashbackSchemeService {
  private cashbackSchemes = signal<CashbackScheme[]>([
    {
      id: 'scheme_1',
      name: 'Standard Cashback',
      description: 'A standard cashback scheme for all users.',
      isActive: true,
    },
    {
      id: 'scheme_2',
      name: 'Premium Cashback',
      description: 'A premium cashback scheme for premium users.',
      isActive: true,
    },
    {
      id: 'scheme_3',
      name: 'Weekend Cashback',
      description: 'A special cashback scheme for weekends.',
      isActive: false,
    },
  ]);

  getCashbackSchemes(searchTerm: string = '', searchField: keyof CashbackScheme | 'all' = 'all', page: number = 1, pageSize: number = 10): {
    cashbackSchemes: CashbackScheme[];
    totalItems: number;
  } {
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

    return { cashbackSchemes: paginated, totalItems };
  }

  getCashbackSchemeById(id: string): CashbackScheme | undefined {
    return this.cashbackSchemes().find(scheme => scheme.id === id);
  }

  addCashbackScheme(scheme: Omit<CashbackScheme, 'id'>): void {
    const newScheme: CashbackScheme = {
      id: 'scheme_' + (this.cashbackSchemes().length + 1),
      ...scheme,
    };
    this.cashbackSchemes.update(schemes => [...schemes, newScheme]);
  }

  updateCashbackScheme(updatedScheme: CashbackScheme): boolean {
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
    return updated;
  }

  deleteCashbackScheme(id: string): boolean {
    const initialLength = this.cashbackSchemes().length;
    this.cashbackSchemes.update(schemes => schemes.filter(scheme => scheme.id !== id));
    return this.cashbackSchemes().length < initialLength;
  }
}
