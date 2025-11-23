import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
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

    getData(resource: string, searchTerm: string = '', page: number = 1, pageSize: number = 10): { data: any[], totalItems: number } {
        switch (resource) {
            case 'users':
                const usersResult = this.userService.getUsers(searchTerm, 'all', page, pageSize);
                return { data: usersResult.users, totalItems: usersResult.totalItems };

            case 'organizations':
                const orgsResult = this.organizationService.getOrganizations(searchTerm, 'all', page, pageSize);
                return { data: orgsResult.organizations, totalItems: orgsResult.totalItems };

            case 'cashback-schemes':
                const schemesResult = this.cashbackSchemeService.getCashbackSchemes(searchTerm, 'all', page, pageSize);
                return { data: schemesResult.cashbackSchemes, totalItems: schemesResult.totalItems };

            case 'staffs':
                const staffsResult = this.staffService.getStaffs(searchTerm, 'all', page, pageSize);
                return { data: staffsResult.staffs, totalItems: staffsResult.totalItems };

            default:
                return { data: [], totalItems: 0 };
        }
    }
}
