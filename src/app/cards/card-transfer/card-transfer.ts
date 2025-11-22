import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CardService } from '../card.service';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { SchemaService, FormSchema } from '../../services/schema.service';

@Component({
  selector: 'app-card-transfer',
  templateUrl: './card-transfer.html',
  styleUrls: ['./card-transfer.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DynamicFormComponent]
})
export class CardTransferComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cardService = inject(CardService);
  private schemaService = inject(SchemaService);

  schema = signal<FormSchema>({ fields: [] });
  data = signal<any>({});

  constructor() {
    this.schemaService.getFormSchema('cards-transfer').subscribe(schema => {
      this.schema.set(schema);
    });

    const cardId = this.route.snapshot.paramMap.get('id');
    if (cardId) {
      // Pre-fill card ID if coming from list action
      this.data.set({ cardIds: cardId });
    }
  }

  onSave(formData: any): void {
    const { cardIds, organizationId } = formData;
    // Handle comma separated string for cardIds if entered manually
    const ids = Array.isArray(cardIds) ? cardIds : cardIds.split(',').map((id: string) => id.trim());

    this.cardService.transferCards(ids, organizationId);
    this.router.navigate(['/cards']);
  }

  onCancel(): void {
    this.router.navigate(['/cards']);
  }
}
