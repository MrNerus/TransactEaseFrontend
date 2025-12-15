import { Injectable, signal, inject } from '@angular/core';
import { Staff } from './staff.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { APP_CONSTANTS } from '../config/app.constants';
import { ApiResponse, PaginatedData } from '../shared/api-response.interface';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private http = inject(HttpClient);
  private staffs = signal<Staff[]>([
    {
      id: 'staff1',
      fullName: 'Alice Smith',
      email: 'alice@example.com',
      organizationId: 1,
      role: 'Admin',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'staff2',
      fullName: 'Bob Johnson',
      email: 'bob@example.com',
      organizationId: 2,
      role: 'Manager',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'staff3',
      fullName: 'Charlie Brown',
      email: 'charlie@example.com',
      organizationId: 4,
      role: 'Operator',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'staff4',
      fullName: 'Diana Prince',
      email: 'diana@example.com',
      organizationId: 5,
      role: 'Customer',
      isActive: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'staff5',
      fullName: 'Eve Adams',
      email: 'eve@example.com',
      organizationId: 1,
      role: 'Customer',
      isActive: false,
      createdAt: new Date().toISOString(),
    },
  ]);

  getStaffs(searchTerm: string = '', searchField: keyof Staff | 'all' = 'all', page: number = 1, pageSize: number = 10): Observable<{
    staffs: Staff[];
    totalItems: number;
  }> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.get<ApiResponse<PaginatedData<any>>>(`${APP_CONSTANTS.API_URL}/api/staff/get-all`).pipe(
        map(response => {
          const staffs = response.data.data.map((item: any) => ({
            id: item.id,
            fullName: item.fullName,
            email: item.email,
            organizationId: item.organizationId,
            role: item.role,
            isActive: item.isActive,
            createdAt: item.createdAt
          }));
          // Prioritize totalCount from backend as per user request, fallback to totalItems if needed
          const totalItems = (response.data as any).totalCount || response.data.totalItems || 0;
          return {
            staffs,
            totalItems
          };
        })
      );
    } else {
      let filtered = this.staffs();

      if (searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(staff => {
          if (searchField === 'all') {
            return Object.values(staff).some(value =>
              String(value).toLowerCase().includes(searchTerm)
            );
          } else {
            const value = staff[searchField];
            return String(value).toLowerCase().includes(searchTerm);
          }
        });
      }

      const totalItems = filtered.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);
      const paginated = filtered.slice(startIndex, endIndex);

      return of({ staffs: paginated, totalItems });
    }
  }

  getStaffById(id: string): Observable<Staff | undefined> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.get<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/staff/get/${id}`).pipe(
        map(response => ({
          id: response.data.id,
          fullName: response.data.fullName,
          email: response.data.email,
          organizationId: response.data.organizationId,
          role: response.data.role,
          isActive: response.data.isActive,
          createdAt: response.data.createdAt
        }))
      );
    }
    return of(this.staffs().find(staff => staff.id === id));
  }

  addStaff(staff: Omit<Staff, 'id' | 'createdAt'>): Observable<Staff | void> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.post<Staff>(`${APP_CONSTANTS.API_URL}/api/staff/create`, staff);
    } else {
      const newStaff: Staff = {
        id: 'staff' + (this.staffs().length + 1),
        createdAt: new Date().toISOString(),
        ...staff,
      };
      this.staffs.update(staffs => [...staffs, newStaff]);
      return of(newStaff);
    }
  }

  updateStaff(updatedStaff: Staff): Observable<Staff | boolean> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.put<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/staff/update`, updatedStaff).pipe(
        map(response => ({
          id: response.data.id,
          fullName: response.data.fullName,
          email: response.data.email,
          organizationId: response.data.organizationId,
          role: response.data.role,
          isActive: response.data.isActive,
          createdAt: response.data.createdAt
        }))
      );
    } else {
      let updated = false;
      this.staffs.update(staffs =>
        staffs.map(staff => {
          if (staff.id === updatedStaff.id) {
            updated = true;
            return { ...staff, ...updatedStaff };
          }
          return staff;
        })
      );
      return of(updated ? updatedStaff : false);
    }
  }

  deleteStaff(id: string): Observable<boolean> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.delete<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/staff/delete/${id}`).pipe(
        map(response => response.status === 0 || response.status === 'SUCCESS')
      );
    } else {
      const initialLength = this.staffs().length;
      this.staffs.update(staffs => staffs.filter(staff => staff.id !== id));
      return of(this.staffs().length < initialLength);
    }
  }
}
