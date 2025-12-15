import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormArray, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CardService } from '../card.service';
import { LookupSelectorComponent } from '../../lookup-selector/lookup-selector';
import { Permission } from '../../users/user.interface';

@Component({
  selector: 'app-card-add',
  templateUrl: './card-add.html',
  styleUrls: ['./card-add.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LookupSelectorComponent]
})
export class CardAddComponent {
  private router = inject(Router);
  private cardService = inject(CardService);

  form = new FormGroup({
    cards: new FormArray([])
  });

  // Lookup state
  activeLookupIndex = signal<number | null>(null);
  activeLookupField = signal<string | null>(null); // 'userId'

  constructor() {
    this.addCardRow();
  }

  get cardsArray() {
    return this.form.get('cards') as FormArray;
  }

  createCardGroup(): FormGroup {
    return new FormGroup({
      cardNumber: new FormControl('', Validators.required),
      cardType: new FormControl('debit', Validators.required),
      cvv: new FormControl('', Validators.required)
    });
  }

  addCardRow() {
    this.cardsArray.push(this.createCardGroup());
  }

  removeCardRow(index: number) {
    if (this.cardsArray.length > 1) {
      this.cardsArray.removeAt(index);
    }
  }

  onSave() {
    if (this.form.valid) {
      const cards = this.cardsArray.getRawValue().map((c: any) => ({
        ...c,
        status: 'inactive', // Default status
        userId: undefined
      }));
      this.cardService.addCards(cards).subscribe(() => {
        this.router.navigate(['/cards']);
      });
    }
  }

  onCancel() {
    this.router.navigate(['/cards']);
  }

  // Lookup
  openLookup(index: number, field: string) {
    this.activeLookupIndex.set(index);
    this.activeLookupField.set(field);
  }

  closeLookup() {
    this.activeLookupIndex.set(null);
    this.activeLookupField.set(null);
  }

  onLookupSelect(item: any) {
    const index = this.activeLookupIndex();
    const field = this.activeLookupField();

    if (index !== null && field === 'userId') {
      const group = this.cardsArray.at(index);
      group.patchValue({
        userId: item.id,
        userName: item.name
      });
      group.markAsDirty();
    }
    this.closeLookup();
  }
}
