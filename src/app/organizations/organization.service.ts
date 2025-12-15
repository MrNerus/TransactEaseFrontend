import { Injectable, signal, inject } from '@angular/core';
import { Organization } from './organization.interface';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map } from 'rxjs';
import { APP_CONSTANTS } from '../config/app.constants';
import { ApiResponse, PaginatedData } from '../shared/api-response.interface';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private organizations = signal<Organization[]>([
    { id: 1, name: 'Head Office', createdAt: new Date().toISOString() },
    { id: 2, name: 'Branch A', parentId: 1, createdAt: new Date().toISOString() },
    { id: 3, name: 'Branch B', parentId: 1, createdAt: new Date().toISOString() },
    { id: 4, name: 'Counter 1 (Branch A)', parentId: 2, createdAt: new Date().toISOString() },
    { id: 5, name: 'Counter 2 (Branch A)', parentId: 2, createdAt: new Date().toISOString() },
    { id: 6, name: 'Counter 1 (Branch B)', parentId: 3, createdAt: new Date().toISOString() },
    { id: 7, name: 'Regional Office X', createdAt: new Date().toISOString() },
    { id: 8, name: 'Branch X1', parentId: 7, createdAt: new Date().toISOString() },
    { id: 9, name: 'Branch X2', parentId: 7, createdAt: new Date().toISOString() },
    { id: 10, name: 'Counter X1 (Branch X1)', parentId: 8, createdAt: new Date().toISOString() },
  ]);

  getOrganizations(searchTerm: string = '', searchField: keyof Organization | 'all' = 'all', page: number = 1, pageSize: number = 10): Observable<{
    organizations: Organization[];
    totalItems: number;
  }> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      // Backend Integration
      return this.http.get<ApiResponse<PaginatedData<any>>>(`${APP_CONSTANTS.API_URL}/api/organization/get-all`).pipe(
        map(response => {
          // Mapping backend response to frontend model
          const organizations = response.data.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            parentId: item.parentId, // Assuming parentCode maps to parentId
            createdAt: item.createdAt
          }));
          return {
            organizations,
            totalItems: response.data.totalItems || 0 // Assuming backend provides totalItems or we calculate
          };
        })
      );
    } else {
      // Mock Logic (Existing)
      const user = this.authService.getUser();
      let filtered = this.organizations();

      if (user && user.role !== 'admin') {
        const userOrgId = user.organizationId;
        const descendantIds = this.getDescendantOrgIds(userOrgId);
        filtered = filtered.filter(org => org.id === userOrgId || descendantIds.has(org.id));
      }

      if (searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(org => {
          if (searchField === 'all') {
            return Object.values(org).some(value =>
              String(value).toLowerCase().includes(searchTerm)
            );
          } else {
            const value = org[searchField];
            return String(value).toLowerCase().includes(searchTerm);
          }
        });
      }

      const totalItems = filtered.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = Math.min(startIndex + pageSize, totalItems);
      const paginated = filtered.slice(startIndex, endIndex);

      return of({ organizations: paginated, totalItems });
    }
  }

  private getDescendantOrgIds(parentId: number): Set<number> {
    const descendantIds = new Set<number>();
    const queue = [parentId];
    const allOrgs = this.organizations();

    while (queue.length > 0) {
      const currentOrgId = queue.shift()!;
      const children = allOrgs.filter(org => org.parentId === currentOrgId);
      for (const child of children) {
        descendantIds.add(child.id);
        queue.push(child.id);
      }
    }
    return descendantIds;
  }

  getOrganizationById(id: number | string): Observable<Organization | undefined> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.get<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/organization/get/${id}`).pipe(
        map(response => ({
          id: response.data.id,
          name: response.data.name,
          parentId: response.data.parentId,
          createdAt: response.data.createdAt
        }))
      );
    }
    return of(this.organizations().find(org => org.id == id));
  }

  addOrganization(org: Omit<Organization, 'id' | 'createdAt'>): Observable<Organization | void> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.post<Organization>(`${APP_CONSTANTS.API_URL}/api/organization/create`, org);
    } else {
      const newOrg: Organization = {
        id: this.organizations().length + 1,
        createdAt: new Date().toISOString(),
        ...org,
      };
      this.organizations.update(orgs => [...orgs, newOrg]);
      return of(newOrg);
    }
  }

  updateOrganization(updatedOrg: Organization): Observable<Organization | boolean> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.put<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/organization/update`, updatedOrg).pipe(
        map(response => ({
          id: response.data.id,
          name: response.data.name,
          parentId: response.data.parentId,
          createdAt: response.data.createdAt
        })
        )
      );
    } else {
      let updated = false;
      this.organizations.update(orgs =>
        orgs.map(org => {
          if (org.id == updatedOrg.id) {
            updated = true;
            return { ...org, ...updatedOrg };
          }
          return org;
        })
      );
      return of(updated ? updatedOrg : false);
    }
  }

  deleteOrganization(id: number | string): Observable<boolean> {
    if (APP_CONSTANTS.IS_BACKEND_AVAILABLE) {
      return this.http.delete<ApiResponse<any>>(`${APP_CONSTANTS.API_URL}/api/organization/delete/${id}`).pipe(
        map(response => response.status === 0 || response.status === 'SUCCESS') // Assuming 0/SUCCESS is success
      );
    } else {
      const initialLength = this.organizations().length;
      this.organizations.update(orgs => orgs.filter(org => org.id != id));
      return of(this.organizations().length < initialLength);
    }
  }
}