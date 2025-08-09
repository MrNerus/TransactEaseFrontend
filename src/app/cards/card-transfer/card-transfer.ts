import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardService } from '../card.service';
import { OrganizationService } from '../../organizations/organization.service';
import { AuthService } from '../../services/auth.service';
import { Card } from '../card.interface';
import { Organization } from '../../organizations/organization.interface';

@Component({
  selector: 'app-card-transfer',
  templateUrl: './card-transfer.html',
  styleUrls: ['./card-transfer.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class CardTransferComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cardService = inject(CardService);
  private organizationService = inject(OrganizationService);
  public authService = inject(AuthService);

  form = this.fb.group({
    cardIds: [[] as string[], Validators.required],
    organizationId: ['', Validators.required]
  });

  cards = signal<Card[]>([]);
  organizations = signal<Organization[]>([]);
  isAdmin = signal(false);

  constructor() {
    this.loadInitialData();
    this.isAdmin.set(this.authService.getUser()?.role?.name === 'admin');
  }

  loadInitialData(): void {
    const { cards } = this.cardService.getCards(1, 1000); // Fetch all cards for selection
    this.cards.set(cards.filter(c => !c.organizationId));
    const { organizations } = this.organizationService.getOrganizations();
    this.organizations.set(organizations);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { cardIds, organizationId } = this.form.value;
      if (cardIds && organizationId) {
        this.cardService.transferCards(cardIds, organizationId);
        this.router.navigate(['/cards']);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/cards']);
  }
}
