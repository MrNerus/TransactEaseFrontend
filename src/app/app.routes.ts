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
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
