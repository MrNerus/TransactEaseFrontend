import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Card } from '../card.interface';
import { CardService } from '../card.service';

@Component({
  selector: 'app-card-add',
  templateUrl: './card-add.html',
  styleUrls: ['./card-add.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ReactiveFormsModule]
})
export class CardAddComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private cardService = inject(CardService);

  form = this.fb.group({
    cards: this.fb.array([])
  });

  get cards(): FormArray {
    return this.form.get('cards') as FormArray;
  }

  addCard(): void {
    const cardForm = this.fb.group({
      cardNumber: ['', Validators.required],
      cardType: ['debit' as const, Validators.required],
      status: ['inactive' as const, Validators.required],
      issueDate: [new Date(), Validators.required],
      expiryDate: [new Date(), Validators.required]
    });
    this.cards.push(cardForm);
  }

  removeCard(index: number): void {
    this.cards.removeAt(index);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.cardService.addCards(this.form.value.cards as Omit<Card, 'id'>[]);
      this.router.navigate(['/cards']);
    }
  }

  onCancel(): void {
    this.router.navigate(['/cards']);
  }
}
