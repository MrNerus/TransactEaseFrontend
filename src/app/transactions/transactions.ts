import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-transactions',
  template: '<h1>Transactions</h1>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionsComponent {}
