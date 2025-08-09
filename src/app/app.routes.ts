import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './guards/auth.guard';
import { DocumentsComponent } from './documents/documents';
import { ViewDocumentsComponent } from './documents/view/view';
import { UploadDocumentComponent } from './documents/upload/upload';
import { TransactionsComponent } from './transactions/transactions';
import { AccountsComponent } from './accounts/accounts';
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
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'organizations',
    component: OrganizationListComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'organizations', action: 'canView' } }
  },
  {
    path: 'organizations/add',
    component: OrganizationFormComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'organizations', action: 'canAdd' } }
  },
  {
    path: 'organizations/edit/:id',
    component: OrganizationFormComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'organizations', action: 'canEdit' } }
  },
  {
    path: 'organizations/view/:id',
    component: OrganizationFormComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'organizations', action: 'canView' } }
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'users', action: 'canView' } }
  },
  {
    path: 'users/add',
    component: UserFormComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'users', action: 'canAdd' } }
  },
  {
    path: 'users/edit/:id',
    component: UserFormComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'users', action: 'canEdit' } }
  },
  {
    path: 'users/view/:id',
    component: UserFormComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'users', action: 'canView' } }
  },
  {
    path: 'staffs',
    component: StaffListComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'staffs', action: 'canView' } }
  },
  {
    path: 'staffs/add',
    component: StaffFormComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'staffs', action: 'canAdd' } }
  },
  {
    path: 'staffs/edit/:id',
    component: StaffFormComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'staffs', action: 'canEdit' } }
  },
  {
    path: 'staffs/view/:id',
    component: StaffFormComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'staffs', action: 'canView' } }
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'transactions', action: 'canView' } }
  },
  {
    path: 'documents',
    component: DocumentsComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'documents', action: 'canView' } },
    children: [
      { path: '', component: ViewDocumentsComponent },
      { path: 'upload', component: UploadDocumentComponent, data: { permission: { feature: 'documents', action: 'canAdd' } } },
    ],
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'accounts', action: 'canView' } }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cashback-schemes',
    component: CashbackSchemeListComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'cashback-schemes', action: 'canView' } }
  },
  {
    path: 'cashback-schemes/add',
    component: CashbackSchemeFormComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'cashback-schemes', action: 'canAdd' } }
  },
  {
    path: 'cashback-schemes/edit/:id',
    component: CashbackSchemeFormComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'cashback-schemes', action: 'canEdit' } }
  },
  {
    path: 'cashback-schemes/view/:id',
    component: CashbackSchemeFormComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'cashback-schemes', action: 'canView' } }
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'reports', action: 'canView' } }
  },
  {
    path: 'audit-logs',
    component: AuditLogsComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'audit-logs', action: 'canView' } }
  },
  {
    path: 'cards',
    component: CardListComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'cards', action: 'canView' } }
  },
  {
    path: 'cards/add',
    component: CardAddComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'cards', action: 'canAdd' } }
  },
  {
    path: 'cards/transfer',
    component: CardTransferComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'cards', action: 'canEdit' } }
  },
  {
    path: 'cards/assign',
    component: CardAssignComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'cards', action: 'canEdit' } }
  },
  {
    path: 'cards/assign/:id',
    component: CardAssignComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'cards', action: 'canEdit' } }
  },
  {
    path: 'cards/view/:id',
    component: CardViewComponent,
    canActivate: [authGuard],
    data: { permission: { feature: 'cards', action: 'canView' } }
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
