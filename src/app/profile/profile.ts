import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  template: '<h1>Profile</h1>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {}
