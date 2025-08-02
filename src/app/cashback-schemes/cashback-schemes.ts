import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Router } from '@angular/router';

interface CashbackScheme {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

@Component({
  selector: 'app-cashback-schemes',
  templateUrl: './cashback-schemes.html',
  styleUrls: ['./cashback-schemes.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CashbackSchemesComponent {
  cashbackSchemes = signal<CashbackScheme[]>([
    {
      id: 'scheme_1',
      name: 'Standard Cashback',
      description: 'A standard cashback scheme for all users.',
      isActive: true,
    },
    {
      id: 'scheme_2',
      name: 'Premium Cashback',
      description: 'A premium cashback scheme for premium users.',
      isActive: true,
    },
    {
      id: 'scheme_3',
      name: 'Weekend Cashback',
      description: 'A special cashback scheme for weekends.',
      isActive: false,
    },
  ]);

  constructor(private router: Router) {}

  goToAddScheme() {
    this.router.navigate(['/cashback-schemes/add']);
  }
}
