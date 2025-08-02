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
    canActivate: [authGuard]
  },
  {
    path: 'organizations/add',
    component: OrganizationFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'organizations/edit/:id',
    component: OrganizationFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users/add',
    component: UserFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users/edit/:id',
    component: UserFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'staffs',
    component: StaffListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'staffs/add',
    component: StaffFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'staffs/edit/:id',
    component: StaffFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    component: TransactionsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'documents',
    component: DocumentsComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: ViewDocumentsComponent },
      { path: 'upload', component: UploadDocumentComponent },
    ],
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [authGuard],
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
  },
  {
    path: 'cashback-schemes/add',
    component: CashbackSchemeFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cashback-schemes/edit/:id',
    component: CashbackSchemeFormComponent,
    canActivate: [authGuard],
  },
  {
    path: 'reports',
    component: ReportsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'audit-logs',
    component: AuditLogsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cards',
    component: CardListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cards/add',
    component: CardAddComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cards/transfer',
    component: CardTransferComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cards/assign',
    component: CardAssignComponent,
    canActivate: [authGuard],
  },
  {
    path: 'cards/assign/:id',
    component: CardAssignComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];
