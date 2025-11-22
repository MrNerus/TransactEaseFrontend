import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CardService } from '../card.service';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { SchemaService, FormSchema } from '../../services/schema.service';

@Component({
  selector: 'app-card-assign',
  templateUrl: './card-assign.html',
  styleUrls: ['./card-assign.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DynamicFormComponent]
})
export class CardAssignComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cardService = inject(CardService);
  private schemaService = inject(SchemaService);

  schema = signal<FormSchema>({ fields: [] });
  data = signal<any>({});

  constructor() {
    this.schemaService.getFormSchema('cards-assign').subscribe(schema => {
      this.schema.set(schema);
    });

    const cardId = this.route.snapshot.paramMap.get('id');
    if (cardId) {
      this.data.set({ cardId });
    }
  }

  onSave(formData: any): void {
    const { cardId, userId } = formData;
    this.cardService.assignCard(cardId, userId);
    this.router.navigate(['/cards']);
  }

  onCancel(): void {
    this.router.navigate(['/cards']);
  }
}
