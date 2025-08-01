import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-accounts',
  template: '<h1>Accounts</h1>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent {}
