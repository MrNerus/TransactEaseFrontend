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
                const usersResult = this.userService.getUsers(searchTerm, 'all', page, pageSize);
                return of({ data: usersResult.users, totalItems: usersResult.totalItems });

            case 'organizations':
                return this.organizationService.getOrganizations(searchTerm, 'all', page, pageSize).pipe(
                    map(result => ({ data: result.organizations, totalItems: result.totalItems }))
                );

            case 'cashback-schemes':
                const schemesResult = this.cashbackSchemeService.getCashbackSchemes(searchTerm, 'all', page, pageSize);
                return of({ data: schemesResult.cashbackSchemes, totalItems: schemesResult.totalItems });

            case 'staffs':
                const staffsResult = this.staffService.getStaffs(searchTerm, 'all', page, pageSize);
                return of({ data: staffsResult.staffs, totalItems: staffsResult.totalItems });

            default:
                return of({ data: [], totalItems: 0 });
        }
    }
}
