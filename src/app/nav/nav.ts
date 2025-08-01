import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule]
})
export class NavComponent {

  constructor(private router: Router) {}

  logout() {
    // Add logout logic here
    this.router.navigate(['/login']);
  }

}
