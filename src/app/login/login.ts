import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  username = '';
  password = '';

  private authService = inject(AuthService);

  login() {
    this.authService.login(this.username);
  }
}
