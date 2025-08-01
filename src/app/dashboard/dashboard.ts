import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe]
})
export class DashboardComponent {
  totalTransactions = signal(1850);
  totalVolume = signal(1250000.00);
  totalCashback = signal(15400.50);
  activeUsers = signal(540);

  recentTransactions = signal([
    { id: 'txn_1', from: 'John Doe', to: 'IMS Store', amount: 300, date: new Date() },
    { id: 'txn_2', from: 'Jane Smith', to: 'Online Mart', amount: 150, date: new Date() },
    { id: 'txn_3', from: 'Peter Jones', to: 'Coffee Shop', amount: 12.50, date: new Date() },
    { id: 'txn_4', from: 'Mary Johnson', to: 'Bookstore', amount: 45, date: new Date() },
  ]);
}