import { Injectable, signal } from '@angular/core';
import { User } from './user.interface';
import { ROLES } from '../services/permission.config';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users = signal<User[]>([
    {
      id: 'user1',
      fullName: 'Alice Smith',
      email: 'admin',
      organizationId: 'org1',
      role: ROLES.find(r => r.name === 'admin')!,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user2',
      fullName: 'Bob Johnson',
      email: 'bob@example.com',
      organizationId: 'org2',
      role: ROLES.find(r => r.name === 'viewer')!,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user3',
      fullName: 'Charlie Brown',
      email: 'charlie@example.com',
      organizationId: 'org4',
      role: ROLES.find(r => r.name === 'editor')!,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user4',
      fullName: 'Diana Prince',
      email: 'diana@example.com',
      organizationId: 'org5',
      role: ROLES.find(r => r.name === 'admin')!,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user5',
      fullName: 'Eve Adams',
      email: 'eve@example.com',
      organizationId: 'org1',
      role: ROLES.find(r => r.name === 'viewer')!,
      isActive: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  getUsers(searchTerm: string = '', searchField: keyof User | 'all' = 'all', page: number = 1, pageSize: number = 10): {
    users: User[];
    totalItems: number;
  } {
    let filtered = this.users();

    if (searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(user => {
        if (searchField === 'all') {
          return Object.values(user).some(value =>
            String(value).toLowerCase().includes(searchTerm)
          );
        } else {
          const value = user[searchField];
          return String(value).toLowerCase().includes(searchTerm);
        }
      });
    }

    const totalItems = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginated = filtered.slice(startIndex, endIndex);

    return { users: paginated, totalItems };
  }

  getUserById(id: string): User | undefined {
    return this.users().find(user => user.id === id);
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): void {
    const newUser: User = {
      id: 'user' + (this.users().length + 1),
      createdAt: new Date().toISOString(),
      ...user,
    };
    this.users.update(users => [...users, newUser]);
  }

  updateUser(updatedUser: User): boolean {
    let updated = false;
    this.users.update(users =>
      users.map(user => {
        if (user.id === updatedUser.id) {
          updated = true;
          return { ...user, ...updatedUser };
        }
        return user;
      })
    );
    return updated;
  }

  deleteUser(id: string): boolean {
    const initialLength = this.users().length;
    this.users.update(users => users.filter(user => user.id !== id));
    return this.users().length < initialLength;
  }
}
