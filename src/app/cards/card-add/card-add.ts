import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from '../card.interface';
import { CardService } from '../card.service';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { SchemaService, FormSchema } from '../../services/schema.service';

@Component({
  selector: 'app-card-add',
  templateUrl: './card-add.html',
  styleUrls: ['./card-add.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DynamicFormComponent]
})
export class CardAddComponent {
  private router = inject(Router);
  private cardService = inject(CardService);
  private schemaService = inject(SchemaService);

  schema = signal<FormSchema>({ fields: [] });

  constructor() {
    this.schemaService.getFormSchema('cards').subscribe(schema => {
      this.schema.set(schema);
    });
  }

  onSave(formData: any): void {
    // Adapt single form data to array as service expects array
    // Or update service to accept single card. For now, wrap in array.
    // Also need to handle types if form returns strings for dates etc.
    const cardData = {
      ...formData,
      status: 'inactive' // Default status
    };
    this.cardService.addCards([cardData]);
    this.router.navigate(['/cards']);
  }

  onCancel(): void {
    this.router.navigate(['/cards']);
  }
}
