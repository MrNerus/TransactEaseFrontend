import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-home',
  template: '<h1>Welcome to your Dashboard!</h1>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardHomeComponent {}
