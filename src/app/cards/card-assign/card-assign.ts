import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from '../card.service';
import { UserService } from '../../users/user.service';
import { Card } from '../card.interface';
import { User } from '../../users/user.interface';

@Component({
  selector: 'app-card-assign',
  templateUrl: './card-assign.html',
  styleUrls: ['./card-assign.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class CardAssignComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cardService = inject(CardService);
  private userService = inject(UserService);

  form = this.fb.group({
    cardId: ['', Validators.required],
    userId: ['', Validators.required]
  });

  cards = signal<Card[]>([]);
  users = signal<User[]>([]);

  constructor() {
    this.loadInitialData();
    const cardId = this.route.snapshot.paramMap.get('id');
    if (cardId) {
      this.form.patchValue({ cardId });
    }
  }

  loadInitialData(): void {
    const { cards } = this.cardService.getCards(1, 1000); // Fetch all cards for selection
    this.cards.set(cards.filter(c => c.organizationId && !c.userId));
    const { users } = this.userService.getUsers();
    this.users.set(users);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { cardId, userId } = this.form.value;
      if (cardId && userId) {
        this.cardService.assignCard(cardId, userId);
        this.router.navigate(['/cards']);
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/cards']);
  }
}
