import { Injectable, inject } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { UserService } from '../users/user.service';
import { OrganizationService } from '../organizations/organization.service';
import { CashbackSchemeService } from '../cashback-schemes/cashback-scheme.service';
import { StaffService } from '../staffs/staff.service';

@Injectable({ providedIn: 'root' })
export class LookupService {
    private userService = inject(UserService);
    private organizationService = inject(OrganizationService);
    private cashbackSchemeService = inject(CashbackSchemeService);
    private staffService = inject(StaffService);

    getData(resource: string, searchTerm: string = '', page: number = 1, pageSize: number = 10): Observable<{ data: any[], totalItems: number }> {
        switch (resource) {
            case 'users':
                return this.userService.getUsers(searchTerm, 'all', page, pageSize).pipe(
                    map(result => ({ data: result.users, totalItems: result.totalItems }))
                );

            case 'organizations':
                return this.organizationService.getOrganizations(searchTerm, 'all', page, pageSize).pipe(
                    map(result => ({ data: result.organizations, totalItems: result.totalItems }))
                );

            case 'cashback-schemes':
                return this.cashbackSchemeService.getCashbackSchemes(searchTerm, 'all', page, pageSize).pipe(
                    map(result => ({ data: result.cashbackSchemes, totalItems: result.totalItems }))
                );

            case 'staffs':
                return this.staffService.getStaffs(searchTerm, 'all', page, pageSize).pipe(
                    map(result => ({ data: result.staffs, totalItems: result.totalItems }))
                );

            default:
                return of({ data: [], totalItems: 0 });
        }
    }
}
