import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './guards/auth.guard';
import { DocumentsComponent } from './documents/documents';
import { ViewDocumentsComponent } from './documents/view/view';
import { UploadDocumentComponent } from './documents/upload/upload';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home';
import { TransactionsComponent } from './transactions/transactions';
import { AccountsComponent } from './accounts/accounts';
import { ProfileComponent } from './profile/profile';
import { OrganizationListComponent } from './organizations/organization-list/organization-list';
import { OrganizationFormComponent } from './organizations/organization-form/organization-form';
import { UserListComponent } from './users/user-list/user-list';
import { UserFormComponent } from './users/user-form/user-form';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'documents',
        component: DocumentsComponent,
        children: [
          { path: '', component: ViewDocumentsComponent },
          { path: 'upload', component: UploadDocumentComponent },
        ]
      },
    ]
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
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];
