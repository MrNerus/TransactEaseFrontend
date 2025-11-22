import { Injectable, signal } from '@angular/core';
import { Transaction } from './transaction.interface';
import { ROLES } from '../services/permission.config';

@Injectable({ providedIn: 'root' })
export class TransactionService {
  private transactions = signal<Transaction[]>([
    {
      id: 'txn1',
      userId: 'Alice Smith (user1)',
      organizationId: 'org1',
      receiverId: 'Bob Johnson (user2)',
      amount: 100,
      cashbackId: 'cashback1',
      createdAt: new Date(),
    },
    {
      id: 'txn2',
      userId: 'Bob Johnson (user2)',
      organizationId: 'org1',
      receiverId: 'Charlie Brown (user3)',
      amount: 100,
      cashbackId: 'cashback1',
      createdAt: new Date(),
    },
    {
      id: 'txn3',
      userId: 'Charlie Brown (user3)',
      organizationId: 'org1',
      receiverId: 'Diana Prince (user4)',
      amount: 100,
      cashbackId: 'cashback1',
      createdAt: new Date(),
    },
    {
      id: 'txn4',
      userId: 'Diana Prince (user4)',
      organizationId: 'org1',
      receiverId: 'Eve Adams (user5)',
      amount: 100,
      cashbackId: 'cashback1',
      createdAt: new Date(),
    },
    {
      id: 'txn5',
      userId: 'Eve Adams (user5)',
      organizationId: 'org1',
      receiverId: 'Alice Smith (user1)',
      amount: 100,
      cashbackId: 'cashback1',
      createdAt: new Date(),
    },
  ]);

  getTransactions(searchTerm: string = '', searchField: keyof Transaction | 'all' = 'all', page: number = 1, pageSize: number = 10): {
    transactions: Transaction[];
    totalItems: number;
  } {
    let filtered = this.transactions();

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

    return { transactions: paginated, totalItems };
  }

  getTransactionById(id: string): Transaction | undefined {
    return this.transactions().find(transaction => transaction.id === id);
  }

  addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): void {
    const newTransaction: Transaction = {
      id: 'txn' + (this.transactions().length + 1),
      createdAt: new Date(),
      ...transaction,
    };
    this.transactions.update(transactions => [...transactions, newTransaction]);
  }
}
