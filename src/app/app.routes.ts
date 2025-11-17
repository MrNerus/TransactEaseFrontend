import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './guards/auth.guard';
import { TransactionsComponent } from './transactions/transactions';
import { ProfileComponent } from './profile/profile';
import { OrganizationListComponent } from './organizations/organization-list/organization-list';
import { OrganizationFormComponent } from './organizations/organization-form/organization-form';
import { UserListComponent } from './users/user-list/user-list';
import { UserFormComponent } from './users/user-form/user-form';
import { StaffListComponent } from './staffs/staff-list/staff-list';
import { StaffFormComponent } from './staffs/staff-form/staff-form';
import { CashbackSchemeListComponent } from './cashback-schemes/cashback-scheme-list';
import { CashbackSchemeFormComponent } from './cashback-schemes/cashback-scheme-form/cashback-scheme-form';
import { ReportsComponent } from './reports/reports';
import { AuditLogsComponent } from './audit-logs/audit-logs';
import { CardListComponent } from './cards/card-list/card-list';
import { CardAddComponent } from './cards/card-add/card-add';
import { CardTransferComponent } from './cards/card-transfer/card-transfer';
import { CardAssignComponent } from './cards/card-assign/card-assign';
import { CardViewComponent } from './cards/card-view/card-view';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard], data: { permission: 'nav_dashboard' } },

  { path: 'organizations', component: OrganizationListComponent, canActivate: [authGuard], data: { permission: 'nav_organization' } },
  { path: 'organizations/add', component: OrganizationFormComponent, canActivate: [authGuard], data: { permission: 'organization_add' } },
  { path: 'organizations/edit/:id', component: OrganizationFormComponent, canActivate: [authGuard], data: { permission: 'organization_edit' } },
  { path: 'organizations/view/:id', component: OrganizationFormComponent, canActivate: [authGuard], data: { permission: 'organization_view' } },

  { path: 'users', component: UserListComponent, canActivate: [authGuard], data: { permission: 'nav_users' } },
  { path: 'users/add', component: UserFormComponent, canActivate: [authGuard], data: { permission: 'user_add' } },
  { path: 'users/edit/:id', component: UserFormComponent, canActivate: [authGuard], data: { permission: 'user_edit' } },
  { path: 'users/view/:id', component: UserFormComponent, canActivate: [authGuard], data: { permission: 'user_view' } },

  { path: 'staffs', component: StaffListComponent, canActivate: [authGuard], data: { permission: 'nav_staff' } },
  { path: 'staffs/add', component: StaffFormComponent, canActivate: [authGuard], data: { permission: 'staff_add' } },
  { path: 'staffs/edit/:id', component: StaffFormComponent, canActivate: [authGuard], data: { permission: 'staff_edit' } },
  { path: 'staffs/view/:id', component: StaffFormComponent, canActivate: [authGuard], data: { permission: 'staff_view' } },

  { path: 'cashback-schemes', component: CashbackSchemeListComponent, canActivate: [authGuard], data: { permission: 'nav_cashBackScheme' } },
  { path: 'cashback-schemes/add', component: CashbackSchemeFormComponent, canActivate: [authGuard], data: { permission: 'cashbackScheme_add' } },
  { path: 'cashback-schemes/edit/:id', component: CashbackSchemeFormComponent, canActivate: [authGuard], data: { permission: 'cashbackScheme_edit' } },
  { path: 'cashback-schemes/view/:id', component: CashbackSchemeFormComponent, canActivate: [authGuard], data: { permission: 'cashbackScheme_view' } },

  { path: 'transactions', component: TransactionsComponent, canActivate: [authGuard], data: { permission: 'nav_transaction' } },
  { path: 'transactions/view/:id', component: TransactionsComponent, canActivate: [authGuard], data: { permission: 'transaction_view' } },

  { path: 'reports', component: ReportsComponent, canActivate: [authGuard], data: { permission: 'nav_reports' } },

  { path: 'audit-logs', component: AuditLogsComponent, canActivate: [authGuard], data: { permission: 'nav_auditLogs' } },

  { path: 'profile', component: ProfileComponent, canActivate: [authGuard], data: { permission: 'opt_profile' } },

  { path: 'cards', component: CardListComponent, canActivate: [authGuard], data: { permission: 'nav_cards' } },
  { path: 'cards/add', component: CardAddComponent, canActivate: [authGuard], data: { permission: 'cards_add' } },
  { path: 'cards/transfer', component: CardTransferComponent, canActivate: [authGuard], data: { permission: 'cards_edit' } },
  { path: 'cards/assign', component: CardAssignComponent, canActivate: [authGuard], data: { permission: 'cards_edit' } },
  { path: 'cards/assign/:id', component: CardAssignComponent, canActivate: [authGuard], data: { permission: 'cards_edit' } },
  { path: 'cards/view/:id', component: CardViewComponent, canActivate: [authGuard], data: { permission: 'cards_view' } },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

