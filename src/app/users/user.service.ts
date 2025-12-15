import { Injectable, signal, inject } from '@angular/core';
import { User } from './user.interface';
import { ROLES } from '../services/permission.config';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { APP_CONSTANTS } from '../config/app.constants';
import { ApiResponse, PaginatedData } from '../shared/api-response.interface';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private users = signal<User[]>([
    {
      id: 'user1',
      fullName: 'Alice Smith',
      email: 'admin',
      organizationId: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user2',
      fullName: 'Bob Johnson',
      email: 'bob@example.com',
      organizationId: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user3',
      fullName: 'Charlie Brown',
      email: 'charlie@example.com',
      organizationId: 4,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user4',
      fullName: 'Diana Prince',
      email: 'diana@example.com',
      organizationId: 5,
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'user5',
      fullName: 'Eve Adams',
      email: 'eve@example.com',
      organizationId: 1,
      isActive: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  getUsers(searchTerm: string = '', searchField: keyof User | 'all' = 'all', page: number = 1, pageSize: number = 10): Observable<{
    users: User[];
    totalItems: number;
  }> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.get<ApiResponse<PaginatedData<any>>>(`${APP_CONSTANTS.API_URL}/api/users/get-all`).pipe(
        map(response => {
          const users = response.data.data.map((item: any) => ({
            id: item.id,
            fullName: item.fullName,
            email: item.email,
            organizationId: item.organizationId,
            isActive: item.isActive,
            createdAt: item.createdAt
          }));
          const totalItems = (response.data as any).totalCount || response.data.totalItems || 0;
          return {
            users,
            totalItems
          };
        })
      );
    } else {
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

      return of({ users: paginated, totalItems });
    }
  }

  getUserById(id: string): Observable<User | undefined> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.get<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/users/get/${id}`).pipe(
        map(response => ({
          id: response.data.id,
          fullName: response.data.fullName,
          email: response.data.email,
          organizationId: response.data.organizationId,
          isActive: response.data.isActive,
          createdAt: response.data.createdAt
        }))
      );
    }
    return of(this.users().find(user => user.id === id));
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): Observable<User | void> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.post<User>(`${APP_CONSTANTS.API_URL}/api/users/create`, user);
    } else {
      const newUser: User = {
        id: 'user' + (this.users().length + 1),
        createdAt: new Date().toISOString(),
        ...user,
      };
      this.users.update(users => [...users, newUser]);
      return of(newUser);
    }
  }

  updateUser(updatedUser: User): Observable<User | boolean> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.put<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/users/update`, updatedUser).pipe(
        map(response => ({
          id: response.data.id,
          fullName: response.data.fullName,
          email: response.data.email,
          organizationId: response.data.organizationId,
          isActive: response.data.isActive,
          createdAt: response.data.createdAt
        }))
      );
    } else {
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
      return of(updated ? updatedUser : false);
    }
  }

  deleteUser(id: string): Observable<boolean> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.delete<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/users/delete/${id}`).pipe(
        map(response => response.status === 0 || response.status === 'SUCCESS')
      );
    } else {
      const initialLength = this.users().length;
      this.users.update(users => users.filter(user => user.id !== id));
      return of(this.users().length < initialLength);
    }
  }
}
